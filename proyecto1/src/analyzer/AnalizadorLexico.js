const Lexema = require('./Lexema');
const ErrorLexico = require('./ErrorLexico');

class AnalizadorLexico {
    constructor() {
        this.palabrasReservadas = [
            'if', 'else', 'while', 'for', 'int', 'float', 'char', 'string',
            'bool', 'true', 'false', 'void', 'return', 'break', 'continue',
            'function', 'let', 'const', 'operaciones', 'operacion', 'valor1', 'valor2',
            'configuraciones', 'fondo', 'fuente', 'forma', 'ConfiguracionesLex', 'ConfiguracionesParser',
            'tipoFuente', 'Operaciones',
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

                    if (/[a-zA-ZáéíóúÁÉÍÓÚ]/.test(char)) {
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
                    } else if (char === '/') {
                        estado = 5; // Inicio de posible comentario
                    } else if ('()+-*/{}[]:;,=#'.includes(char)) {
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
                            '=': 'Operador de asignación',
                            '#': 'Fin de expresión',
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
                    if (/[a-zA-Z0-9áéíóúÁÉÍÓÚ]/.test(char)) {
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
                            agregarLexema('Palabra reservada cadena');
                        } else if (this.identificadoresValidos.includes(lexemaActual)) {
                            agregarLexema('Identificador cadena');
                        } else {
                            agregarLexema('Cadena');
                        }
                        estado = 0;
                    }
                    break;

                case 5: // Comentarios
                    if (char === '/') {
                        lexemaActual += char;
                        estado = 6; // Comentario de línea
                    } else if (char === '*') {
                        lexemaActual += char;
                        estado = 7; // Comentario de múltiples líneas
                    } else {
                        agregarLexema('Operador de división');
                        estado = 0;
                        continue;
                    }
                    break;

                case 6: // Comentario de línea
                    if (char !== '\n' && char !== '\0') {
                        lexemaActual += char;
                    } else {
                        agregarLexema('Comentario de línea');
                        estado = 0;
                    }
                    break;

                case 7: // Comentario de múltiples líneas
                    if (char === '*' && texto[contador + 1] === '/') {
                        lexemaActual += char + '/';
                        contador++; // Avanzar para incluir '/'
                        agregarLexema('Comentario de múltiples líneas');
                        estado = 0;
                    } else if (char === '\0') {
                        agregarError('Comentario de múltiples líneas no cerrado');
                        estado = 0;
                    } else {
                        lexemaActual += char;
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
