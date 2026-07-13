<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// =========================================================================
// 1. CONFIGURACIÓN CORS Y MÉTODO HTTP
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(["message" => "Método no permitido."]); exit(); }
// =========================================================================

// 2. OBTENER ID DEL LIBRO
$book_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (empty($book_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Falta el ID del libro."]);
    exit();
}

// 3. CONSULTA SQL SEGURA
$query = "SELECT id, id_usuario, titulo, autor, genero, descripcion, editorial, idioma, ruta_pdf, ruta_portada 
          FROM libros 
          WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $book_id); // 'i' para entero (integer)
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    
    // 4. Formatear los datos para el Frontend (React)
    // NOTA: Usamos la ruta completa de la DB sin el prefijo http://localhost/ para simplificar la lógica de Edición,
    // ya que React solo necesita el nombre del archivo para saber que el campo no está vacío.
    $book = [
        'id' => $row['id'],
        'id_usuario' => $row['id_usuario'],
        'titulo' => $row['titulo'],
        'autor' => $row['autor'],
        'genero' => $row['genero'],
        'descripcion' => $row['descripcion'], 
        'editorial' => $row['editorial'],
        'idioma' => $row['idioma'],
        // Rutas del servidor (necesitas la ruta relativa o el nombre de archivo)
        'ruta_pdf' => $row['ruta_pdf'],         // Ej: uploads/pdfs/nombre.pdf
        'ruta_portada' => $row['ruta_portada'], // Ej: uploads/covers/portada.jpg
    ];
    
    http_response_code(200);
    echo json_encode($book);

} else {
    http_response_code(404);
    echo json_encode(["message" => "Libro no encontrado."]);
}

$stmt->close();
$conn->close();
?>