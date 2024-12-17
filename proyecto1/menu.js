const readline = require('readline');
const FileLoader = require('./src/loaders/FileLoader');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Instancia de la clase FileLoader
const fileLoader = new FileLoader();

// Función con un breve mensaje de bienvenida y luego presionar enter para mostrar el menú
function welcomeMessage() {
    console.log('Bienvenido al proyecto 1 de lenguajes formales y de programación');
    rl.question('Presiona enter para mostrar el menú', () => {
        showMenu();
    });
}

// Función que muestra el menú y permite seleccionar una opción
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
                console.log('Has seleccionado la opción 1');
                break;
            case '2':
                console.log('Has seleccionado la opción 2');
                break;
            case '3':
                console.log('Has seleccionado la opción 3');
                break;
            case '4':
                console.log('Has seleccionado la opción 4');
                break;
            case '0':
                console.log('Saliendo...');
                rl.close();
                return;
            default:
                console.log('Opción no válida');
        }
        showMenu();
    });
}

// Exportar la función welcomeMessage
module.exports = { welcomeMessage };
