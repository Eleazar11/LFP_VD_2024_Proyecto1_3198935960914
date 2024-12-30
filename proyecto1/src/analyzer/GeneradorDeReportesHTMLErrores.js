const fs = require('fs');

class GeneradorDeReportesHTMLErrores {
    static generarReporteHTML(nombreArchivo, erroresLexicos, erroresSemanticos) {
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
    <title>Reporte - Errores Léxicos y Semánticos</title>
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center">Reporte de Errores Léxicos y Sintácticos</h1>
        <!-- Errores Léxicos -->
        <h2 class="mt-4">Errores Léxicos</h2>
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
                ${erroresLexicos.map(error => `
                    <tr>
                        <td>${error.descripcion || ''}</td>
                        <td>${error.valor || ''}</td>
                        <td>${error.fila || ''}</td>
                        <td>${error.columna || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <!-- Errores Semánticos -->
        <h2 class="mt-4">Errores Semánticos</h2>
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
                ${erroresSemanticos.map(error => `
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
        return ruta; // Devuelve la ruta para que pueda ser utilizada.
    }
}

module.exports = GeneradorDeReportesHTMLErrores;


