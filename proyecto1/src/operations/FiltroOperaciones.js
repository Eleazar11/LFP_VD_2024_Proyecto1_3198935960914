class FiltroOperaciones {
    constructor(texto) {
        this.texto = texto;
    }

    filtrarTexto() {
        // Eliminar comentarios de una línea
        let textoFiltrado = this.texto.replace(/\/\/[^\n]*\n/g, '')  // Eliminar comentarios de una línea
                                      .replace(/\/\*[\s\S]*?\*\//g, ''); // Eliminar comentarios multilínea

        // Encontrar el bloque de 'Operaciones = [...]'
        const inicio = textoFiltrado.indexOf('Operaciones = [');
        const fin = textoFiltrado.lastIndexOf(']');

        if (inicio === -1 || fin === -1) {
            console.error('No se encontró el bloque de operaciones.');
            return null;
        }

        // Extraer el bloque de operaciones y devolverlo
        return textoFiltrado.slice(inicio, fin + 1); // Incluye los corchetes
    }
}

module.exports = FiltroOperaciones; // Exportar la clase si es necesario
