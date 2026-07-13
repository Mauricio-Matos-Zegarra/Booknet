<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// =========================================================================
// 1. CONFIGURACIÓN CORS
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') { 
    http_response_code(405); 
    echo json_encode(["message" => "Método no permitido."]); 
    exit(); 
}
// =========================================================================

// Usamos el cuerpo de la petición (JSON) para recibir los datos
$data = json_decode(file_get_contents("php://input"));


// 2. VALIDACIÓN DE DATOS REQUERIDOS
if (empty($data->id) || empty($data->id_usuario) || empty($data->titulo) || empty($data->autor) || empty($data->genero) || empty($data->descripcion) || empty($data->editorial) || empty($data->idioma)) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan datos requeridos para la actualización."]);
    exit();
}

// 3. Asignar variables
$id = (int)$data->id;
$id_usuario = (int)$data->id_usuario;
$titulo = $data->titulo;
$autor = $data->autor;
$genero = $data->genero;
$descripcion = $data->descripcion;
$editorial = $data->editorial;
$idioma = $data->idioma;


// 4. Consulta UPDATE SQL (Usamos la cláusula WHERE para verificar el ID y la propiedad)
// CRÍTICO: 'id_usuario = ?' asegura que solo el propietario pueda editar el libro.
$query = "UPDATE libros 
          SET 
            titulo = ?, 
            autor = ?, 
            genero = ?, 
            descripcion = ?,
            editorial = ?,
            idioma = ?
          WHERE 
            id = ? AND id_usuario = ?";

$stmt = $conn->prepare($query);

// Vincular los parámetros (sssssiii = 6 strings, 2 integers)
$stmt->bind_param("sssssii", 
    $titulo, 
    $autor, 
    $genero, 
    $descripcion, 
    $editorial, 
    $idioma,
    $id,
    $id_usuario
);

// 5. Ejecutar la consulta
if ($stmt->execute()) {
    // 6. Verificar si alguna fila fue realmente afectada
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(["message" => "Libro actualizado con éxito."]);
    } else {
        // Esto puede pasar si no hay cambios o si el ID del usuario no coincide
        http_response_code(200);
        echo json_encode(["message" => "No se realizaron cambios o no tienes permiso para editar este libro."]);
    }
} else {
    // Error de la base de datos
    http_response_code(500);
    echo json_encode(["message" => "Error al actualizar el libro: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>