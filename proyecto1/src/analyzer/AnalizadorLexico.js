const Lexema = require('./Lexema');
const ErrorLexico = require('./ErrorLexico');

class AnalizadorLexico {
    constructor() {
        this.palabrasReservadas = [
            'if', 'else', 'while', 'for', 'int', 'float', 'char', 'string',
            'bool', 'true', 'false', 'void', 'return', 'break', 'continue',
            'function', 'let', 'const', 'operaciones', 'operacion', 'valor1', 'valor2',
            'configuraciones', 'fondo', 'fuente', 'forma',
        ];

        this.identificadoresValidos = [
            'suma', 'resta', 'multiplicacion', 'division', 'potencia', 'seno', 'raiz', 'inverso',
            'coseno', 'tangente', 'mod', 'absoluto',
        ];

        this.lexemas = [];
        this.errores = [];
        this.fila = 1;
        this.columna = 1;
    }

    reset() {
        this.lexemas = [];
        this.errores = [];
        this.fila = 1;
        this.columna = 1;
    }

    analizarTexto(texto) {
        this.reset();
        let contador = 0;
        let estado = 0;
        let lexemaActual = '';
        let filaInicio = this.fila;
        let columnaInicio = this.columna;

        const avanzarPosicion = (char) => {
            if (char === '\n') {
                this.fila++;
                this.columna = 1;
            } else if (char === '\t') {
                this.columna += 4;
            } else if (char !== '\r') {
                this.columna++;
            }
        };

        const agregarLexema = (tipo) => {
            this.lexemas.push(new Lexema(tipo, lexemaActual, filaInicio, columnaInicio));
            lexemaActual = '';
        };

        const agregarError = (descripcion) => {
            this.errores.push(new ErrorLexico(lexemaActual || texto[contador], descripcion, filaInicio, columnaInicio));
            lexemaActual = '';
        };

        while (contador <= texto.length) {
            let char = texto[contador] || '\0';
            switch (estado) {
                case 0:
                    filaInicio = this.fila;
                    columnaInicio = this.columna;

                    if (/[a-zA-Z]/.test(char)) {
                        lexemaActual += char;
                        estado = 1;
                    } else if (/[0-9]/.test(char)) {
                        lexemaActual += char;
                        estado = 2;
                    } else if (char === '.') {
                        lexemaActual += char;
                        estado = 3;
                    } else if (char === '"') {
                        estado = 4;
                    } else if ('()+-*/{}[]:;,'.includes(char)) {
                        lexemaActual += char;
                        agregarLexema({
                            '(': 'Paréntesis de apertura',
                            ')': 'Paréntesis de cierre',
                            '{': 'Llave de apertura',
                            '}': 'Llave de cierre',
                            '[': 'Corchete de apertura',
                            ']': 'Corchete de cierre',
                            ':': 'Dos puntos',
                            ';': 'Punto y coma',
                            ',': 'Coma',
                            '.': 'Punto',
                        }[char]);
                    } else if (/\s/.test(char)) {
                        avanzarPosicion(char);
                    } else if (char === '\0') {
                        break;
                    } else {
                        lexemaActual += char;
                        agregarError('Caracter no reconocido');
                    }
                    break;

                case 1:
                    if (/[a-zA-Z0-9]/.test(char)) {
                        lexemaActual += char;
                    } else {
                        if (this.palabrasReservadas.includes(lexemaActual)) {
                            agregarLexema('Palabra reservada');
                        } else if (this.identificadoresValidos.includes(lexemaActual)) {
                            agregarLexema('Identificador');
                        } else {
                            agregarLexema('Identificador no válido');
                        }
                        estado = 0;
                        continue;
                    }
                    break;

                case 2:
                    if (/[0-9]/.test(char)) {
                        lexemaActual += char;
                    } else if (char === '.') {
                        lexemaActual += char;
                        estado = 3;
                    } else {
                        agregarLexema('Número');
                        estado = 0;
                        continue;
                    }
                    break;

                case 3:
                    if (/[0-9]/.test(char)) {
                        lexemaActual += char;
                    } else {
                        agregarLexema('Número');
                        estado = 0;
                        continue;
                    }
                    break;

                case 4:
                    if (char !== '"' && char !== '\0') {
                        lexemaActual += char;
                    } else if (char === '"') {
                        if (this.palabrasReservadas.includes(lexemaActual)) {
                            agregarLexema('Palabra reservada');
                        } else if (this.identificadoresValidos.includes(lexemaActual)) {
                            agregarLexema('Identificador');
                        } else {
                            agregarLexema('Cadena');
                        }
                        estado = 0;
                    }
                    break;

                default:
                    agregarError('Estado desconocido');
                    estado = 0;
                    break;
            }

            if (estado !== 0 || /\S/.test(char)) {
                avanzarPosicion(char);
            }

            contador++;
        }
    }

    obtenerTablaDeLexemas() {
        return this.lexemas.map((lexema, index) => ({
            index: index + 1,
            tipo: lexema.tipo,
            valor: lexema.valor,
            fila: lexema.fila,
            columna: lexema.columna,
        }));
    }

    obtenerTablaDeTokens() {
        return this.obtenerTablaDeLexemas();
    }
}

module.exports = AnalizadorLexico;
