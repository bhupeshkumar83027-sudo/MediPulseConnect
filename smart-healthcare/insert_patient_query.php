<?php
header('Content-Type: application/json');
include 'db.php'; // Make sure this has your MySQL connection

$patient_id = $_POST['patient_id'] ?? null;
$subject = $_POST['subject'] ?? null;
$message = $_POST['message'] ?? null;

if (!$patient_id || !$subject || !$message) {
    echo json_encode(['status'=>'error','message'=>'All fields are required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO patient_queries (patient_id, subject, message) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $patient_id, $subject, $message);

if ($stmt->execute()) {
    echo json_encode(['status'=>'success','message'=>'Query submitted successfully']);
} else {
    echo json_encode(['status'=>'error','message'=>'Database error']);
}

$stmt->close();
$conn->close();
