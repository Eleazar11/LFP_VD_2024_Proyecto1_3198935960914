const readline = require('readline');
const FileLoader = require('./src/loaders/FileLoader');
const AnalizadorLexico = require('./src/analyzer/AnalizadorLexico'); // Importamos el analizador
const GeneradorDeReportes = require('./src/analyzer/GeneradorDeReportes'); // Importamos el generador de reportes

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileLoader = new FileLoader();
const analizador = new AnalizadorLexico(); // Instanciamos el analizador léxico
let texto = ``; // Variable global para almacenar el contenido del archivo

function welcomeMessage() {
    console.log('Bienvenido al proyecto 1 de lenguajes formales y de programación');
    rl.question('Presiona enter para mostrar el menú', () => {
        showMenu();
    });
}

function showMenu() {
    console.log('Menu:');
    console.log('1. Cargar Archivo');
    console.log('2. Analizar archivo');
    console.log('3. Generar archivo de errores');
    console.log('4. Generar reporte de lexemas y tokens');
    console.log('0. Salir');
    rl.question('Seleccione una opción: ', (option) => {
        switch (option) {
            case '1':
                showFileLoaderMenu();
                break;
            case '2':
                analizarArchivo(); // Función para analizar el archivo
                break;
            case '3':
                generarArchivoDeErrores();
                break;
            case '4':
                generarReporteDeLexemasTokens();
                break;
            case '0':
                console.log('Saliendo...');
                rl.close();
                break;
            default:
                console.log('Opción no válida');
                showMenu();
        }
    });
}

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
                            console.log(data);
                            texto = fileLoader.getFileContents();
                            console.log('Contenido del archivo cargado.');
                            showFileLoaderMenu();
                        })
                        .catch(err => {
                            console.log('Error al cargar el archivo:', err);
                            showFileLoaderMenu();
                        });
                });
                break;
            case '2':
                showMenu();
                break;
            default:
                console.log('Opción no válida');
                showFileLoaderMenu();
        }
    });
}

// Función para analizar el archivo
function analizarArchivo() {
    if (!texto) {
        console.log('Primero debes cargar un archivo.');
        showMenu();
        return;
    }
    analizador.analizarTexto(texto);
    console.log('Análisis completado. Se encontraron los siguientes lexemas:');
    const lexemas = analizador.obtenerTablaDeLexemas();
    lexemas.forEach(lexema => console.log(lexema));
    console.log('Errores léxicos encontrados:');
    analizador.errores.forEach(error => console.log(error));
    showMenu();
}

// Generar archivo de errores
function generarArchivoDeErrores() {
    const errores = analizador.errores;
    if (errores.length === 0) {
        console.log('No se encontraron errores.');
    } else {
        GeneradorDeReportes.generarReporteJSON('Errores', errores);
        console.log('Archivo de errores generado exitosamente.');
    }
    showMenu();
}

// Generar reporte de lexemas y tokens
function generarReporteDeLexemasTokens() {
    const lexemas = analizador.obtenerTablaDeLexemas();
    const tokens = analizador.obtenerTablaDeTokens();
    GeneradorDeReportes.generarReporteJSON('Lexemas', lexemas);
    GeneradorDeReportes.generarReporteJSON('Tokens', tokens);
    console.log('Reporte de lexemas y tokens generado exitosamente.');
    showMenu();
}



module.exports = { welcomeMessage };
