const readline = require('readline');
const FileLoader = require('./src/loaders/FileLoader');
const Analyzer = require('./src/analyzer/Analyser');  // Asegúrate de que la ruta sea correcta

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileLoader = new FileLoader();

// Función con un breve mensaje de bienvenida y luego presionar enter para mostrar el menú
function welcomeMessage() {
    console.log('Bienvenido al proyecto 1 de lenguajes formales y de programación');
    rl.question('Presiona enter para mostrar el menú', () => {
        showMenu();
    });
}

// Función que muestra el menú principal y permite seleccionar una opción
function showMenu() {
    console.log('Menu:');
    console.log('1. Cargar Archivo');
    console.log('2. Analizar archivo');
    console.log('3. Generar archivo de errores');
    console.log('4. Reportes');
    console.log('0. Salir');
    rl.question('Seleccione una opción: ', (option) => {
        switch (option) {
            case '1':
                showFileLoaderMenu();  // Llama al submenú para cargar archivo
                break;
            case '2':
                analizarArchivo();
                showMenu(); // Regresa al menú principal
                break;
            case '3':
                console.log('Has seleccionado la opción 3');
                showMenu(); // Regresa al menú principal
                break;
            case '4':
                console.log('Has seleccionado la opción 4');
                showMenu(); // Regresa al menú principal
                break;
            case '0':
                console.log('Saliendo...');
                rl.close(); // Cierra la interfaz de readline
                break;
            default:
                console.log('Opción no válida');
                showMenu(); // Regresa al menú principal
        }
    });
}

// Submenú para cargar el archivo
function showFileLoaderMenu() {
    console.log('Submenú de FileLoader:');
    console.log('1. Ingresar ruta para cargar archivo');
    console.log('2. Volver al menú principal');
    rl.question('Seleccione una opción: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Por favor, ingrese la ruta del archivo JSON: ', (filePath) => {
                    fileLoader.setFilePath(filePath);
                    fileLoader.readFile()
                        .then(data => {
                            console.log('Archivo cargado con éxito:');
                            console.log(data); // Muestra el contenido del archivo
                            showFileLoaderMenu(); // Regresa al submenú para más opciones
                        })
                        .catch(err => {
                            console.log('Error al cargar el archivo:', err);
                            showFileLoaderMenu(); // Regresa al submenú para más opciones
                        });
                });
                break;
            case '2':
                showMenu(); // Regresa al menú principal
                break;
            default:
                console.log('Opción no válida');
                showFileLoaderMenu(); // Regresa al submenú para más opciones
        }
    });
}

// Función para analizar el archivo cargado
function analizarArchivo() {
    const texto = fileLoader.getFileContents(); // Asumiendo que FileLoader tiene un método para obtener el contenido
    const analyzer = new Analyzer(texto);
    analyzer.analizarTexto();
    analyzer.mostrarResultados();
}


module.exports = { welcomeMessage };
