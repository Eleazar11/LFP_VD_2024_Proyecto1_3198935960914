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
    console.log('3. Generar archivos json');
    console.log('4. Generar reportes');
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
                showGenerateFilesMenu(); // Redirigir al submenú
                break;
            case '4':
                console.log('opcion 4');
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


// Función para mostrar el submenú de FileLoader
function showFileLoaderMenu() {
    console.log('Submenú de FileLoader:');
    console.log('1. Ingresar ruta para cargar archivo');
    console.log('2. Intentar parsear archivo como JSON');
    console.log('3. Volver al menú principal');
    rl.question('Seleccione una opción: ', (option) => {
        switch (option) {
            case '1': // Cargar archivo
                rl.question('Por favor, ingrese la ruta del archivo: ', (filePath) => {
                    fileLoader.clearFileContents(); // Limpiar contenido previo
                    fileLoader.setFilePath(filePath);
                    fileLoader.readFile()
                        .then(data => {
                            console.log('Archivo cargado con éxito.');
                            console.log('Contenido del archivo:');
                            console.log(data);
                            texto = fileLoader.getFileContents();
                            showFileLoaderMenu();
                        })
                        .catch(err => {
                            console.log('Error al cargar el archivo:', err);
                            showFileLoaderMenu();
                        });
                });
                break;

            case '2': // Intentar parsear como JSON
                fileLoader.parseAsJSON()
                    .then(parsedData => {
                        console.log('Archivo parseado como JSON con éxito:');
                        console.log(parsedData);
                        showFileLoaderMenu();
                    })
                    .catch(err => {
                        console.log('Error al parsear el archivo como JSON:', err);
                        showFileLoaderMenu();
                    });
                break;

            case '3': // Volver al menú principal
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

    analizador.reset(); // Limpia lexemas y errores previos
    analizador.analizarTexto(texto);

    console.log('Análisis completado. Se encontraron los siguientes lexemas:');
    const lexemas = analizador.obtenerTablaDeLexemas();
    lexemas.forEach(lexema => console.log(lexema));

    console.log('Errores léxicos encontrados:');
    analizador.errores.forEach(error => console.log(error));

    showMenu();
}

// Función para mostrar el submenú de generación de archivos JSON
function showGenerateFilesMenu() {
    console.log('Submenú: Generar Archivos JSON');
    console.log('1. Generar archivo de errores');
    console.log('2. Generar archivo de tokens');
    console.log('3. Regresar al menú principal');
    rl.question('Seleccione una opción: ', (subOption) => {
        switch (subOption) {
            case '1':
                generarArchivoDeErrores();
                break;
            case '2':
                generarReporteDeLexemasTokens();
                break;
            case '3':
                showMenu();
                break;
            default:
                console.log('Opción no válida');
                showGenerateFilesMenu();
        }
    });
}

// Generar archivo de errores
function generarArchivoDeErrores() {
    const errores = analizador.errores;
    if (errores.length === 0) {
        console.log('No se encontraron errores o no ha agregado el archivo.');
    } else {
        GeneradorDeReportes.generarReporteJSON('Errores', errores);
        console.log('Archivo de errores generado exitosamente.');
    }
    showGenerateFilesMenu();
}

// Generar reporte de lexemas y tokens
function generarReporteDeLexemasTokens() {
    const tokens = analizador.obtenerTablaDeTokens();
    if (!tokens || tokens.length === 0) {
        console.log('No se encontraron tokens o no ha analizado el archivo.');
    } else {
        GeneradorDeReportes.generarReporteJSON('Tokens', tokens);
        console.log('Archivo json de tokens generado exitosamente.');
    }
    showGenerateFilesMenu();
}



module.exports = { welcomeMessage };
