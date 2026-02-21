<?php
header('Content-Type: application/json');
session_start();

$host = 'localhost';
$db = 'smart_healthcare';
$user = 'root'; // replace with your DB username
$pass = '';     // replace with your DB password

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['status'=>'error', 'message'=>'DB connection failed']);
    exit;
}

$sql = "SELECT pq.id, pq.patient_id, pq.subject, pq.message, pq.timestamp, u.full_name AS patient_name
        FROM patient_queries pq
        JOIN users u ON pq.patient_id = u.id
        ORDER BY pq.timestamp DESC";

$result = $conn->query($sql);
$queries = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $queries[] = $row;
    }
}

echo json_encode(['status'=>'success', 'queries'=>$queries]);

$conn->close();
