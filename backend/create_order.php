<?php
// Allow React frontend to post JSON data across origins (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle HTTP OPTIONS preflight request from browser fetch
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Read raw JSON string from HTTP request body
$input = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($input['user_id'], $input['total_amount'], $input['payment_method'], $input['delivery_address'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required order details."
    ]);
    exit();
}

$user_id          = $input['user_id'];
$total_amount     = $input['total_amount'];
$payment_method   = $input['payment_method']; // 'mpesa' or 'card'
$delivery_address = $input['delivery_address'];

try {
    // Insert order record into MySQL using PDO prepared statement
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_method, delivery_address, payment_status) VALUES (?, ?, ?, ?, 'pending')");
    $stmt->execute([$user_id, $total_amount, $payment_method, $delivery_address]);

    $order_id = $pdo->lastInsertId();

    echo json_encode([
        "status" => "success",
        "message" => "Order created successfully!",
        "order_id" => $order_id
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 