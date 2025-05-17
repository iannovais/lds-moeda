const Usuario = require("./usuario");

class Empresa extends Usuario {
  constructor({ id, nome, email, senha, data_cadastro, cnpj, endereco }) {
    super({ id, nome, email, senha, data_cadastro, tipo: "empresa" });
    this.cnpj = cnpj;
    this.endereco = endereco;
  }
}

module.exports = Empresa;