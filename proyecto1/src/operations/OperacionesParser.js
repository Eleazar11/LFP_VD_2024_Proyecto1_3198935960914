class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
    }

    // Simplificar operaciones anidadas en valor1 y valor2
    simplificarValores(valor) {
        if (Array.isArray(valor) && valor.length === 1) {
            valor = valor[0]; // Desenvuelve si es un array de un solo elemento
        }

        if (typeof valor === 'object' && valor !== null) {
            if (valor.valor1) {
                valor.valor1 = this.simplificarValores(valor.valor1);
            }
            if (valor.valor2) {
                valor.valor2 = this.simplificarValores(valor.valor2);
            }
        }

        return valor;
    }

    parsearOperaciones() {
        // Paso 1: Eliminar comentarios
        let textoSinComentarios = this.texto
            .replace(/\/\/[^\n]*\n/g, '') // Elimina comentarios de una línea
            .replace(/\/\*[\s\S]*?\*\//g, ''); // Elimina comentarios multilínea

        // Paso 2: Extraer el bloque de operaciones
        const operacionesMatch = textoSinComentarios.match(/Operaciones\s*=\s*\[([\s\S]*?)\]/);

        if (!operacionesMatch) {
            console.error('No se encontraron operaciones válidas en el archivo.');
            return null;
        }

        // Paso 3: Obtener el contenido interno
        let operacionesContenido = operacionesMatch[1].trim();

        // Simplificar valores en las operaciones
        try {
            let jsonOperaciones = JSON.parse(`[${operacionesContenido}]`); // Parsear como array de JSON
            jsonOperaciones = jsonOperaciones.map(this.simplificarValores.bind(this)); // Simplificar valores

            // Convertir de nuevo a texto, separando cada operación con una coma
            const contenidoSinCorchetes = jsonOperaciones
                .map((operacion) => JSON.stringify(operacion))
                .join(',\n');

            console.log('Contenido de operaciones sin corchetes:');
            console.log(contenidoSinCorchetes);

            return contenidoSinCorchetes;
        } catch (error) {
            console.error('Error al procesar el bloque de operaciones:', error.message);
            return null;
        }
    }
}

module.exports = OperacionesParser;
