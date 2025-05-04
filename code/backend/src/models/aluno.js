const Usuario = require('./usuario');

class Aluno extends Usuario {
  constructor({ id, nome, email, senha, cpf, rg, endereco, curso, saldoMoedas = 0 }) {
    super({ id, nome, email, senha, tipo: 'aluno' });
    this.cpf = cpf;
    this.rg = rg;
    this.endereco = endereco;
    this.curso = curso;
    this.saldoMoedas = saldoMoedas;
  }
}

module.exports = Aluno;
