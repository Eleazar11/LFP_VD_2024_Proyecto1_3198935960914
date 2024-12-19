class Lexema {
    constructor(tipo, valor, fila, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
}

class ErrorLexico {
    constructor(valor, descripcion, fila, columna) {
        this.valor = valor;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }
}

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

    analizarTexto(texto) {
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
                this.columna += 4; // Avance por tabulaciones
            } else if (char !== '\r') { // Ignorar retorno de carro
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
            let char = texto[contador] || '\0'; // Caracter actual o fin de cadena
            let codigo = char.charCodeAt(0);

            switch (estado) {
                case 0: // Estado inicial
                    filaInicio = this.fila;
                    columnaInicio = this.columna;

                    if (/[a-zA-Z]/.test(char)) { // Letras
                        lexemaActual += char;
                        estado = 1;
                    } else if (/[0-9]/.test(char)) { // Dígitos
                        lexemaActual += char;
                        estado = 2;
                    } else if (char === '.') { // Punto
                        lexemaActual += char;
                        estado = 3;
                    } else if (char === '"') { // Comillas dobles
                        estado = 4;
                    } else if ('()+-*/{}[]:;,'.includes(char)) { // Símbolos
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
                    } else if (/\s/.test(char)) { // Espacios y saltos de línea
                        avanzarPosicion(char);
                    } else if (char === '\0') { // Fin de texto
                        break;
                    } else { // Caracter no reconocido
                        lexemaActual += char;
                        agregarError('Caracter no reconocido');
                    }
                    break;

                case 1: // Identificadores o palabras reservadas
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

                case 2: // Números
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

                case 3: // Números decimales
                    if (/[0-9]/.test(char)) {
                        lexemaActual += char;
                    } else {
                        agregarLexema('Número');
                        estado = 0;
                        continue;
                    }
                    break;

                case 4: // Cadenas
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
}

module.exports = AnalizadorLexico;
