class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
    }

    parsearOperaciones() {
        // Paso 1: Eliminar comentarios (en caso de haberlos)
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

        // Paso 4: Eliminar todos los corchetes de apertura '[' y cierre ']'
        operacionesContenido = operacionesContenido.replace(/\[|\]/g, '').trim();

        // Mostrar el contenido sin corchetes
        console.log('Contenido de operaciones sin corchetes:');
        console.log(operacionesContenido);

        return operacionesContenido;
    }
}

module.exports = OperacionesParser;
