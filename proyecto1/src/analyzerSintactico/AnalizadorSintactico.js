class AnalizadorSintactico {
    constructor(archivo) {
        this.archivo = archivo;
        this.erroresSintacticos = [];
        this.palabrasReservadas = [
            'if', 'else', 'while', 'for', 'int', 'float', 'char', 'string',
            'bool', 'true', 'false', 'void', 'return', 'break', 'continue',
            'function', 'let', 'const', 'operaciones', 'operacion', 'valor1', 'valor2',
            'configuraciones', 'fondo', 'fuente', 'forma', 'ConfiguracionesLex', 'ConfiguracionesParser',
            'tipoFuente', 'Operaciones', 'imprimir', 'conteo', 'promedio', 'max', 'min', 'generarReporte',
            'tokens', 'errores', 'arbol',
        ];

        this.identificadoresValidos = [
            'suma', 'resta', 'multiplicacion', 'division', 'potencia', 'seno', 'raiz', 'inverso',
            'coseno', 'tangente', 'mod', 'absoluto',
        ];
    }

    // Método para iniciar el análisis sintáctico
    analizar() {
        const lineas = this.archivo.split('\n');
        let dentroDeComentarioMultilinea = false;

        lineas.forEach((linea, index) => {
            // Si estamos dentro de un comentario multilínea, ignoramos la línea
            if (dentroDeComentarioMultilinea) {
                // Verificar si la línea contiene el delimitador final de comentario
                if (linea.includes('*/')) {
                    dentroDeComentarioMultilinea = false;  // Final del comentario multilínea
                }
                return;  // Ignorar el contenido de la línea dentro del comentario
            }

            // Verificar si la línea es un comentario de una línea
            if (linea.trim().startsWith('//')) {
                return;  // Comentario de una línea, se ignora
            }

            // Control para los comentarios multilínea
            if (linea.includes('/*')) {
                dentroDeComentarioMultilinea = true;  // Iniciar comentario multilínea
                return;  // Ignorar la línea que contiene el inicio del comentario
            }

            // Ignorar cadenas de texto entre comillas
            if (linea.includes('"')) {
                return;  // Cadena de texto dentro de comillas, se ignora
            }

            // Verificar cada palabra en la línea
            const palabras = linea.split(/\s+/);
            palabras.forEach((palabra) => {
                // Ignorar operadores y caracteres que son parte de la sintaxis (como =, [, ])
                if (['=', '[', ']', '(', ')', '{', '}', ';'].includes(palabra)) {
                    return;  // No es necesario comprobar estos caracteres
                }

                // Ignorar palabras reservadas e identificadores válidos
                if (this.palabrasReservadas.includes(palabra) || this.identificadoresValidos.includes(palabra)) {
                    return;  // No es necesario comprobar estas palabras
                }

                // Ignorar llamadas a funciones (por ejemplo, conteo())
                const regexFuncion = /^[a-zA-Z_][a-zA-Z0-9_]*\(\)$/;
                if (regexFuncion.test(palabra)) {
                    return;  // Es una llamada a función, se ignora
                }

                // Ignorar objetos o arrays en formato JSON
                const regexObjetoArray = /^[\{\[]/;
                if (regexObjetoArray.test(palabra)) {
                    return;  // Es un objeto o array, se ignora
                }

                // Verificar identificadores válidos
                const regexIdentificador = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
                if (palabra && !regexIdentificador.test(palabra) && palabra.indexOf('$') === -1) {
                    this.erroresSintacticos.push({
                        tipo: 'Error sintáctico',
                        valor: palabra,
                        linea: index + 1,
                        columna: linea.indexOf(palabra) + 1,
                        mensaje: 'Identificador no válido'
                    });
                }
            });
        });
    }

    // Método para obtener los errores sintácticos
    obtenerErrores() {
        return this.erroresSintacticos;
    }
}

module.exports = AnalizadorSintactico;
