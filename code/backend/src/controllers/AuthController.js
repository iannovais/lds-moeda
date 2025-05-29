const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsuarioDAO = require("../dao/UsuarioDAO");
const AlunoDAO = require("../dao/alunoDAO");
const EmpresaDAO = require("../dao/EmpresaDAO");
const ProfessorDAO = require("../dao/professorDAO");

const { JWT_SECRET } = require("../config/config");
const { cpf: cpfValidator, cnpj: cnpjValidator } = require("cpf-cnpj-validator");

class AuthController {
  async registrar(req, res) {
    const { tipo, nome, email, senha, cpf, rg, cnpj, departamento, id_instituicao, ...dadosRestantes } = req.body;

    try {
      const usuarioExistente = await UsuarioDAO.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: "E-mail já cadastrado." });
      }

      if (tipo === "aluno") {
        if (!cpf || !cpfValidator.isValid(cpf)) {
          return res.status(400).json({ erro: "CPF inválido." });
        }
        if (!rg || !/^\d{5,12}$/.test(rg)) {
          return res.status(400).json({ erro: "RG inválido. Deve conter entre 5 e 12 dígitos numéricos." });
        }
      } else if (tipo === "empresa") {
        if (!cnpj || !cnpjValidator.isValid(cnpj)) {
          return res.status(400).json({ erro: "CNPJ inválido." });
        }
      } else if (tipo === "professor") {
        if (!cpf || !cpfValidator.isValid(cpf)) {
          return res.status(400).json({ erro: "CPF inválido." });
        }
        if (!departamento) {
          return res.status(400).json({ erro: "Departamento é obrigatório para professores." });
        }
        if (!id_instituicao) {
          return res.status(400).json({ erro: "Instituição de ensino é obrigatória para professores." });
        }
      } else {
        return res.status(400).json({ erro: "Tipo de usuário inválido." });
      }

      const senhaHash = bcrypt.hashSync(senha, 10);

      const novoUsuario = await UsuarioDAO.criar({
        nome,
        email,
        senha: senhaHash,
        tipo
      });

      let resultado;
      if (tipo === "aluno") {
        resultado = await AlunoDAO.criar(novoUsuario.id, { cpf: cpfValidator.strip(cpf), rg, ...dadosRestantes });
      } else if (tipo === "empresa") {
        resultado = await EmpresaDAO.criar(novoUsuario.id, { cnpj: cnpjValidator.strip(cnpj), ...dadosRestantes });
      } else if (tipo === "professor") {
        resultado = await ProfessorDAO.criar(novoUsuario.id, {
          cpf: cpfValidator.strip(cpf),
          departamento,
          id_instituicao
        });
      }

      return res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        usuario: { ...novoUsuario, ...resultado }
      });

    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Erro interno ao registrar usuário." });
    }
  }


  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await UsuarioDAO.buscarPorEmail(email);

      if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        mensagem: "Login bem-sucedido!",
        token
      });

    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Erro interno ao realizar login." });
    }
  }
}

module.exports = new AuthController();


