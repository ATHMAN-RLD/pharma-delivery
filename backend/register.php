<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Guarantee db.php is loaded relative to this script
require_once __DIR__ . '/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if (!empty($data->full_name) && !empty($data->email) && !empty($data->password)) {
        // Check if email already exists
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":email", $data->email);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Email address is already registered."]);
            exit();
        }

        $query = "INSERT INTO users (full_name, email, password, role) VALUES (:full_name, :email, :password, :role)";
        $stmt = $db->prepare($query);

        $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
        $role = !empty($data->role) ? $data->role : 'customer';

        $stmt->bindParam(":full_name", $data->full_name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":role", $role);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Account created successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create user account."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Please complete all required fields."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
?> 