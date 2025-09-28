<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';
session_start();

$data = $_POST;

// Basic server-side validation
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

// Optional: phone validation
if (!preg_match('/^[0-9]{10,15}$/', $phone)) {
    echo json_encode(['status'=>'error','message'=>'Invalid phone number']);
    exit;
}

// Check duplicate email
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND role = 'doctor' LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['status'=>'error','message'=>'Email already registered as doctor']);
    exit;
}

// Insert doctor
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password_hash, role, created_at) VALUES (?, ?, ?, ?, 'doctor', NOW())");

try {
    $stmt->execute([$full_name, $email, $phone, $hash]);

    // Optional: auto-login doctor
    $_SESSION['user_id']    = $pdo->lastInsertId();
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name']  = $full_name;
    $_SESSION['user_role']  = 'doctor';

    echo json_encode(['status'=>'success','message'=>'Doctor registered successfully']);
} catch (Exception $e) {
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
?>
