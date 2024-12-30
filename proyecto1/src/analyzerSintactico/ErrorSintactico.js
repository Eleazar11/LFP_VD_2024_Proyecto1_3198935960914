class ErrorSintactico {
    constructor(token, descripcion, fila, columna) {
        this.token = token; // El token que causó el error
        this.descripcion = descripcion; // Descripción del error
        this.fila = fila; // Fila donde ocurrió el error
        this.columna = columna; // Columna donde ocurrió el error
    }
}

module.exports = ErrorSintactico;
