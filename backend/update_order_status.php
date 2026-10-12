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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_id) && !empty($data->status)) {
    $query = "UPDATE orders SET status = :status WHERE id = :id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":id", $data->order_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Order status updated to " . $data->status]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update order status."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid payload."]);
}
?>  