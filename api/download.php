<?php
// api/download.php

// Ruta base donde se encuentran todos los archivos subidos
$file_path_base = 'D:/xampp/htdocs/'; 
$file_url = isset($_GET['file']) ? $_GET['file'] : ''; // Obtener la ruta relativa: uploads/pdfs/nombre.pdf

if (empty($file_url) || strpos($file_url, '..') !== false) {
    http_response_code(400);
    die("Falta la ruta del archivo o la ruta no es segura.");
}

// Combinar la ruta base del servidor con la ruta relativa
$full_path = $file_path_base . $file_url; 

// Verificar que el archivo existe
if (!file_exists($full_path)) {
    http_response_code(404);
    die("Archivo no encontrado en el servidor: " . $full_path);
}

// 1. Establecer las cabeceras de descarga
header('Content-Type: application/pdf'); // Tipo MIME del archivo
header('Content-Disposition: attachment; filename="' . basename($full_path) . '"'); // Fuerza la descarga con el nombre original
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($full_path)); // Tamaño del archivo

// 2. Limpiar el buffer de salida antes de enviar el archivo
ob_clean();
flush();

// 3. Enviar el archivo al navegador
readfile($full_path);

exit;
?>