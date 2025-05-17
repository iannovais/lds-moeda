const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsuarioDAO = require("../dao/UsuarioDAO");
const AlunoDAO = require("../dao/alunoDAO");
const EmpresaDAO = require("../dao/EmpresaDAO");

const { JWT_SECRET } = require("../config/config");

class AuthController {
  async registrar(req, res) {
    const { tipo, nome, email, senha, ...dadosRestantes } = req.body;

    try {
      const usuarioExistente = await UsuarioDAO.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: "E-mail já cadastrado." });
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
        resultado = await AlunoDAO.criar(novoUsuario.id, dadosRestantes);
      } else if (tipo === "empresa") {
        resultado = await EmpresaDAO.criar(novoUsuario.id, dadosRestantes);
      } else {
        return res.status(400).json({ erro: "Tipo de usuário inválido." });
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
