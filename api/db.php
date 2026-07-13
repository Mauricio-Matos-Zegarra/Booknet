<?php
// Datos de conexión
$host = "localhost"; 
$user = "root";      
$password = "";      
$database = "libreria_digital"; 

// 1. Establecer la conexión usando la clase mysqli
// Nota: mysqli es la extensión moderna de PHP para interactuar con MySQL.
$conn = new mysqli($host, $user, $password, $database);

// 2. Verificar si la conexión falló
if ($conn->connect_error) {
    // Si falla, detiene el script y muestra el error.
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

// 3. Establecer el cotejamiento (charset) a UTF-8 para manejo de tildes
$conn->set_charset("utf8mb4");

// ¡La variable $conn ahora contiene el enlace a la base de datos!
?>