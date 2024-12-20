const fs = require("fs");
const { exec } = require("child_process");

class GraphGenerator {
    constructor(jsonData) {
        this.data = jsonData; // El JSON cargado desde el archivo
        this.graphData = ""; // Aquí se almacenará la representación del grafo en DOT
    }

    generarGrafo() {
        this.graphData = "digraph G {\n";
        this.graphData += '    rankdir=TB;\n'; // Esto hace que los nodos se organicen verticalmente

        // Aplicar configuraciones globales
        const config = this.data.configuraciones?.[0] || {};
        if (config.fondo) this.graphData += `    bgcolor="${config.fondo}";\n`;
        if (config.fuente) this.graphData += `    fontcolor="${config.fuente}";\n`;
        if (config.forma) this.graphData += `    node [shape=${config.forma}];\n`;

        // Generar nodos y conexiones para cada operación
        const operaciones = this.data.operaciones || [];
        operaciones.forEach((op, index) => {
            const nodeId = `op${index}`;
            this._procesarOperacion(op, nodeId);
        });

        this.graphData += "}\n";
    }

    _procesarOperacion(operacion, parentId) {
        const { operacion: op, valor1, valor2 } = operacion;

        // Crear el nodo para la operación
        const result = this._calcularResultado(op, valor1, valor2);
        this.graphData += `    ${parentId} [label="${op}\\nResultado: ${result}"];\n`;

        // Procesar valor1 si existe
        if (valor1 !== undefined) {
            if (Array.isArray(valor1)) {
                // Si valor1 es un arreglo, recorrer cada sub-operación
                valor1.forEach((subOp, i) => {
                    const leftChildId = `${parentId}_left${i}`;
                    this.graphData += `    ${parentId} -> ${leftChildId};\n`;
                    this._procesarOperacion(subOp, leftChildId);
                });
            } else if (typeof valor1 === "object" && valor1.operacion) {
                const leftChildId = `${parentId}_left`;
                this.graphData += `    ${parentId} -> ${leftChildId};\n`;
                this._procesarOperacion(valor1, leftChildId);
            } else {
                const leftChildId = `${parentId}_left`;
                this.graphData += `    ${leftChildId} [label="${valor1}"];\n`;
                this.graphData += `    ${parentId} -> ${leftChildId};\n`;
            }
        }

        // Procesar valor2 si existe y es un arreglo
        if (valor2 !== undefined) {
            if (Array.isArray(valor2)) {
                valor2.forEach((subOp, i) => {
                    const subChildId = `${parentId}_right${i}`;
                    this.graphData += `    ${parentId} -> ${subChildId};\n`;
                    this._procesarOperacion(subOp, subChildId);
                });
            } else if (typeof valor2 === "object" && valor2.operacion) {
                const rightChildId = `${parentId}_right`;
                this.graphData += `    ${parentId} -> ${rightChildId};\n`;
                this._procesarOperacion(valor2, rightChildId);
            } else {
                const rightChildId = `${parentId}_right`;
                this.graphData += `    ${rightChildId} [label="${valor2}"];\n`;
                this.graphData += `    ${parentId} -> ${rightChildId};\n`;
            }
        }
    }

    _calcularResultado(operacion, valor1, valor2) {
        try {
            const val1 = typeof valor1 === "object" ? this._calcularResultado(valor1.operacion, valor1.valor1, valor1.valor2) : valor1;
            const val2 = typeof valor2 === "object" ? this._calcularResultado(valor2.operacion, valor2.valor1, valor2.valor2) : valor2;

            switch (operacion) {
                case "suma": return val1 + val2;
                case "resta": return val1 - val2;
                case "multiplicacion": return val1 * val2;
                case "division": return val1 / val2;
                case "potencia": return Math.pow(val1, val2);
                case "mod": return val1 % val2;
                case "seno": return Math.sin((val1 * Math.PI) / 180);
                case "coseno": return Math.cos((val1 * Math.PI) / 180);
                case "tangente": return Math.tan((val1 * Math.PI) / 180);
                case "inverso": return 1 / val1;
                case "raiz": return Math.pow(val1, 1 / val2);
                default: return "N/A";
            }
        } catch (e) {
            return "Error";
        }
    }

    guardarArchivo(rutaSalida) {
        fs.writeFileSync(rutaSalida, this.graphData);
    }

    generarImagen(rutaSalidaBase) {
        // Crear directorio si no existe
        const dir = "./src/reports/grafos";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Generar nombre de archivo con marca de tiempo
        const fechaActual = new Date();
        const marcaDeTiempo = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${fechaActual.getDate().toString().padStart(2, "0")}_${fechaActual.getHours()
            .toString()
            .padStart(2, "0")}-${fechaActual.getMinutes()
            .toString()
            .padStart(2, "0")}-${fechaActual.getSeconds().toString().padStart(2, "0")}`;

        const rutaDot = `${dir}/${rutaSalidaBase}_${marcaDeTiempo}.dot`;
        const rutaPng = `${dir}/${rutaSalidaBase}_${marcaDeTiempo}.png`;

        this.guardarArchivo(rutaDot);

        exec(`dot -Tpng ${rutaDot} -o ${rutaPng}`, (error) => {
            if (error) {
                console.error("Error generando la imagen:", error);
            } else {
                console.log(`Imagen generada: ${rutaPng}`);
            }
        });
    }
}

module.exports = GraphGenerator;
