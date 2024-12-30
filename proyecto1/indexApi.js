const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const AnalizadorLexico = require('./src/analyzer/AnalizadorLexico');
const FileLoader = require('./src/loaders/FileLoader');
const FiltroOperaciones = require('./src/operations/FiltroOperaciones');
const OperacionesParser = require('./src/operations/OperacionesParser');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.text());  // Esto asegura que el cuerpo de las solicitudes sea tratado como texto plano

// Instanciamos el analizador léxico y el cargador de archivos
const analizador = new AnalizadorLexico();
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

// Ruta para analizar el archivo
app.post('/analyzeFile', (req, res) => {
    if (!texto) {
        return res.status(400).json({ message: 'Primero debes cargar un archivo' });
    }

    // Analizamos el archivo
    analizador.reset(); // Limpiar cualquier análisis anterior
    analizador.analizarTexto(texto);

    // Obtenemos los lexemas y errores
    const lexemas = analizador.obtenerTablaDeLexemas();
    const errores = analizador.errores;

    // Respondemos con los resultados del análisis
    res.status(200).json({
        message: 'Análisis completado',
        lexemas: lexemas,
        errores: errores
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

// Iniciamos el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
