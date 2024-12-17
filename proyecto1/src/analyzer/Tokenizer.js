class Tokenizer {
    constructor(texto) {
        this.texto = texto;
        this.contador = 0;
    }

    // Método para obtener el siguiente token
    obtenerToken() {
        if (this.contador >= this.texto.length) return null;

        let codigo = this.texto.charCodeAt(this.contador);

        // Ignorar espacios, saltos de línea y tabulaciones
        while (codigo === 32 || codigo === 10 || codigo === 9) {
            this.contador++;
            codigo = this.texto.charCodeAt(this.contador);
        }

        // Si no hay más texto, retornar null
        if (this.contador >= this.texto.length) return null;

        // Detectar números
        if (codigo >= 48 && codigo <= 57) {
            let numero = '';
            while (codigo >= 48 && codigo <= 57) {
                numero += this.texto[this.contador];
                this.contador++;
                codigo = this.texto.charCodeAt(this.contador);
            }
            return { tipo: 'Número', valor: numero };
        }

        // Detectar identificadores y palabras reservadas
        if ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
            let palabra = '';
            while ((codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122)) {
                palabra += this.texto[this.contador];
                this.contador++;
                codigo = this.texto.charCodeAt(this.contador);
            }
            return { tipo: 'Identificador', valor: palabra };
        }

        // Detectar operadores, paréntesis, etc.
        const operadores = ['+', '-', '*', '/', '=', '(', ')', '{', '}', ';'];
        if (operadores.includes(this.texto[this.contador])) {
            return { tipo: 'Operador', valor: this.texto[this.contador++] };
        }

        // Si no se reconoce el caracter
        return null;
    }

    // Método para tokenizar todo el texto
    tokenizar() {
        const tokens = [];
        let token;
        while ((token = this.obtenerToken()) !== null) {
            tokens.push(token);
        }
        return tokens;
    }
}

module.exports = Tokenizer;
