const fs = require('fs');
const path = require('path');

class GeneradorDeReportesHTMLTokens {
    static generarReporteHTML(nombreArchivo, datos) {
        const fechaActual = new Date();
        const marcaDeTiempo = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_${fechaActual.getHours()
            .toString()
            .padStart(2, '0')}-${fechaActual.getMinutes()
            .toString()
            .padStart(2, '0')}-${fechaActual.getSeconds().toString().padStart(2, '0')}`;

        // Generar la ruta del archivo HTML
        const ruta = `./src/reports/html/Tokens_${marcaDeTiempo}.html`;

        const contenidoHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Reporte - Tokens</title>
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center">Reporte de Tokens</h1>
        <table class="table table-bordered table-striped mt-4">
            <thead class="table-dark">
                <tr>
                    <th>Index</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                ${datos.map((dato, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${dato.tipo || ''}</td>
                        <td>${dato.valor || ''}</td>
                        <td>${dato.fila || ''}</td>
                        <td>${dato.columna || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

        // Escribir el archivo HTML en la ruta especificada
        fs.writeFileSync(ruta, contenidoHTML, 'utf-8');
        console.log(`Reporte HTML de Tokens generado: ${ruta}`);

        // Retornar la ruta del archivo generado
        return ruta;
    }
}

module.exports = GeneradorDeReportesHTMLTokens;
