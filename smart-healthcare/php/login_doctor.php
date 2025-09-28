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
    // Doctor user fetch karna
    $stmt = $pdo->prepare("SELECT id, full_name, email, password_hash FROM users WHERE email = ? AND role = 'doctor' LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['status'=>'error','message'=>'Doctor not found']);
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
    $_SESSION['user_role']  = 'doctor';

    echo json_encode([
        'status'   => 'success',
        'message'  => 'Login successful',
        'redirect' => 'dashboard_doctor.html' // doctor dashboard ke liye proper redirect
    ]);

} catch (PDOException $e) {
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
    exit;
}
?>
