<?php
// api/delete_book.php

include 'db.php';

// Configuración CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(["message" => "Método no permitido."]); exit(); }

// Respuesta centralizada
function sendResponse($code, $message) {
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

// 1. Obtener datos de la solicitud POST
// El Frontend enviará { id: bookId, id_usuario: userId }
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->id_usuario)) {
    sendResponse(400, "Faltan datos de identificación del libro o del usuario.");
}

$book_id = (int)$data->id;
$user_id = (int)$data->id_usuario;

// 2. Obtener rutas de archivos antes de borrar el registro
$query_paths = "SELECT ruta_pdf, ruta_portada FROM libros WHERE id = ? AND id_usuario = ?";
$stmt_paths = $conn->prepare($query_paths);
$stmt_paths->bind_param("ii", $book_id, $user_id);
$stmt_paths->execute();
$result_paths = $stmt_paths->get_result();
$stmt_paths->close();

if ($result_paths->num_rows === 0) {
    sendResponse(403, "Libro no encontrado o no tienes permiso para eliminarlo.");
}

$paths = $result_paths->fetch_assoc();
$ruta_pdf = $paths['ruta_pdf'];
$ruta_portada = $paths['ruta_portada'];


// 3. Eliminar el registro de la base de datos
$query_delete = "DELETE FROM libros WHERE id = ? AND id_usuario = ?";
$stmt_delete = $conn->prepare($query_delete);
$stmt_delete->bind_param("ii", $book_id, $user_id);

if ($stmt_delete->execute()) {
    if ($stmt_delete->affected_rows > 0) {
        
        // 4. Eliminar los archivos físicos del servidor (CRÍTICO)
        // La ruta 'uploads/' está un nivel arriba de 'api/'
        @unlink('../../' . $ruta_pdf);
        @unlink('../../' . $ruta_portada);
        
        $conn->close();
        sendResponse(200, "Publicación eliminada correctamente, incluyendo archivos.");
        
    } else {
        $conn->close();
        sendResponse(404, "El libro ya no existe o no se pudo eliminar.");
    }
} else {
    $conn->close();
    sendResponse(500, "Error de base de datos al eliminar: " . $stmt_delete->error);
}
?>