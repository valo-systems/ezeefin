<?php
/**
 * EzeeFin API — front controller (Phase 6 scaffold).
 * REST-style JSON API for cPanel/Apache + PHP 8.2+ + MySQL (PDO).
 * All /api/* requests are rewritten here (see .htaccess).
 */
declare(strict_types=1);

require __DIR__ . '/src/bootstrap.php';
require __DIR__ . '/src/router.php';
require __DIR__ . '/src/controllers.php';

$router = new Router('/api');

// ---- Public intake (rate-limited, honeypot-checked) ----
$router->post('/enquiries',        [EnquiryController::class, 'createFound']);
$router->post('/vehicle-requests', [EnquiryController::class, 'createFind']);
$router->post('/fleet-enquiries',  [EnquiryController::class, 'createFleet']);

// ---- Auth ----
$router->post('/auth/login',  [AuthController::class, 'login']);    // staff
$router->post('/auth/logout', [AuthController::class, 'logout']);
$router->post('/auth/otp',    [AuthController::class, 'requestOtp']); // customer
$router->post('/auth/verify', [AuthController::class, 'verifyOtp']);

// ---- Case resources (object-level authz inside controllers) ----
$router->get('/applications/{id}',                 [CaseController::class, 'show']);
$router->patch('/applications/{id}',               [CaseController::class, 'update'], 'staff');
$router->get('/applications/{id}/status-history',  [CaseController::class, 'history']);
$router->get('/applications/{id}/tasks',           [CaseController::class, 'tasks']);
$router->get('/applications/{id}/documents',       [DocumentController::class, 'index']);
$router->post('/applications/{id}/documents',      [DocumentController::class, 'upload']);
$router->patch('/applications/{id}/documents',     [DocumentController::class, 'review'], 'staff');
$router->get('/applications/{id}/vehicle-options', [OptionController::class, 'index']);
$router->patch('/applications/{id}/vehicle-options', [OptionController::class, 'select']);
$router->get('/applications/{id}/messages',        [MessageController::class, 'index']);
$router->post('/applications/{id}/messages',       [MessageController::class, 'create']);

// ---- Staff admin ----
$router->get('/admin/leads',           [AdminController::class, 'leads'], 'staff');
$router->get('/admin/applications',    [AdminController::class, 'applications'], 'staff');
$router->post('/admin/vehicle-options',[AdminController::class, 'publishOption'], 'staff');
$router->patch('/admin/tasks/{id}',    [AdminController::class, 'updateTask'], 'staff');

$router->dispatch();
