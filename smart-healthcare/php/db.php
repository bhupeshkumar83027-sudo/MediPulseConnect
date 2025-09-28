<?php
$DB_HOST = 'localhost';
$DB_NAME = 'smart_healthcare';
$DB_USER = 'root';      // ya aapka MySQL username
$DB_PASS = '';          // ya aapka MySQL password

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die(json_encode(['status'=>'error','message'=>'Database connection failed: '.$e->getMessage()]));
}
?>
