const UsuarioDAO = require("../dao/UsuarioDAO");
const AlunoDAO = require("../dao/alunoDAO");
const EmpresaDAO = require("../dao/EmpresaDAO");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

class AuthController {
  async registrar(req, res) {
    try {
      const { nome, email, senha, tipo, ...dadosEspecificos } = req.body;

      const usuarioExistente = await UsuarioDAO.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: "E-mail já cadastrado." });
      }

      const senhaHash = bcrypt.hashSync(senha, 10);

      let novoUsuario;
      if (tipo === "aluno") {
        novoUsuario = await AlunoDAO.criar({ nome, email, senha: senhaHash, ...dadosEspecificos });
      } else if (tipo === "empresa") {
        novoUsuario = await EmpresaDAO.criar({ nome, email, senha: senhaHash, ...dadosEspecificos });
      } else {
        return res.status(400).json({ erro: "Tipo de usuário inválido." });
      }

      res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: novoUsuario });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao registrar usuário." });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await UsuarioDAO.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      const senhaValida = bcrypt.compareSync(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ mensagem: "Login bem-sucedido!", token });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao fazer login." });
    }
  }
}

module.exports = new AuthController();