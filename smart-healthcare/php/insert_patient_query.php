<?php
session_start();
header('Content-Type: application/json');
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // $patient_id = $_POST['patient_id'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!$patient_id || !$subject || !$message) {
        echo json_encode(['status' => 'error', 'message' => 'Missing fields']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO patient_queries ( subject, message) VALUES ( ?, ?)");
    $stmt->bind_param("iss", $patient_id, $subject, $message);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Message sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
