<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// =========================================================================
// 1. CONFIGURACIÓN CORS (Crucial para que React pueda comunicarse con PHP)
// =========================================================================
// Permitir acceso desde la aplicación React
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");

// Manejar la solicitud OPTIONS (preflight request de navegadores)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Asegurarse de que el método de solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
    exit();
}
// =========================================================================


// 2. Obtener y decodificar los datos JSON enviados por React
$data = json_decode(file_get_contents("php://input"));

// 3. Validar que TODOS los campos requeridos estén presentes
if (empty($data->nombre) || empty($data->apellido) || empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan datos requeridos (nombre, apellido, correo o contraseña)."]);
    exit();
}

// Recolección de datos
$nombre = $data->nombre;
$apellido = $data->apellido;
$email = $data->email; 
$password = $data->password;

// 4. Cifrar la Contraseña (¡CRÍTICO para la seguridad!)
$password_hashed = password_hash($password, PASSWORD_DEFAULT);

// 5. Preparar la consulta SQL para INSERTAR TODOS LOS CAMPOS
// NOTA: Usamos el email como el 'username' y el 'email' en la DB.
$sql = "INSERT INTO usuarios (nombre, apellido, email, username, password) VALUES (?, ?, ?, ?, ?)";

// 6. Usar consultas preparadas para mayor seguridad
$stmt = $conn->prepare($sql);

// 'sssss' indica que se están enlazando 5 cadenas de texto (strings)
$stmt->bind_param("sssss", $nombre, $apellido, $email, $email, $password_hashed); 

// 7. Ejecutar la consulta
if ($stmt->execute()) {
    http_response_code(201); // 201 Created
    echo json_encode(["message" => "Usuario registrado con éxito.", "user_id" => $stmt->insert_id]);
} else {
    // Manejo de errores (principalmente el error 1062, correo/usuario ya en uso)
    if ($conn->errno == 1062) {
        http_response_code(409); // 409 Conflict
        echo json_encode(["message" => "El correo electrónico ya está registrado."]);
    } else {
        http_response_code(500); // 500 Internal Server Error
        echo json_encode(["message" => "Error al registrar el usuario: " . $stmt->error]);
    }
}

// 8. Cerrar recursos
$stmt->close();
$conn->close();
?>