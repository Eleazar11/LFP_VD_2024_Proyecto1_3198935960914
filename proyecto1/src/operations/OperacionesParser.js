class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
    }

    parsearOperaciones() {
        //mostrar en cosola el contenido de texto como viene por defecto
        console.log('Texto original:', this.texto, 'caracteres.');
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

        // Paso 4: Reconstruir el JSON válido
        try {
            const jsonValido = JSON.parse(`[${bloqueOperaciones}]`);
            console.log('Contenido transformado a JSON:');
            console.log(JSON.stringify(jsonValido, null, 2));
            return jsonValido;
        } catch (error) {
            console.error('Error al transformar el contenido a JSON:', error.message);
            return null;
        }
    }

    calcularOperacion(operacion) {
        // Resuelve el valor, sea primitivo, objeto o array.
        const resolverValor = (valor) => {
            if (Array.isArray(valor)) {
                return this.calcularOperacion(valor[0]); // Procesa solo el primer elemento del array
            } else if (typeof valor === 'object') {
                return this.calcularOperacion(valor); // Procesa el objeto anidado
            }
            return valor; // Retorna el valor directo si es primitivo
        };
    
        // Conversión de grados a radianes
        const gradosARadianes = (grados) => (grados * Math.PI) / 180;
    
        // Resuelve los valores de la operación
        const valor1 = resolverValor(operacion.valor1);
        const valor2 = resolverValor(operacion.valor2);
    
        // Procesa la operación solicitada
        switch (operacion.operacion) {
            case 'suma':
                return valor1 + valor2;
            case 'resta':
                return valor1 - valor2;
            case 'multiplicacion':
                return valor1 * valor2;
            case 'division':
                return valor2 !== 0 ? valor1 / valor2 : 'Error: División entre 0';
            case 'seno':
                return Math.sin(valor1); // Trabaja directamente en radianes
                // Para convertir grados a radianes: Math.sin(gradosARadianes(valor1))
            case 'coseno':
                return Math.cos(valor1); // Trabaja directamente en radianes
                // Para convertir grados a radianes: Math.cos(gradosARadianes(valor1))
            case 'tangente':
                return Math.tan(valor1); // Trabaja directamente en radianes
                // Para convertir grados a radianes: Math.tan(gradosARadianes(valor1))
            case 'raiz':
                return Math.pow(valor1, 1 / valor2); // Calcula la raíz n-ésima
            case 'potencia':
                return Math.pow(valor1, valor2); // Calcula la potencia
            case 'mod':
                return valor1 % valor2; // Calcula el módulo
            case 'inverso':
                return valor1 !== 0 ? 1 / valor1 : 'Error: Inverso de 0 no definido';
            default:
                console.error(`Operación desconocida: ${operacion.operacion}`);
                return null;
        }
    }    


    procesarOperaciones(operaciones) {
        const resultados = [];
        operaciones.forEach((operacion, index) => {
            const resultado = this.calcularOperacion(operacion);
            resultados.push(`Resultado de operación "${operacion.nombre}": ${resultado}`);
        });
        return resultados;
    }
}

module.exports = OperacionesParser;
