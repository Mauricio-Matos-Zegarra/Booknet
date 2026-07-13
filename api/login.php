<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// =========================================================================
// 1. CONFIGURACIÓN CORS (Permitir comunicación con React)
// =========================================================================
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido."]);
    exit();
}
// =========================================================================

// 2. Obtener los datos JSON enviados por React
$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan datos de correo electrónico o contraseña."]);
    exit();
}

$email = $data->email;
$password = $data->password;

// 3. Buscar al usuario por correo electrónico
$sql = "SELECT id, username, password, nombre FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // 4. Verificar la contraseña cifrada
    if (password_verify($password, $user['password'])) {
        
        // ¡Login exitoso!
        http_response_code(200);
        
        // Devolver los datos esenciales del usuario a React
        echo json_encode([
            "message" => "Inicio de sesión exitoso.",
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'], // Correo electrónico
                "nombre" => $user['nombre'],
            ]
        ]);
    } else {
        // Contraseña incorrecta
        http_response_code(401);
        echo json_encode(["message" => "Contraseña incorrecta."]);
    }
} else {
    // Usuario no encontrado
    http_response_code(404);
    echo json_encode(["message" => "Correo electrónico no registrado."]);
}

$stmt->close();
$conn->close();
?>