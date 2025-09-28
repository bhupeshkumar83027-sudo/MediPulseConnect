<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';
session_start();

// Optional: log errors, hide from browser
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/error.log');

$data = $_POST;
$required = ['full_name','email','phone','password'];

foreach ($required as $r) {
    if (empty($data[$r])) {
        echo json_encode(['status'=>'error','message'=>"$r is required"]);
        exit;
    }
}


$full_name = trim($data['full_name']);
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$phone = trim($data['phone']);
$password = $data['password'];

if (!$email) {
    echo json_encode(['status'=>'error','message'=>'Invalid email']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['status'=>'error','message'=>'Password must be at least 6 characters']);
    exit;
}

if (!preg_match('/^[0-9]{10,15}$/', $phone)) {
    echo json_encode(['status'=>'error','message'=>'Invalid phone number']);
    exit;
}

// Duplicate email check
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND role = 'patient' LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['status'=>'error','message'=>'Email already registered as patient']);
    exit;
}

// Insert patient
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password_hash, role, created_at) VALUES (?, ?, ?, ?, 'patient', NOW())");

try {
    $stmt->execute([$full_name, $email, $phone, $hash]);

    // Auto-login
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $full_name;
    $_SESSION['user_role'] = 'patient';

    echo json_encode(['status'=>'success','message'=>'Patient registered successfully']);
} catch (Exception $e) {
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
?>
