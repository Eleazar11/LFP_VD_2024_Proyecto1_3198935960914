const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('Menu:');
    console.log('1. Opción 1');
    console.log('2. Opción 2');
    console.log('3. Opción 3');
    console.log('4. Opción 4');
    console.log('5. Opción 5');
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
            case '5':
                console.log('Has seleccionado la opción 5');
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

showMenu();