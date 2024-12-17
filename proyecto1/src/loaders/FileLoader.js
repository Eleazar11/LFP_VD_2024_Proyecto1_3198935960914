const fs = require('fs');
const path = require('path');

class FileLoader {
    constructor() {
        this.filePath = ''; // Variable para almacenar la ruta del archivo
    }

    // Método para establecer la ruta del archivo
    setFilePath(path) {
        this.filePath = path;
    }

    // Método para verificar si la ruta del archivo es válida
    isValidFilePath() {
        return fs.existsSync(this.filePath) && path.extname(this.filePath) === '.json';
    }

    // Método para leer el archivo JSON
    readFile() {
        return new Promise((resolve, reject) => {
            if (!this.filePath || !this.isValidFilePath()) {
                reject('Ruta de archivo inválida o el archivo no es un JSON válido.');
                return;
            }

            fs.readFile(this.filePath, 'utf8', (err, data) => {
                if (err) {
                    reject('Error al leer el archivo: ' + err);
                } else {
                    try {
                        const parsedData = JSON.parse(data); // Parsear el contenido del archivo JSON
                        resolve(parsedData);
                    } catch (parseError) {
                        reject('Error al parsear el archivo JSON: ' + parseError);
                    }
                }
            });
        });
    }
}

module.exports = FileLoader;
