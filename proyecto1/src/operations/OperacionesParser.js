class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
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

        // Paso 3: Obtener el contenido interno y eliminar los corchetes
        let operacionesContenido = operacionesMatch[1].trim();

        // Mostrar el contenido sin corchetes
        console.log('Contenido de operaciones sin corchetes:');
        console.log(operacionesContenido);

        return operacionesContenido;
    }
}

module.exports = OperacionesParser;
