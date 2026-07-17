<?php
declare(strict_types=1);

final class EnquiryController {
    private function create(string $journey, array $required): void {
        rate_limit('enquiry', 10, 3600);
        $in = json_input();
        if (!empty($in['website'])) { respond(201, ['reference' => 'EZ-0000']); } // honeypot: pretend success
        require_fields($in, $required);
        if (($in['consent'] ?? '') !== 'yes') { respond(422, ['error' => 'validation', 'fields' => ['consent' => 'required']]); }
        if (!preg_match('/^0\d{9}$/', preg_replace('/[\s\-]/', '', $in['phone'] ?? ''))) {
            respond(422, ['error' => 'validation', 'fields' => ['phone' => 'invalid']]);
        }
        $reference = 'EZ-' . str_pad((string)random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        $stmt = db()->prepare(
            'INSERT INTO leads (reference, journey, name, phone, city, payload, consent_version, created_at, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), "new")'
        );
        $stmt->execute([
            $reference, $journey,
            trim((string)$in['name']), preg_replace('/[\s\-]/', '', (string)$in['phone']),
            trim((string)($in['city'] ?? $in['region'] ?? '')),
            json_encode($in, JSON_UNESCAPED_UNICODE),
            'v1-2026-07',
        ]);
        // Consent is stored immutably alongside the lead.
        db()->prepare('INSERT INTO customer_consents (lead_reference, wording_version, granted_at, ip)
                       VALUES (?, ?, NOW(), ?)')
            ->execute([$reference, 'v1-2026-07', $_SERVER['REMOTE_ADDR'] ?? '']);
        audit('public', 'lead.created', 'lead', $reference);
        respond(201, ['reference' => $reference]);
    }
    public function createFind(array $p): void  { $this->create('find',  ['name', 'phone']); }
    public function createFound(array $p): void { $this->create('found', ['name', 'phone', 'vehicle']); }
    public function createFleet(array $p): void { $this->create('fleet', ['name', 'phone', 'company']); }
}

final class AuthController {
    public function login(array $p): void {
        rate_limit('login', 8, 900);
        $in = require_fields(json_input(), ['email', 'password']);
        $stmt = db()->prepare('SELECT * FROM staff_users WHERE email = ? AND active = 1');
        $stmt->execute([strtolower(trim($in['email']))]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($in['password'], $user['password_hash'])) {
            audit('public', 'auth.failed', 'staff_user', $in['email']);
            respond(401, ['error' => 'invalid_credentials']); // same response either way (no enumeration)
        }
        session_regenerate_id(true);
        $_SESSION['staff'] = ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']];
        audit($user['email'], 'auth.login', 'staff_user', (string)$user['id']);
        respond(200, ['name' => $user['name'], 'role' => $user['role']]);
    }
    public function logout(array $p): void {
        audit(current_staff()['name'] ?? 'customer', 'auth.logout', 'session', session_id());
        session_destroy();
        respond(200, ['ok' => true]);
    }
    public function requestOtp(array $p): void {
        rate_limit('otp', 5, 900);
        $in = require_fields(json_input(), ['reference']);
        $stmt = db()->prepare('SELECT a.id, c.phone FROM applications a JOIN customers c ON c.id = a.customer_id WHERE a.reference = ?');
        $stmt->execute([trim($in['reference'])]);
        if ($case = $stmt->fetch()) {
            $otp = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            db()->prepare('INSERT INTO otp_codes (application_id, code_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL 10 MINUTE)')
                ->execute([$case['id'], password_hash($otp, PASSWORD_DEFAULT)]);
            // TODO Phase 6: send $otp via SMS/WhatsApp/email provider. Never in the response.
        }
        respond(200, ['ok' => true]); // identical response whether or not the reference exists
    }
    public function verifyOtp(array $p): void {
        rate_limit('otp-verify', 10, 900);
        $in = require_fields(json_input(), ['reference', 'code']);
        $stmt = db()->prepare(
            'SELECT o.*, a.customer_id FROM otp_codes o
             JOIN applications a ON a.id = o.application_id
             WHERE a.reference = ? AND o.expires_at > NOW() AND o.used = 0
             ORDER BY o.id DESC LIMIT 1'
        );
        $stmt->execute([trim($in['reference'])]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($in['code'], $row['code_hash'])) {
            respond(401, ['error' => 'invalid_code']);
        }
        db()->prepare('UPDATE otp_codes SET used = 1 WHERE id = ?')->execute([$row['id']]);
        session_regenerate_id(true);
        $_SESSION['customer'] = ['customer_id' => $row['customer_id'], 'application_id' => $row['application_id']];
        respond(200, ['ok' => true]);
    }
}

final class CaseController {
    public function show(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        // Customers receive curated fields only — no internal notes.
        respond(200, [
            'id' => $case['id'], 'reference' => $case['reference'],
            'customer' => $case['customer_name'], 'vehicleNeed' => $case['vehicle_need'],
            'budget' => $case['budget'], 'stage' => $case['stage'],
            'consultant' => $case['consultant'], 'createdAt' => $case['created_at'],
        ]);
    }
    public function update(array $p): void {
        $case = authorize_case($p['id']);
        $in = json_input();
        if (($in['action'] ?? '') === 'advance') {
            $stages = ['received','review','sourcing','options','finance','insurance','delivery-prep','delivered'];
            $i = array_search($case['stage'], $stages, true);
            $next = $stages[min($i + 1, count($stages) - 1)];
            db()->prepare('UPDATE applications SET stage = ? WHERE id = ?')->execute([$next, $case['id']]);
            db()->prepare('INSERT INTO application_status_history (application_id, stage, changed_by, created_at) VALUES (?, ?, ?, NOW())')
                ->execute([$case['id'], $next, current_staff()['name']]);
            audit(current_staff()['name'], 'case.stage', 'application', (string)$case['id'], ['from' => $case['stage'], 'to' => $next]);
            respond(200, ['stage' => $next]);
        }
        respond(422, ['error' => 'unknown_action']);
    }
    public function history(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $stmt = db()->prepare('SELECT stage, changed_by, created_at FROM application_status_history WHERE application_id = ? ORDER BY id');
        $stmt->execute([$case['id']]);
        respond(200, $stmt->fetchAll());
    }
    public function tasks(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $stmt = db()->prepare('SELECT id, label, who, done FROM tasks WHERE application_id = ? ORDER BY id');
        $stmt->execute([$case['id']]);
        respond(200, $stmt->fetchAll());
    }
}

final class DocumentController {
    public function index(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $stmt = db()->prepare('SELECT id, label, status, file_name AS fileName FROM document_requests WHERE application_id = ? ORDER BY id');
        $stmt->execute([$case['id']]);
        respond(200, $stmt->fetchAll());
    }
    public function upload(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        // Phase 6: multipart handling — allow-list (pdf/jpg/png), 10 MB cap,
        // random opaque name, stored OUTSIDE web root, served only via authenticated download.
        $in = require_fields(json_input(), ['docId']);
        db()->prepare('UPDATE document_requests SET status = "uploaded", file_name = ?, uploaded_at = NOW() WHERE id = ? AND application_id = ?')
            ->execute([$in['fileName'] ?? 'upload.pdf', $in['docId'], $case['id']]);
        audit('customer', 'document.uploaded', 'document_request', (string)$in['docId']);
        respond(200, ['ok' => true]);
    }
    public function review(array $p): void {
        $case = authorize_case($p['id']);
        $in = require_fields(json_input(), ['docId']);
        $status = !empty($in['ok']) ? 'verified' : 'rejected';
        db()->prepare('UPDATE document_requests SET status = ? WHERE id = ? AND application_id = ?')
            ->execute([$status, $in['docId'], $case['id']]);
        audit(current_staff()['name'], 'document.' . $status, 'document_request', (string)$in['docId']);
        respond(200, ['ok' => true]);
    }
}

final class OptionController {
    public function index(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $stmt = db()->prepare(
            'SELECT id, title, year, price, est_instalment AS estInstalment, mileage, dealership, image, notes, selected
             FROM vehicle_options WHERE application_id = ? AND published = 1 ORDER BY id'
        );
        $stmt->execute([$case['id']]);
        respond(200, $stmt->fetchAll());
    }
    public function select(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $in = require_fields(json_input(), ['optionId']);
        db()->prepare('UPDATE vehicle_options SET selected = (id = ?) WHERE application_id = ?')
            ->execute([$in['optionId'], $case['id']]);
        audit('customer', 'option.selected', 'vehicle_option', (string)$in['optionId']);
        respond(200, ['ok' => true]);
    }
}

final class MessageController {
    public function index(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $stmt = db()->prepare('SELECT id, sender AS `from`, author, body, created_at AS `at` FROM messages WHERE application_id = ? ORDER BY id');
        $stmt->execute([$case['id']]);
        respond(200, $stmt->fetchAll());
    }
    public function create(array $p): void {
        guard('customer');
        $case = authorize_case($p['id']);
        $in = require_fields(json_input(), ['body']);
        $from = current_staff() ? 'staff' : 'customer';
        $author = current_staff()['name'] ?? $case['customer_name'];
        db()->prepare('INSERT INTO messages (application_id, sender, author, body, created_at) VALUES (?, ?, ?, ?, NOW())')
            ->execute([$case['id'], $from, $author, strip_tags(trim($in['body']))]);
        respond(201, ['ok' => true]);
    }
}

final class AdminController {
    public function leads(array $p): void {
        $rows = db()->query('SELECT reference, journey, name, phone, city, status, created_at AS createdAt FROM leads ORDER BY id DESC LIMIT 200')->fetchAll();
        respond(200, $rows);
    }
    public function applications(array $p): void {
        $rows = db()->query('SELECT id, reference, customer_name AS customer, vehicle_need AS vehicleNeed, budget, stage, consultant, created_at AS createdAt FROM applications ORDER BY id DESC LIMIT 200')->fetchAll();
        respond(200, $rows);
    }
    public function publishOption(array $p): void {
        $in = require_fields(json_input(), ['applicationId', 'title', 'price', 'dealership']);
        db()->prepare('INSERT INTO vehicle_options (application_id, title, year, price, est_instalment, mileage, dealership, image, notes, published, selected)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)')
            ->execute([
                $in['applicationId'], $in['title'], (int)($in['year'] ?? 0), (int)$in['price'],
                (int)($in['estInstalment'] ?? 0), $in['mileage'] ?? '', $in['dealership'],
                $in['image'] ?? '', $in['notes'] ?? '',
            ]);
        audit(current_staff()['name'], 'option.published', 'application', (string)$in['applicationId']);
        respond(201, ['ok' => true]);
    }
    public function updateTask(array $p): void {
        $in = json_input();
        db()->prepare('UPDATE tasks SET done = ? WHERE id = ?')->execute([!empty($in['done']) ? 1 : 0, $p['id']]);
        audit(current_staff()['name'], 'task.updated', 'task', $p['id']);
        respond(200, ['ok' => true]);
    }
}
