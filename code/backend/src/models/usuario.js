class Usuario {
  constructor({ id, nome, email, senha, data_cadastro, tipo }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.data_cadastro = data_cadastro;
    this.tipo = tipo;
  }
}

module.exports = Usuario;