<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php'; // ASEGÚRATE DE QUE ESTE ARCHIVO FUNCIONE CORRECTAMENTE

// =========================================================================
// 1. CONFIGURACIÓN CORS
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(["message" => "Método no permitido."]); exit(); }
// =========================================================================


// 2. DEFINIR CARPETA DE SUBIDAS (UTILIZANDO RUTA ABSOLUTA PARA DEPURACIÓN)
$upload_dir_base = 'D:/xampp/htdocs/uploads/'; // O 'C:/xampp/htdocs/uploads/' si corresponde
$upload_dir_pdfs = $upload_dir_base . 'pdfs/';
$upload_dir_covers = $upload_dir_base . 'covers/';

// Asegurar que las subcarpetas existan 
if (!is_dir($upload_dir_pdfs)) { mkdir($upload_dir_pdfs, 0777, true); }
if (!is_dir($upload_dir_covers)) { mkdir($upload_dir_covers, 0777, true); }


// Función de respuesta centralizada
function sendResponse($code, $message, $error = null) {
    http_response_code($code);
    // Añadimos el error de MySQL/PHP al JSON
    echo json_encode(["message" => $message, "error" => $error]);
    exit();
}


// =========================================================================
// 3. VALIDACIÓN DE DATOS (Verifica TODOS los campos)
// =========================================================================

if (empty($_POST['id_usuario']) || empty($_POST['titulo']) || empty($_POST['autor']) || empty($_POST['genero']) || empty($_POST['descripcion']) || empty($_POST['editorial']) || empty($_POST['idioma']) || empty($_FILES['pdf_file']) || empty($_FILES['cover_file'])) {
    sendResponse(400, "Faltan datos de texto o archivos requeridos.");
}

$id_usuario = (int)$_POST['id_usuario'];
$titulo = trim($_POST['titulo']);
$autor = trim($_POST['autor']);
$genero = trim($_POST['genero']);
$descripcion = trim($_POST['descripcion']);
$editorial = trim($_POST['editorial']); 
$idioma = trim($_POST['idioma']);     

if ($id_usuario <= 0) { sendResponse(401, "ID de usuario inválido o no autenticado."); }


// =========================================================================
// 4. PROCESAMIENTO Y MOVIMIENTO DE ARCHIVOS
// =========================================================================
// (Esta sección no ha cambiado, pero si falla, el error lo reportará)

$pdf_file = $_FILES['pdf_file'];
$cover_file = $_FILES['cover_file'];
$time = time();
$safe_title = strtolower(preg_replace("/[^a-zA-Z0-9]/", "_", $titulo));
$unique_name = $id_usuario . "_" . $safe_title . "_" . $time;

$pdf_target_name = $unique_name . ".pdf";
$pdf_target_path = $upload_dir_pdfs . $pdf_target_name;

if (!move_uploaded_file($pdf_file['tmp_name'], $pdf_target_path)) {
    // Si falla la subida (ej. por permisos), se detiene aquí y reporta el error 500
    sendResponse(500, "Error crítico al guardar el PDF en el servidor. (Ruta: " . $pdf_target_path . ")", "Revisar permisos de carpeta 'uploads' o la ruta absoluta en PHP.");
}

// ... (PROCESAMIENTO DE PORTADA - Asumimos que esta parte del código está bien)
$cover_target_name = $unique_name . "_cover." . pathinfo($cover_file['name'], PATHINFO_EXTENSION);
$cover_target_path = $upload_dir_covers . $cover_target_name;

if (!move_uploaded_file($cover_file['tmp_name'], $cover_target_path)) {
    @unlink($pdf_target_path); // Limpiar si falla
    sendResponse(500, "Error crítico al guardar la portada.", "Revisar permisos de carpeta 'uploads' o la ruta absoluta en PHP.");
}

// Ruta final para la base de datos (relativa a htdocs/)
$ruta_pdf_db = 'uploads/pdfs/' . $pdf_target_name;
$ruta_portada_db = 'uploads/covers/' . $cover_target_name; 


// =========================================================================
// 5. GUARDAR METADATOS EN LA BASE DE DATOS
// =========================================================================

$sql = "INSERT INTO libros (id_usuario, titulo, autor, genero, descripcion, editorial, idioma, ruta_pdf, ruta_portada) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("issssssss", 
    $id_usuario, $titulo, $autor, $genero, $descripcion, $editorial, $idioma,
    $ruta_pdf_db, $ruta_portada_db
);

if ($stmt->execute()) {
    sendResponse(201, "Libro publicado con éxito. ID: " . $stmt->insert_id);
} else {
    // ¡ESTA ES LA LÍNEA CLAVE! Reporta el error exacto de MySQL
    @unlink($pdf_target_path); 
    @unlink($cover_target_path);
    sendResponse(500, "Error al guardar el libro en la base de datos.", $stmt->error);
}

$stmt->close();
$conn->close();
?>