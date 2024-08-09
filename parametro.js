// Obtén la URL actual
const urlActual = window.location.href;

// Verifica si el parámetro 'nombre' ya está presente en la URL
const parametros = new URLSearchParams(window.location.search);
let carpetaNombre = parametros.get("nombre");

if (!carpetaNombre) {
    // Si 'nombre' no está presente, genera un número aleatorio
    carpetaNombre = generarCadenaAleatoria();
    // Agrega el parámetro 'nombre' a la URL
    const urlConParametro = urlActual.includes("?") ? `${urlActual}&nombre=${carpetaNombre}` : `${urlActual}?nombre=${carpetaNombre}`;
    // Redirige a la nueva URL con el parámetro 'nombre'
    window.location.href = urlConParametro;
} else {
    // Llama a la función para crear la carpeta con el nombre obtenido
    crearCarpeta(carpetaNombre);
}

// Función para generar una cadena aleatoria
function generarCadenaAleatoria() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let cadenaAleatoria = '';
    for (let i = 0; i < 3; i++) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        cadenaAleatoria += caracterAleatorio;
    }
    return cadenaAleatoria;
}

// Función para crear la carpeta
function crearCarpeta(carpetaNombre) {
    $.ajax({
        url: 'crearCarpeta.php',
        type: 'POST',
        data: { nombreCarpeta: carpetaNombre },
        success: function(response) {
            console.log('Carpeta creada con éxito:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error al crear la carpeta:', error);
        }
    });
}

// Función para manejar el evento de envío del formulario
const Form = document.getElementById('form');

Form.addEventListener('submit', (e) => {
    e.preventDefault();
    uploadFile(carpetaNombre, 'archivo');
});

// Función para manejar la subida de archivos con barra de progreso
function uploadFile(carpetaRuta, inputId) {
    const archivoInput = document.getElementById(inputId);
    const archivo = archivoInput.files[0];
    const progressArea = document.querySelector(".progress-area");
    const uploadedArea = document.querySelector(".uploaded-area");

    if (!archivo) {
        alert('Por favor, seleccione un archivo primero.');
        return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('carpetaRuta', carpetaRuta); // Enviar también la ruta de la carpeta

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'subir.php', true);

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            const progressHTML = `
                <li class="row">
                    <i class="fas fa-file-alt"></i>
                    <div class="content">
                        <div class="details">
                            <span class="name">${archivo.name} • Uploading</span>
                            <span class="percent">${percentComplete}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${percentComplete}%"></div>
                        </div>
                    </div>
                </li>`;
            progressArea.innerHTML = progressHTML;
            if (event.loaded === event.total) {
                progressArea.innerHTML = "";
                const uploadedHTML = `
                    <li class="row">
                        <div class="content upload">
                            <i class="fas fa-file-alt"></i>
                            <div class="details">
                                <span class="name">${archivo.name} • Uploaded</span>
                                <span class="size">${(event.total / 1024).toFixed(2)} KB</span>
                            </div>
                        </div>
                        <i class="fas fa-check"></i>
                    </li>`;
                uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
            }
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Archivo subido con éxito');
        } else {
            console.error('Error al subir el archivo');
        }
    };

    xhr.send(formData);
}

// DROP AREA

// Obtén la zona de arrastre y el formulario
const dropArea = document.getElementById('drop-area');

// Agrega los siguientes eventos a la zona de arrastre
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFile(file);
    }
});

// Función para manejar el archivo seleccionado
function handleFile(file) {
    if (file) {
        console.log('Archivo seleccionado:', file.name);
        // Agregar código para mostrar el archivo en el DOM o subirlo si es necesario
    }
}
