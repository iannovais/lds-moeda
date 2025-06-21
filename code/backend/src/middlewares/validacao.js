const { cpf: cpfValidator, cnpj: cnpjValidator } = require("cpf-cnpj-validator");

const validarCPF = (cpf) => {
  if (!cpf || !cpfValidator.isValid(cpf)) {
    throw new Error("CPF inválido.");
  }
  return cpfValidator.strip(cpf);
};

const validarCNPJ = (cnpj) => {
  if (!cnpj || !cnpjValidator.isValid(cnpj)) {
    throw new Error("CNPJ inválido.");
  }
  return cnpjValidator.strip(cnpj);
};

const validarRG = (rg) => {
  if (!rg || !/^\d{5,12}$/.test(rg)) {
    throw new Error("RG inválido. Deve conter entre 5 e 12 dígitos numéricos.");
  }
  return rg;
};

module.exports = { validarCPF, validarCNPJ, validarRG };