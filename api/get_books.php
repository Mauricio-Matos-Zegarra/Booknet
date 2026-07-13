<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// =========================================================================
// CONFIGURACIÓN CORS
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
    exit();
}
// =========================================================================

// 1. Consulta SQL para obtener todos los libros (AÑADIENDO EDITORIAL E IDIOMA)
$sql = "SELECT id, titulo, autor, genero, descripcion, editorial, idioma, ruta_pdf, ruta_portada 
        FROM libros 
        ORDER BY fecha_publicacion DESC";

$result = $conn->query($sql);

$books = [];
if ($result && $result->num_rows > 0) {
    // 2. Iterar sobre los resultados
    while($row = $result->fetch_assoc()) {
        
        // 3. Obtener la ruta completa tal como está en la DB (e.g., uploads/pdfs/nombre.pdf)
        $ruta_pdf_db = $row['ruta_pdf'];
        $ruta_portada_db = $row['ruta_portada'];
        
        $books[] = [
            'id' => $row['id'],
            'titulo' => $row['titulo'],
            'autor' => $row['autor'],
            'genero' => $row['genero'],
            'resumen' => $row['descripcion'],
            
            // ¡CAMPOS AÑADIDOS! (Para que BookDetails los muestre)
            'editorial' => $row['editorial'],
            'idioma' => $row['idioma'], 

            // RUTA DE DESCARGA FINAL CORREGIDA
            // CRÍTICO: Usar la ruta completa de la DB sin basename ni la carpeta 'pdfs/' fija, 
            // sino la ruta completa guardada en la columna ruta_pdf (ej: uploads/pdfs/...)
            'linkDescarga' => 'http://localhost/' . $ruta_pdf_db, 
            
            // Ruta de portada (ajustada para el frontend)
            'portadaURL' => 'http://localhost/' . $row['ruta_portada'],
        ];
    }
}

// 3. Devolver la lista de libros en formato JSON
http_response_code(200);
echo json_encode($books);

$conn->close();
?>