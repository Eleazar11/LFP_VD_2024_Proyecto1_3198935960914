class Lexema {
    constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
    }
}

class ErrorLexico {
    constructor(valor, descripcion) {
        this.valor = valor;
        this.descripcion = descripcion;
    }
}

class AnalizadorLexico {
    constructor() {
        this.palabrasReservadas = [
            'if', 'else', 'while', 'for', 'int', 'float', 'char', 'string',
            'bool', 'true', 'false', 'void', 'return', 'break', 'continue',
            'function', 'let', 'const', 'operaciones', 'operacion', 'valor1', 'valor2',
        ];

        this.identificadoresValidos = [
            'suma', 'resta', 'multiplicacion', 'division', 'potencia', 'seno',
        ];

        this.lexemas = [];
        this.errores = [];
    }

    analizarTexto(texto) {
        let contador = 0;

        while (contador < texto.length) {
            let codigo = texto.charCodeAt(contador);

            // Ignorar espacios, saltos de línea, tabulaciones y retorno de carro
            if ([32, 10, 9, 13].includes(codigo)) {
                contador++;
                continue;
            }

            // Detectar números (incluyendo flotantes)
            if (codigo >= 48 && codigo <= 57) {
                let numero = '';
                let esDecimal = false;

                while ((codigo >= 48 && codigo <= 57) || (codigo === 46 && !esDecimal)) {
                    if (codigo === 46) esDecimal = true; // Detectar punto decimal
                    numero += texto[contador];
                    contador++;
                    codigo = texto.charCodeAt(contador);
                }

                this.lexemas.push(new Lexema('Número', numero));
                continue;
            }

            // Detectar palabras reservadas y claves JSON
            if ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
                let palabra = '';
                while ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
                    palabra += texto[contador];
                    contador++;
                    codigo = texto.charCodeAt(contador);
                }

                if (this.palabrasReservadas.includes(palabra)) {
                    this.lexemas.push(new Lexema('Palabra reservada', palabra));
                } else {
                    this.lexemas.push(new Lexema('Identificador', palabra));
                }
                continue;
            }

            // Detectar operadores (+, -, *, /)
            if ([43, 45, 42, 47].includes(codigo)) { // +, -, *, /
                this.lexemas.push(new Lexema('Operador', texto[contador]));
                contador++;
                continue;
            }

            // Detectar paréntesis, llaves, punto y coma, etc.
            const simbolos = {
                40: 'Paréntesis de apertura',
                41: 'Paréntesis de cierre',
                123: 'Llave de apertura',
                125: 'Llave de cierre',
                59: 'Punto y coma',
                44: 'Coma',
                58: 'Dos puntos',
                91: 'Corchete de apertura',
                93: 'Corchete de cierre',
                46: 'Punto',
            };
            if (simbolos[codigo]) {
                this.lexemas.push(new Lexema(simbolos[codigo], texto[contador]));
                contador++;
                continue;
            }

            // Detectar cadenas (valores en JSON como "suma", "resta", etc.)
            if (codigo === 34) { // Comilla doble "
                let cadena = '';
                contador++;
                codigo = texto.charCodeAt(contador);
                while (codigo !== 34 && contador < texto.length) {
                    cadena += texto[contador];
                    contador++;
                    codigo = texto.charCodeAt(contador);
                }

                if (this.identificadoresValidos.includes(cadena)) {
                    this.lexemas.push(new Lexema('Identificador válido', cadena));
                } else if (this.palabrasReservadas.includes(cadena)) {
                    this.lexemas.push(new Lexema('Palabra reservada', cadena));
                } else {
                    this.lexemas.push(new Lexema('Cadena', cadena));
                }
                contador++; // Consumir la comilla de cierre
                continue;
            }

            // Manejar caracteres no reconocidos
            this.errores.push(new ErrorLexico(texto[contador], 'Caracter no reconocido'));
            contador++;
        }
    }

    obtenerTablaDeLexemas() {
        return this.lexemas.map((lexema, index) => ({
            index: index + 1,
            tipo: lexema.tipo,
            valor: lexema.valor,
        }));
    }

    obtenerTablaDeTokens() {
        return this.lexemas.map((lexema, index) => ({
            index: index + 1,
            token: lexema.tipo,
            lexema: lexema.valor,
        }));
    }
}

module.exports = AnalizadorLexico;
