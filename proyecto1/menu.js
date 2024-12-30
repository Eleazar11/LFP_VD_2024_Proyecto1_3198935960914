const readline = require('readline');
const FileLoader = require('./src/loaders/FileLoader');
const AnalizadorLexico = require('./src/analyzer/AnalizadorLexico'); // Importamos el analizador
const GeneradorDeReportes = require('./src/analyzer/GeneradorDeReportes'); // Importamos el generador de reportes
const GeneradorDeReportesHTMLErrores = require('./src/analyzer/GeneradorDeReportesHTMLErrores');
const GeneradorDeReportesHTMLTokens = require('./src/analyzer/GeneradorDeReportesHTMLTokens');
const OperacionesParser = require('./src/operations/OperacionesParser');
const GraphGenerator = require('./src/operations/GraphGenerator');
const FiltroOperaciones = require('./src/operations/FiltroOperaciones');


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
    console.log('4. Generar reportes HTML');
    console.log('5. Analizar operaciones');
    console.log('6. Generar grafo');
    console.log('7. Mostrar operaciones filtradas');
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
                showGenerateJSONFilesMenu() // Redirigir al submenú
                break;
            case '4':
                showGenerateHTMLReportsMenu(); // Redirigir al submenú de reportes HTML
                break;
            case '5':
                //analizarOperaciones();
                filtrarYRealizarOperaciones();
                break;
            case '6': 
                generarGrafo();
                break;
            case '7':
                mostrarOperacionesFiltradas();
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
function showGenerateJSONFilesMenu() {
    console.log('Submenú: Generar Archivos JSON');
    console.log('1. Generar archivo JSON de errores');
    console.log('2. Generar archivo JSON de tokens');
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
                showGenerateJSONFilesMenu();
        }
    });
}

// Generar archivo de errores en formato JSON
function generarArchivoDeErrores() {
    const errores = analizador.errores;
    if (errores.length === 0) {
        console.log('No se encontraron errores o no ha agregado el archivo.');
    } else {
        GeneradorDeReportes.generarReporteJSON('Errores', errores);
        console.log('Archivo JSON de errores generado exitosamente.');
    }
    showGenerateJSONFilesMenu();
}

// Generar archivo de tokens en formato JSON
function generarReporteDeLexemasTokens() {
    const tokens = analizador.obtenerTablaDeTokens();
    if (!tokens || tokens.length === 0) {
        console.log('No se encontraron tokens o no ha analizado el archivo.');
    } else {
        GeneradorDeReportes.generarReporteJSON('Tokens', tokens);
        console.log('Archivo JSON de tokens generado exitosamente.');
    }
    showGenerateJSONFilesMenu();
}

// Función para mostrar el submenú de generación de reportes HTML
function showGenerateHTMLReportsMenu() {
    console.log('Submenú: Generar Reportes HTML');
    console.log('1. Generar reporte HTML de errores');
    console.log('2. Generar reporte HTML de tokens');
    console.log('3. Regresar al menú principal');
    rl.question('Seleccione una opción: ', (subOption) => {
        switch (subOption) {
            case '1':
                generarReporteHTMLDeErrores();
                break;
            case '2':
                generarReporteHTMLDeTokens();
                break;
            case '3':
                showMenu();
                break;
            default:
                console.log('Opción no válida');
                showGenerateHTMLReportsMenu();
        }
    });
}

function generarReporteHTMLDeErrores() {
    const errores = analizador.errores;
    if (errores.length === 0) {
        console.log('No se encontraron errores o no ha agregado el archivo.');
    } else {
        GeneradorDeReportesHTMLErrores.generarReporteHTML('Errores', errores);
    }
    showGenerateHTMLReportsMenu();
}

function generarReporteHTMLDeTokens() {
    const tokens = analizador.obtenerTablaDeTokens();
    if (!tokens || tokens.length === 0) {
        console.log('No se encontraron tokens o no ha analizado el archivo.');
    } else {
        GeneradorDeReportesHTMLTokens.generarReporteHTML('Tokens', tokens);
    }
    showGenerateHTMLReportsMenu();
}

