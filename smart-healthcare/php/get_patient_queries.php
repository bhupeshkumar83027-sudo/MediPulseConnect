<?php
session_start();

header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

try {
    $stmt = $pdo->prepare("SELECT pq.id, pq.subject, pq.message, pq.timestamp, pq.status, u.full_name AS patient_name FROM patient_queries pq JOIN users u ON pq.patient_id = u.id ORDER BY pq.timestamp DESC");
    $stmt->execute();
    $queries = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status'=>'success', 'queries'=>$queries]);
} catch (PDOException $e) {
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
?>
