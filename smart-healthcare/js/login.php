<?php
session_start();
require 'db.php'; // PDO connection

if ($_POST) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email=?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        if ($user['role'] === 'patient') header("Location: patient_dashboard.php");
        else header("Location: doctor_dashboard.php");
        exit;
    } else {
        $error = "Invalid login";
    }
}
?>
<form method="POST">
    <input name="email" placeholder="Email">
    <input name="password" type="password" placeholder="Password">
    <button>Login</button>
</form>
<?php if(isset($error)) echo $error; ?>
