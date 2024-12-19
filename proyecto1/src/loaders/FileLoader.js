const fs = require('fs');
const path = require('path');

class FileLoader {
    constructor() {
        this.filePath = ''; // Variable para almacenar la ruta del archivo
        this.fileContents = ''; // Variable para almacenar el contenido del archivo
    }

    // Método para establecer la ruta del archivo
    setFilePath(path) {
        this.filePath = path;
    }

    // Método para verificar si la ruta del archivo es válida
    isValidFilePath() {
        return fs.existsSync(this.filePath); // No verificamos la extensión para permitir otros tipos de archivos
    }

    // Método para leer el archivo como texto sin intentar parsearlo
    readFile() {
        return new Promise((resolve, reject) => {
            if (!this.filePath || !this.isValidFilePath()) {
                reject('Ruta de archivo inválida o el archivo no existe.');
                return;
            }

            // Limpiar el contenido previo antes de cargar el nuevo archivo
            this.fileContents = '';

            fs.readFile(this.filePath, 'utf8', (err, data) => {
                if (err) {
                    reject('Error al leer el archivo: ' + err);
                } else {
                    this.fileContents = data; // Guardamos el contenido del archivo
                    resolve(data); // Resolvemos con el contenido en texto plano
                }
            });
        });
    }

    // Método para analizar el contenido del archivo como JSON (opcional)
    parseAsJSON() {
        return new Promise((resolve, reject) => {
            try {
                const parsedData = JSON.parse(this.fileContents);
                resolve(parsedData);
            } catch (parseError) {
                reject('Error al parsear el archivo JSON: ' + parseError);
            }
        });
    }

    // Método para limpiar manualmente el contenido
    clearFileContents() {
        this.fileContents = '';
    }

    // Método para obtener el contenido del archivo en texto plano
    getFileContents() {
        return this.fileContents;
    }
}

module.exports = FileLoader;
