class OperacionesParser {
    constructor(texto) {
        this.texto = texto;
        this.resultados = [];
    }

    parsearOperaciones() {
        let jsonData;

        try {
            // Intenta parsear el JSON
            jsonData = JSON.parse(this.texto);
        } catch (error) {
            console.error('Error al parsear el archivo JSON:', error.message);
            return;
        }

        if (!jsonData.operaciones || !Array.isArray(jsonData.operaciones)) {
            console.error('No se encontraron operaciones válidas en el archivo.');
            return;
        }

        // Procesar cada operación
        jsonData.operaciones.forEach((operacion, index) => {
            try {
                const resultado = this.evaluarOperacion(operacion);
                this.resultados.push({ index, resultado });
            } catch (error) {
                console.error(`Error al procesar la operación en el índice ${index}:`, error.message);
            }
        });

        console.log('Resultados de las operaciones:');
        this.resultados.forEach(({ index, resultado }) =>
            console.log(`Operación ${index + 1}: ${resultado}`)
        );
    }

    evaluarOperacion(operacion) {
        if (!operacion.operacion) {
            throw new Error('Falta el tipo de operación.');
        }

        // Obtener valores procesados para valor1 y valor2 (resuelve operaciones anidadas)
        const valor1 = operacion.valor1 !== undefined ? this.obtenerValor(operacion.valor1) : null;
        const valor2 = operacion.valor2 !== undefined ? this.obtenerValor(operacion.valor2) : null;

        // Realizar la operación principal
        switch (operacion.operacion.toLowerCase()) {
            case 'suma':
                return (valor1 || 0) + (valor2 || 0);
            case 'resta':
                return (valor1 || 0) - (valor2 || 0);
            case 'multiplicacion':
                return (valor1 || 1) * (valor2 || 1);
            case 'division':
                if (valor2 === 0) throw new Error('División por cero.');
                return (valor1 || 0) / (valor2 || 1);
            case 'potencia':
                return Math.pow(valor1 || 1, valor2 || 1);
            case 'seno':
                if (valor2 !== null) {
                    console.warn('La operación seno solo utiliza valor1. Ignorando valor2.');
                }
                return Math.sin((valor1 * Math.PI) / 180); // Asume ángulos en grados
            case 'raiz':
                if (valor1 < 0) throw new Error('No se puede calcular la raíz cuadrada de un número negativo.');
                return Math.sqrt(valor1 || 0);
            case 'inverso':
                if (valor1 === 0) throw new Error('El inverso de cero no está definido.');
                return 1 / (valor1 || 1);
            case 'coseno':
                if (valor2 !== null) {
                    console.warn('La operación coseno solo utiliza valor1. Ignorando valor2.');
                }
                return Math.cos((valor1 * Math.PI) / 180); // Asume ángulos en grados
            case 'tangente':
                if (valor2 !== null) {
                    console.warn('La operación tangente solo utiliza valor1. Ignorando valor2.');
                }
                return Math.tan((valor1 * Math.PI) / 180); // Asume ángulos en grados
            case 'mod':
                return (valor1 || 0) % (valor2 || 1);
            default:
                throw new Error(`Operación desconocida: ${operacion.operacion}`);
        }
    }

    obtenerValor(valor) {
        if (typeof valor === 'number') {
            return valor;
        }

        if (Array.isArray(valor)) {
            // Si el valor es un arreglo, puede tener operaciones anidadas
            return this.evaluarOperacion(valor[0]); // Procesa el primer elemento del arreglo
        }

        if (typeof valor === 'object') {
            // Si el valor es un objeto, puede ser una operación anidada
            return this.evaluarOperacion(valor);
        }

        throw new Error('Valor inválido en la operación.');
    }
}

module.exports = OperacionesParser;
