<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php'; // Aquí se define $conn

// =========================================================================
// 1. CONFIGURACIÓN CORS
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Asegurarse de que el método de solicitud es GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
    exit();
}
// =========================================================================


// 2. OBTENER ID DE USUARIO (pasado como parámetro de consulta: ?user_id=X)
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Falta el ID de usuario."]);
    exit();
}

// 3. CONSULTA SQL SEGURA para seleccionar solo los libros del usuario
$query = "SELECT id, titulo, autor, genero, descripcion, ruta_pdf, ruta_portada 
          FROM libros 
          WHERE id_usuario = ?";

$stmt = $conn->prepare($query);

// Vincular el parámetro (i = integer)
$stmt->bind_param("i", $user_id);

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

$books = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()){
        // Formatear los datos para el Frontend
        $books[] = array(
            "id" => $row['id'],
            "titulo" => $row['titulo'],
            "autor" => $row['autor'],
            "genero" => $row['genero'],
            "resumen" => $row['descripcion'],
            // Las rutas deben ser absolutas para el Frontend
            "linkDescarga" => 'http://localhost/uploads/pdfs/' . basename($row['ruta_pdf']),
            "portadaURL" => 'http://localhost/uploads/covers/' . basename($row['ruta_portada']),
        );
    }
}

// 4. Devolver los resultados.
http_response_code(200);
echo json_encode($books);

$stmt->close();
$conn->close();
?>