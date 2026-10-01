<?php
// Allow React frontend to post data (CORS headers)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

// Get JSON data sent from the client/frontend
$input = json_decode(file_get_contents("php://input"), true);

// Check if required fields exist
if (!isset($input['user_id'], $input['total_amount'], $input['payment_method'], $input['delivery_address'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required order information."
    ]);
    exit();
}

$user_id         = $input['user_id'];
$total_amount    = $input['total_amount'];
$payment_method  = $input['payment_method']; // 'mpesa' or 'card'
$delivery_address = $input['delivery_address'];

try {
    // Insert new order with payment_status 'pending'
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, payment_method, delivery_address) VALUES (?, ?, ?, ?)");
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