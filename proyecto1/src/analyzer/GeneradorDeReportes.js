const fs = require('fs');

class GeneradorDeReportes {
    static generarReporteJSON(nombreArchivo, datos) {
        const fechaActual = new Date();
        const marcaDeTiempo = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_${fechaActual.getHours()
            .toString()
            .padStart(2, '0')}-${fechaActual.getMinutes()
            .toString()
            .padStart(2, '0')}-${fechaActual.getSeconds().toString().padStart(2, '0')}`;

        const ruta = `./src/analyzer/reportes/${nombreArchivo}_3198935960914_${marcaDeTiempo}.json`;
        fs.writeFileSync(ruta, JSON.stringify(datos, null, 4), 'utf-8');
        console.log(`Reporte generado: ${ruta}`);
    }
}

module.exports = GeneradorDeReportes;
