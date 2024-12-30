class FiltroOperaciones {
    constructor(texto) {
        this.texto = texto;
    }

    filtrarTexto() {
        // Eliminar todo lo que esté entre comentarios /*...*/ o después de ellos
        let textoFiltrado = this.texto.replace(/\/\*[\s\S]*?\*\//g, '');

        // Eliminar las configuraciones específicas
        textoFiltrado = textoFiltrado.replace(/ConfiguracionesLex\s*=\s*\[[\s\S]*?\]/g, '');
        textoFiltrado = textoFiltrado.replace(/ConfiguracionesParser\s*=\s*\[[\s\S]*?\]/g, '');

        // Extraer solo las operaciones
        const operacionesMatch = textoFiltrado.match(/Operaciones\s*=\s*\[[\s\S]*?\]/);
        
        if (operacionesMatch) {
            return operacionesMatch[0];  // Retorna solo el bloque de Operaciones
        } else {
            return null;  // Si no encuentra el bloque de operaciones, retorna null
        }
    }
}

module.exports = FiltroOperaciones;  // Exportar la clase
