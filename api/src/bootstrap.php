<?php
declare(strict_types=1);

// Config lives OUTSIDE the web root in production; config.sample.php documents the shape.
$configPath = dirname(__DIR__, 2) . '/config/ezeefin.php';
if (!is_file($configPath)) { $configPath = __DIR__ . '/../config.sample.php'; }
$CONFIG = require $configPath;

error_reporting(E_ALL);
ini_set('display_errors', $CONFIG['debug'] ? '1' : '0');
ini_set('log_errors', '1');

session_set_cookie_params([
    'httponly' => true,
    'secure'   => !$CONFIG['debug'],
    'samesite' => 'Lax',
    'path'     => '/',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function db(): PDO {
    static $pdo = null;
    global $CONFIG;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host={$CONFIG['db']['host']};dbname={$CONFIG['db']['name']};charset=utf8mb4",
            $CONFIG['db']['user'],
            $CONFIG['db']['pass'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
    return $pdo;
}

function json_input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function require_fields(array $in, array $fields): array {
    $errors = [];
    foreach ($fields as $f) {
        if (!isset($in[$f]) || trim((string)$in[$f]) === '') { $errors[$f] = 'required'; }
    }
    if ($errors) { respond(422, ['error' => 'validation', 'fields' => $errors]); }
    return $in;
}

function audit(string $actor, string $action, string $entity, string $entityId, array $detail = []): void {
    $stmt = db()->prepare(
        'INSERT INTO audit_logs (actor, action, entity, entity_id, detail, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())'
    );
    $stmt->execute([$actor, $action, $entity, $entityId, json_encode($detail)]);
}

/** Simple per-IP rate limit for public endpoints (DB-backed; swap for Redis if available). */
function rate_limit(string $bucket, int $max, int $windowSec): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $stmt = db()->prepare(
        'SELECT COUNT(*) c FROM rate_hits WHERE bucket = ? AND ip = ? AND at > (NOW() - INTERVAL ? SECOND)'
    );
    $stmt->execute([$bucket, $ip, $windowSec]);
    if ((int)$stmt->fetch()['c'] >= $max) {
        respond(429, ['error' => 'too_many_requests']);
    }
    db()->prepare('INSERT INTO rate_hits (bucket, ip, at) VALUES (?, ?, NOW())')->execute([$bucket, $ip]);
}

function current_staff(): ?array { return $_SESSION['staff'] ?? null; }
function current_customer(): ?array { return $_SESSION['customer'] ?? null; }

function guard(string $role): void {
    if ($role === 'staff' && !current_staff()) { respond(401, ['error' => 'unauthenticated']); }
    if ($role === 'customer' && !current_customer() && !current_staff()) { respond(401, ['error' => 'unauthenticated']); }
}

/** Object-level authorization: customers may only touch their own case. */
function authorize_case(string $caseId): array {
    $stmt = db()->prepare('SELECT * FROM applications WHERE id = ? OR reference = ?');
    $stmt->execute([$caseId, $caseId]);
    $case = $stmt->fetch();
    if (!$case) { respond(404, ['error' => 'not_found']); }
    if (current_staff()) { return $case; }
    $cust = current_customer();
    if (!$cust || $cust['customer_id'] !== $case['customer_id']) {
        respond(403, ['error' => 'forbidden']);
    }
    return $case;
}
