<?php
// Configura la carpeta base donde se almacenarán los archivos
$baseDir = './descarga/';

// Verifica si el parámetro 'nombre' se ha enviado a través de POST
if (isset($_POST['carpetaRuta'])) {
    $carpetaNombre = $_POST['carpetaRuta'];
    $carpetaRuta = $baseDir . $carpetaNombre;

    // Verifica si la carpeta ya existe antes de crearla
    if (!file_exists($carpetaRuta)) {
        // Crea la carpeta con permisos adecuados (0755)
        mkdir($carpetaRuta, 0755, true);
        $mensaje = "Carpeta '$carpetaNombre' creada con éxito.";
    } else {
        $mensaje = "La carpeta '$carpetaNombre' ya existe.";
    }

    // Procesa la subida del archivo
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
            $archivo = $_FILES['archivo'];
            $archivoRuta = $carpetaRuta . '/' . basename($archivo['name']);

            // Mueve el archivo subido a la carpeta especificada
            if (move_uploaded_file($archivo['tmp_name'], $archivoRuta)) {
                echo json_encode(["status" => "success", "message" => "Archivo subido con éxito."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al mover el archivo."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Error en la subida del archivo."]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se ha especificado una carpeta."]);
}
?>
