const Usuario = require("./usuario");

class Professor extends Usuario {
  constructor({ id, nome, email, senha, data_cadastro, cpf, departamento, saldoMoedas, id_instituicao }) {
    super({ id, nome, email, senha, data_cadastro, tipo: "professor" });
    this.cpf = cpf;
    this.departamento = departamento;
    this.saldoMoedas = saldoMoedas || 0;
    this.id_instituicao = id_instituicao;
  }
}

module.exports = Professor;