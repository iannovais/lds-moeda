class Usuario {
    constructor({ id, nome, email, senha, dataCadastro, tipo }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
        this.tipo = tipo;
    }
}

module.exports = Usuario;