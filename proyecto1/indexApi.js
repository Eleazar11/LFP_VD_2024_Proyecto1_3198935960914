const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const AnalizadorLexico = require('./src/analyzer/AnalizadorLexico');
const AnalizadorSintactico = require('./src/analyzer/AnalizadorSintactico');
const FileLoader = require('./src/loaders/FileLoader');
const FiltroOperaciones = require('./src/operations/FiltroOperaciones');
const OperacionesParser = require('./src/operations/OperacionesParser');
const GeneradorDeReportesHTMLErrores = require('./src/analyzer/GeneradorDeReportesHTMLErrores');
const GeneradorDeReportesHTMLTokens = require('./src/analyzer/GeneradorDeReportesHTMLTokens');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.text());  // Esto asegura que el cuerpo de las solicitudes sea tratado como texto plano

// Instanciamos el analizador léxico y el cargador de archivos
const analizador = new AnalizadorLexico();
const sintactico = new AnalizadorSintactico();
const fileLoader = new FileLoader();

// Variable global para almacenar el contenido del archivo
let texto = '';

// Ruta para cargar el archivo
app.post('/loadFile', (req, res) => {
    const filePath = req.body.trim(); // Recibimos la ruta como texto plano
    if (!filePath) {
        return res.status(400).json({ message: 'La ruta del archivo es necesaria' });
    }

    // Intentamos leer el archivo
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el archivo', error: err.message });
        }
        texto = data;  // Almacenamos el contenido del archivo
        console.log('Archivo cargado con éxito');
        res.status(200).json({ message: 'Archivo cargado con éxito', contenido: data });
    });
});

// para analizar el archivo
app.post('/analyzeFile', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo' });
    }

    // Limpieza previa de los analizadores
    analizador.reset(); 
    sintactico.reset();

    // Realizamos el análisis léxico
    analizador.analizarTexto(texto);

    // Obtenemos los resultados del análisis léxico
    const lexemas = analizador.obtenerTablaDeLexemas();
    const erroresLexicos = analizador.errores;

    // Realizamos el análisis sintáctico
    sintactico.analizarTexto(texto);

    // Obtenemos los resultados del análisis sintáctico
    const erroresSintacticos = sintactico.errores;

    // Respondemos con los resultados del análisis
    res.status(200).json({
        message: 'Análisis completado',
        lexemas: lexemas,
        erroresLexicos: erroresLexicos,
        erroresSintacticos: erroresSintacticos
    });
});


// Ruta para filtrar y procesar las operaciones
app.post('/filterAndProcessOperations', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo.' });
    }

    // Paso 1: Filtrar las operaciones
    console.log('Filtrando texto...');
    const filtro = new FiltroOperaciones(texto); // Instancia la clase FiltroOperaciones
    const textoFiltrado = filtro.filtrarTexto();

    if (!textoFiltrado) {
        return res.status(400).json({ message: 'No se pudo encontrar el bloque de operaciones.' });
    }

    console.log('Operaciones filtradas:');
    console.log(textoFiltrado);

    // Paso 2: Procesar las operaciones
    console.log('Procesando operaciones del archivo...');
    const parser = new OperacionesParser(textoFiltrado); // Instancia la clase OperacionesParser

    const operaciones = parser.parsearOperaciones();
    if (!operaciones) {
        return res.status(400).json({ message: 'No se pudieron procesar las operaciones.' });
    }

    console.log('Operaciones extraídas:');
    console.log(JSON.stringify(operaciones, null, 2)); // Muestra el JSON en consola con formato

    // Procesar las operaciones
    const resultados = parser.procesarOperaciones(operaciones);

    console.log('Resultados de las operaciones:');
    resultados.forEach((resultado, index) => {
        console.log(`${index + 1}.- ${resultado}`);
    });

    // Respuesta exitosa con resultados
    res.status(200).json({
        message: 'Operaciones procesadas con éxito.',
        operaciones: operaciones,
        resultados: resultados
    });
});

app.post('/generateErrorReport', (req, res) => {
    // Obtener errores léxicos y semánticos
    const erroresLexicos = analizador.errores || []; // Errores léxicos
    const erroresSemanticos = sintactico.errores || []; // Errores semánticos

    if (erroresLexicos.length === 0 && erroresSemanticos.length === 0) {
        return res.status(400).json({ message: 'No se encontraron errores léxicos ni semánticos, o no se ha cargado un archivo.' });
    }

    // Generar el reporte HTML
    const reporteHTML = GeneradorDeReportesHTMLErrores.generarReporteHTML('Errores', erroresLexicos, erroresSemanticos);

    // Guardar el reporte en un archivo
    const reportePath = path.resolve(__dirname, './src/reports/html/reporte_errores.html');
    fs.writeFileSync(reportePath, reporteHTML);

    // Enviar el archivo como respuesta
    res.status(200).sendFile(reportePath, (err) => {
        if (err) {
            console.error('Error al enviar el reporte:', err);
            res.status(500).json({ message: 'Error al generar el reporte.' });
        } else {
            console.log('Reporte enviado exitosamente.');
        }
    });
});


app.post('/generateTokenReport', (req, res) => {
    // Obtener los tokens del analizador
    const tokens = analizador.obtenerTablaDeTokens();

    if (!tokens || tokens.length === 0) {
        return res.status(400).json({ message: 'No se encontraron tokens o no se ha analizado el archivo.' });
    }

    // Generar el reporte HTML y obtener la ruta
    const reportePath = GeneradorDeReportesHTMLTokens.generarReporteHTML('Tokens', tokens);

    // Construir la ruta absoluta del archivo
    const rutaAbsoluta = path.resolve(reportePath);

    // Enviar el archivo como respuesta
    res.status(200).sendFile(rutaAbsoluta, (err) => {
        if (err) {
            console.error('Error al enviar el reporte:', err);
            res.status(500).json({ message: 'Error al generar el reporte.' });
        } else {
            console.log('Reporte de tokens enviado exitosamente.');
        }
    });
});

// Iniciamos el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
