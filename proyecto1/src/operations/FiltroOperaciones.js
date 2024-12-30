class FiltroOperaciones {
    constructor(texto) {
        this.texto = texto;
    }
    
    filtrarTexto() {
        // Eliminar los comentarios de una sola línea y multilínea
        let textoFiltrado = this.texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

        // Buscar el bloque que empieza con "Operaciones = [" y termina con "]", considerando los corchetes anidados
        const operacionesMatch = this.extraerOperaciones(textoFiltrado);

        // Retornar el bloque completo de Operaciones si existe
        if (operacionesMatch) {
            return `Operaciones = ${operacionesMatch}`;
        } else {
            return null;  // Si no encuentra el bloque de operaciones, retorna null
        }
    }

    extraerOperaciones(texto) {
        let i = 0;
        let abierto = 0;
        let bloque = '';
        let encontrado = false;

        // Buscar "Operaciones = ["
        while (i < texto.length) {
            if (texto.slice(i, i + 15) === "Operaciones = [") {
                encontrado = true;
                i += 15;  // Avanzar al inicio del bloque de operaciones
                bloque += "Operaciones = [";
                abierto++; // Primer corchete abierto
            }

            // Si ya encontramos el inicio, empezar a contar los corchetes
            if (encontrado) {
                bloque += texto[i];

                if (texto[i] === '[') {
                    abierto++;
                } else if (texto[i] === ']') {
                    abierto--;
                }

                // Si ya hemos cerrado todos los corchetes, terminamos
                if (abierto === 0) {
                    return bloque; // Devuelve el bloque de operaciones completo
                }
            }
            i++;
        }

        return null;  // Si no se encuentra el bloque de operaciones
    }
}

module.exports = FiltroOperaciones;  // Exportar la clase
