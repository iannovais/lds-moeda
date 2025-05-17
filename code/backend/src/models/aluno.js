const Usuario = require("./usuario");

class Aluno extends Usuario {
  constructor({ id, nome, email, senha, data_cadastro, cpf, rg, endereco, curso, saldoMoedas }) {
    super({ id, nome, email, senha, data_cadastro, tipo: "aluno" });
    this.cpf = cpf;
    this.rg = rg;
    this.endereco = endereco;
    this.curso = curso;
    this.saldoMoedas = saldoMoedas || 0;
  }
}

module.exports = Aluno;