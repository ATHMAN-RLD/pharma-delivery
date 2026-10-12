<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, user_id, total_amount, status, payment_method, delivery_address, phone, created_at 
          FROM orders 
          ORDER BY created_at DESC";

$stmt = $db->prepare($query);

if ($stmt->execute()) {
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $orders]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to retrieve orders."]);
}
?>