function generarGrafo() {
    if (!texto || texto.trim() === "") {
        console.log("No se ha cargado ningún archivo.");
        showMenu();
        return;
    }

    try {
        const jsonData = JSON.parse(texto); // Convertimos el contenido en un JSON válido
        const graphGenerator = new GraphGenerator(jsonData);

        // Generar el grafo
        graphGenerator.generarGrafo();

        // Guardar y generar la imagen
        graphGenerator.generarImagen("grafo_operaciones");

        console.log("Proceso de generación de grafo completado.");
    } catch (error) {
        console.error("Error al analizar las operaciones o generar el grafo:", error.message);
    }

    showMenu(); // Volver al menú principal
}

function mostrarOperacionesFiltradas() {
    if (!texto) {
        console.log('Primero debes cargar un archivo.');
        showMenu();
        return;
    }

    console.log('Filtrando texto...');
    const filtro = new FiltroOperaciones(texto);  // Instancia la clase FiltroOperaciones
    const textoFiltrado = filtro.filtrarTexto();

    if (textoFiltrado) {
        console.log('Operaciones filtradas:');
        console.log(textoFiltrado);  // Muestra todo el bloque de 'Operaciones = [...]' tal cual está en el texto
    } else {
        console.log('No se pudo encontrar el bloque de operaciones.');
    }

    showMenu();  // Mostrar el menú
}

// Función para analizar las operaciones del archivo
function analizarOperaciones() {
    if (!texto) {
        console.log('Primero debes cargar un archivo.');
        showMenu();
        return;
    }

    console.log('Procesando operaciones del archivo...');
    const parser = new OperacionesParser(texto);

    const operaciones = parser.parsearOperaciones();

    if (operaciones) {
        console.log('Operaciones extraídas:');
        console.log(JSON.stringify(operaciones, null, 2)); // Muestra el JSON en consola con formato

        // Procesar las operaciones
        const resultados = parser.procesarOperaciones(operaciones);
        console.log('Resultados de las operaciones:');
        resultados.forEach((resultado, index) => {
            console.log(`${index + 1}.- ${resultado}`);
        });
    } else {
        console.log('No se pudieron procesar las operaciones.');
    }

    showMenu();
}

function filtrarYRealizarOperaciones() {
    if (!texto) {
        console.log('Primero debes cargar un archivo.');
        showMenu();
        return;
    }

    // Paso 1: Filtrar las operaciones
    console.log('Filtrando texto...');
    const filtro = new FiltroOperaciones(texto);  // Instancia la clase FiltroOperaciones
    const textoFiltrado = filtro.filtrarTexto();

    if (textoFiltrado) {
        console.log('Operaciones filtradas:');
        console.log(textoFiltrado);  // Muestra todo el bloque de 'Operaciones = [...]' tal cual está en el texto

        // Paso 2: Procesar las operaciones
        console.log('Procesando operaciones del archivo...');
        const parser = new OperacionesParser(textoFiltrado);  // Instancia la clase OperacionesParser

        const operaciones = parser.parsearOperaciones();

        if (operaciones) {
        //    console.log('Operaciones extraídas:');
          //  console.log(JSON.stringify(operaciones, null, 2)); // Muestra el JSON en consola con formato

            // Procesar las operaciones
            const resultados = parser.procesarOperaciones(operaciones);
            console.log('Resultados de las operaciones:');
            resultados.forEach((resultado, index) => {
                console.log(`${index + 1}.- ${resultado}`);
            });
        } else {
            console.log('No se pudieron procesar las operaciones.');
        }
    } else {
        console.log('No se pudo encontrar el bloque de operaciones.');
    }

    showMenu();  // Mostrar el menú
}

module.exports = { welcomeMessage };
