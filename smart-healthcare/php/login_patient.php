<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';
session_start();

// POST se email & password lena
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validation
if (!$email || !$password) {
    echo json_encode(['status'=>'error','message'=>'Email and password required']);
    exit;
}

try {
    // Patient user fetch karna
    $stmt = $pdo->prepare("SELECT id, full_name, email, password_hash FROM users WHERE email = ? AND role = 'patient' LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['status'=>'error','message'=>'Patient not found']);
        exit;
    }

    // Password verify
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(['status'=>'error','message'=>'Invalid credentials']);
        exit;
    }

    // Login success → session set karna
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name']  = $user['full_name'];
    $_SESSION['user_role']  = 'patient';

    echo json_encode([
        'status'   => 'success',
        'message'  => 'Login successful',
        'redirect' => 'dashboard_patient.html' // proper patient dashboard redirect
    ]);

} catch (PDOException $e) {
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
    exit;
}
?>
