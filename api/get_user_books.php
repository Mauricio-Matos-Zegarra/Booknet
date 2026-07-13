<?php
// Incluye la lógica de conexión a la base de datos
include 'db.php';

// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if (isset($_GET['user_id'])) {
$user_id = intval($_GET['user_id']); 

// 2. CONSULTA SQL CORREGIDA: Usamos 'id' directamente y la sintaxis WHERE es segura.
$sql = "SELECT id, id_usuario, titulo, autor, genero, descripcion, editorial, idioma, ruta_pdf, ruta_portada 
        FROM libros 
        WHERE id_usuario = $user_id /* CRÍTICO: id_usuario es INT, no necesita comillas si usamos intval() */
        ORDER BY fecha_publicacion DESC";

$result = $conn->query($sql);

$books = array();

if ($result) {
if ($result->num_rows > 0) {
while ($row = $result->fetch_assoc()) {

$ruta_pdf_limpia = ltrim($row['ruta_pdf'], '/'); 
$ruta_portada_limpia = ltrim($row['ruta_portada'], '/');

$books[] = array(
// AHORA ES CORRECTO: La DB ya devuelve la columna 'id'
"id" => $row['id'], 
"user_id" => $row['id_usuario'],
"titulo" => $row['titulo'],
"autor" => $row['autor'],
"genero" => $row['genero'],
"editorial" => $row['editorial'],
"idioma" => $row['idioma'],
"resumen" => $row['descripcion'], 
"linkDescarga" => 'http://localhost/' . $ruta_pdf_limpia, 
"portadaURL" => 'http://localhost/' . $ruta_portada_limpia,
);
}
}

// 4. Devuelve los datos
http_response_code(200);
echo json_encode($books);

} else {
// Error de ejecución
http_response_code(500);
echo json_encode(array("message" => "Error al ejecutar la consulta: " . $conn->error));
}
} else {
// Falta el parámetro
http_response_code(400);
echo json_encode(array("message" => "Falta el parámetro user_id."));
}

$conn->close();
?>