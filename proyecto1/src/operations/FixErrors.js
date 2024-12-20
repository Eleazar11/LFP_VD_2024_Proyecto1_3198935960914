class FixErrors {
    constructor(texto) {
        this.texto = texto;
    }

    limpiarTexto() {
        // Expresión regular para permitir únicamente caracteres válidos
        // Letras, números, punto, coma, corchetes, llaves, comillas, espacio, y saltos de línea
        const regex = /[^a-zA-Z0-9\s\[\]\{\}\":,\.\-\+]/g;

        // Reemplaza cualquier carácter no válido por una cadena vacía
        return this.texto.replace(regex, '');
    }

    obtenerTextoLimpio() {
        // Limpia el texto y verifica si es JSON válido
        const textoLimpio = this.limpiarTexto();
        try {
            JSON.parse(textoLimpio); // Intenta parsear el texto limpio
        } catch (error) {
            console.error('El archivo contiene errores graves y no puede ser procesado:', error.message);
            return null; // Retorna null si no es válido
        }

        return textoLimpio; // Retorna el texto limpio si es válido
    }
}
