class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
    }

    parsearOperaciones() {
        // Paso 1: Eliminar comentarios (en caso de haberlos)
        let textoSinComentarios = this.texto
            .replace(/\/\/[^\n]*\n/g, '') // Elimina comentarios de una línea
            .replace(/\/\*[\s\S]*?\*\//g, ''); // Elimina comentarios multilínea

        console.log('Texto sin comentarios:', textoSinComentarios.length, 'caracteres.');

        // Paso 2: Buscar la posición inicial del bloque 'Operaciones = [' y su cierre ']'
        const inicio = textoSinComentarios.indexOf('Operaciones = [');
        const fin = textoSinComentarios.lastIndexOf(']');

        if (inicio === -1 || fin === -1) {
            console.error('No se encontraron operaciones válidas en el archivo.');
            return null;
        }

        // Paso 3: Extraer el bloque completo de operaciones
        const bloqueOperaciones = textoSinComentarios.slice(inicio + 'Operaciones = ['.length, fin).trim();

        console.log('Bloque extraído (con corchetes internos):');
        console.log(bloqueOperaciones);

        // Paso 4: Eliminar corchetes externos si existen
        const operacionesContenido = bloqueOperaciones.replace(/\[|\]/g, '').trim();

        console.log('Contenido de operaciones sin corchetes:');
        console.log(operacionesContenido);

        // Paso 5: Reconstruir el JSON válido
        try {
            const jsonValido = JSON.parse(`[${operacionesContenido}]`);
            console.log('Contenido transformado a JSON:');
            console.log(JSON.stringify(jsonValido, null, 2));
            return jsonValido;
        } catch (error) {
            console.error('Error al transformar el contenido a JSON:', error.message);
            return null;
        }
    }
}

module.exports = OperacionesParser;
