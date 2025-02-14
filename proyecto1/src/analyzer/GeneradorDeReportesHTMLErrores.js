const fs = require('fs');

class GeneradorDeReportesHTMLErrores {
    static generarReporteHTML(nombreArchivo, datos) {
        const fechaActual = new Date();
        const marcaDeTiempo = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_${fechaActual.getHours()
            .toString()
            .padStart(2, '0')}-${fechaActual.getMinutes()
            .toString()
            .padStart(2, '0')}-${fechaActual.getSeconds().toString().padStart(2, '0')}`;

        const ruta = `./src/reports/html/Errores_${marcaDeTiempo}.html`;

        const contenidoHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Reporte - Errores Léxicos</title>
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center">Reporte de Errores Léxicos</h1>
        <table class="table table-bordered table-striped mt-4">
            <thead class="table-dark">
                <tr>
                    <th>Descripción</th>
                    <th>Valor</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                ${datos.map(error => `
                    <tr>
                        <td>${error.descripcion || ''}</td>
                        <td>${error.valor || ''}</td>
                        <td>${error.fila || ''}</td>
                        <td>${error.columna || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

        fs.writeFileSync(ruta, contenidoHTML, 'utf-8');
        console.log(`Reporte HTML de errores generado: ${ruta}`);
    }
}

module.exports = GeneradorDeReportesHTMLErrores;
