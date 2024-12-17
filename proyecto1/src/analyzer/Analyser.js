// Analyzer.js
const Lexema = require('./Lexema');
const Error = require('./Error');

class Analyzer {
    constructor(texto) {
        this.texto = texto;
        this.lexemas = [];
        this.errores = [];
    }

    analizarTexto() {
        let contador = 0;
        const palabrasReservadas = [
            'if', 'else', 'while', 'for', 'int', 'float', 'char', 'string',
            'bool', 'true', 'false', 'void', 'return', 'break', 'continue',
            'function', 'let', 'const'
        ];

        while (contador < this.texto.length) {
            let codigo = this.texto.charCodeAt(contador);

            // Ignorar espacios en blanco, saltos de línea y tabulaciones
            if (codigo === 32 || codigo === 10 || codigo === 9) {
                contador++;
                continue;
            }

            // Si es un dígito (número)
            if (codigo >= 48 && codigo <= 57) {
                let numero = '';
                while (codigo >= 48 && codigo <= 57) {
                    numero += this.texto[contador];
                    contador++;
                    codigo = this.texto.charCodeAt(contador);
                }
                this.lexemas.push(new Lexema('Número', numero));
            }

            // Si es una letra (palabra reservada o identificador)
            else if ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
                let palabra = '';
                while ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
                    palabra += this.texto[contador];
                    contador++;
                    codigo = this.texto.charCodeAt(contador);
                }

                if (palabrasReservadas.includes(palabra)) {
                    this.lexemas.push(new Lexema('Palabra reservada', palabra));
                } else {
                    this.lexemas.push(new Lexema('Identificador', palabra));
                }
            }

            // Si es un operador, paréntesis, llave, etc.
            else {
                this.agregarTokenPorCodigo(codigo, contador);
                contador++;
            }
        }
    }

    agregarTokenPorCodigo(codigo, contador) {
        // Aquí se agregan tokens por sus códigos ASCII
        const caracteres = {
            43: 'Operador',  // +
            45: 'Operador',  // -
            42: 'Operador',  // *
            47: 'Operador',  // /
            40: 'Paréntesis de apertura',  // (
            41: 'Paréntesis de cierre',  // )
            123: 'Llave de apertura',  // {
            125: 'Llave de cierre',  // }
            59: 'Punto y coma',  // ;
            34: 'Cadena',  // "
            44: 'Coma',  // ,
            61: 'Igual'  // =
        };

        const tipo = caracteres[codigo];
        if (tipo) {
            this.lexemas.push(new Lexema(tipo, String.fromCharCode(codigo)));
        } else {
            this.errores.push(new Error(String.fromCharCode(codigo), 'Caracter no reconocido'));
        }
    }

    mostrarResultados() {
        console.log('\nLexemas encontrados:');
        this.lexemas.forEach((lexema, index) => {
            console.log(`${index + 1}. Tipo: ${lexema.tipo}, Valor: "${lexema.valor}"`);
        });

        if (this.errores.length > 0) {
            console.log('\nErrores encontrados:');
            this.errores.forEach((error, index) => {
                console.log(`${index + 1}. Valor: "${error.valor}", Descripción: ${error.descripcion}`);
            });
        } else {
            console.log('\nNo se encontraron errores.');
        }
    }
}

module.exports = Analyzer;
