const fs = require('fs');

class GeneradorDeReportes {
    static generarReporteJSON(nombreArchivo, datos) {
        const ruta = `./src/analyzer/${nombreArchivo}.json`;
        fs.writeFileSync(ruta, JSON.stringify(datos, null, 4), 'utf-8');
        console.log(`Reporte generado: ${ruta}`);
    }
}

module.exports = GeneradorDeReportes;
