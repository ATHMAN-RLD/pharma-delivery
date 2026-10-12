<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Mombasa Route Coordinates (Pharmacy Hub to Nyali)
$startLat = -4.0547;
$startLng = 39.6738;
$endLat   = -4.0321;
$endLng   = 39.6922;

// Simulate a 60-second delivery route cycle
$cycleDuration = 60; 
$elapsed = time() % $cycleDuration;
$progress = $elapsed / $cycleDuration; // Value between 0.0 and 1.0

// Interpolate current GPS position along the path
$currentLat = $startLat + ($endLat - $startLat) * $progress;
$currentLng = $startLng + ($endLng - $startLng) * $progress;

$status = $progress > 0.95 ? "Arrived" : "In Transit";

echo json_encode([
    "status" => "success",
    "order_id" => 101,
    "delivery_status" => $status,
    "progress_percentage" => round($progress * 100),
    "current_location" => [
        "lat" => round($currentLat, 6),
        "lng" => round($currentLng, 6)
    ],
    "eta_minutes" => max(1, round((1 - $progress) * 15))
]);
?> 