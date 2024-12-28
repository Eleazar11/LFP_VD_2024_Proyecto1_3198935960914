const express = require('express');
const FileLoader = require('./src/loaders/FileLoader');
const AnalizadorLexico = require('./src/analyzer/AnalizadorLexico');
const GeneradorDeReportes = require('./src/analyzer/GeneradorDeReportes');
const GeneradorDeReportesHTMLErrores = require('./src/analyzer/GeneradorDeReportesHTMLErrores');
const GeneradorDeReportesHTMLTokens = require('./src/analyzer/GeneradorDeReportesHTMLTokens');
const OperacionesParser = require('./src/operations/OperacionesParser');
const GraphGenerator = require('./src/operations/GraphGenerator');

const app = express();
const port = 3000;

// Middlewares
app.use(express.json()); // Para manejar JSON en las peticiones

// Instancias
const fileLoader = new FileLoader();
const analizador = new AnalizadorLexico();
let texto = ''; // Variable global para almacenar el contenido del archivo

// Rutas
// Ruta para cargar un archivo
app.post('/loadFile', async (req, res) => {
    const { filePath } = req.body;
    try {
        fileLoader.clearFileContents();
        fileLoader.setFilePath(filePath);
        texto = await fileLoader.readFile();
        res.status(200).json({ message: 'Archivo cargado con éxito', contenido: texto });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el archivo', error: error.message });
    }
});

// Ruta para analizar el archivo cargado
app.get('/analyzeFile', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo' });
    }
    analizador.reset();
    analizador.analizarTexto(texto);

    const lexemas = analizador.obtenerTablaDeLexemas();
    const errores = analizador.errores;

    res.status(200).json({ lexemas, errores });
});

// Ruta para generar archivos JSON
app.post('/generateJson', (req, res) => {
    const { type } = req.body;

    if (type === 'tokens') {
        const tokens = analizador.obtenerTablaDeTokens();
        if (!tokens || tokens.length === 0) {
            return res.status(400).json({ message: 'No se encontraron tokens' });
        }
        GeneradorDeReportes.generarReporteJSON('Tokens', tokens);
        return res.status(200).json({ message: 'Archivo JSON de tokens generado exitosamente' });
    }

    if (type === 'errors') {
        const errores = analizador.errores;
        if (errores.length === 0) {
            return res.status(400).json({ message: 'No se encontraron errores' });
        }
        GeneradorDeReportes.generarReporteJSON('Errores', errores);
        return res.status(200).json({ message: 'Archivo JSON de errores generado exitosamente' });
    }

    res.status(400).json({ message: 'Tipo no válido' });
});

// Ruta para generar reportes HTML
app.post('/generateHtml', (req, res) => {
    const { type } = req.body;

    if (type === 'tokens') {
        const tokens = analizador.obtenerTablaDeTokens();
        if (!tokens || tokens.length === 0) {
            return res.status(400).json({ message: 'No se encontraron tokens' });
        }
        GeneradorDeReportesHTMLTokens.generarReporteHTML('Tokens', tokens);
        return res.status(200).json({ message: 'Reporte HTML de tokens generado exitosamente' });
    }

    if (type === 'errors') {
        const errores = analizador.errores;
        if (errores.length === 0) {
            return res.status(400).json({ message: 'No se encontraron errores' });
        }
        GeneradorDeReportesHTMLErrores.generarReporteHTML('Errores', errores);
        return res.status(200).json({ message: 'Reporte HTML de errores generado exitosamente' });
    }

    res.status(400).json({ message: 'Tipo no válido' });
});

// Ruta para analizar operaciones
app.post('/analyzeOperations', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo' });
    }

    try {
        const parser = new OperacionesParser(texto);
        const operaciones = parser.parsearOperaciones();
        res.status(200).json({ message: 'Operaciones analizadas con éxito', operaciones });
    } catch (error) {
        res.status(500).json({ message: 'Error al analizar operaciones', error: error.message });
    }
});

// Ruta para generar grafo
app.post('/generateGraph', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo' });
    }

    try {
        const jsonData = JSON.parse(texto);
        const graphGenerator = new GraphGenerator(jsonData);
        graphGenerator.generarGrafo();
        graphGenerator.generarImagen('grafo_operaciones');
        res.status(200).json({ message: 'Grafo generado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el grafo', error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
