const db = require('../config/db');

class UsuarioDAO {
  static async cadastrar({ nome, email, senha, tipo }) {
    const [result] = await db.execute(
      `INSERT INTO usuario (nome, email, senha, tipo)
       VALUES (?, ?, ?, ?)`,
      [nome, email, senha, tipo]
    );
    return result.insertId;
  }

  static async buscarPorEmail(email) {
    const [rows] = await db.execute(
      `SELECT * FROM usuario WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  static async login(email, senha) {
    const usuario = await this.buscarPorEmail(email);
    if (!usuario) return null;

    // MUDAR QND FOR REAL
    if (usuario.senha === senha) {
      return usuario;
    }

    return null;
  }
}

module.exports = UsuarioDAO;
