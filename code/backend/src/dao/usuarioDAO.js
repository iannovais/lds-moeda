const pool = require("../config/db");

const Usuario = require("../models/usuario");

class UsuarioDAO {
  async criar({ nome, email, senha, tipo }) {
    const [result] = await pool.execute(
      "INSERT INTO Usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senha, tipo]
    );
    return new Usuario({ id: result.insertId, nome, email, senha, tipo });
  }

  async buscarPorEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM Usuario WHERE email = ?", [email]);
    return rows[0] ? new Usuario(rows[0]) : null;
  }

  async buscarPorID(id) {
    const [rows] = await pool.execute("SELECT * FROM Usuario WHERE id = ?", [id]);
    return rows[0] ? new Usuario(rows[0]) : null;
  }

  async listarTodos() {
    const [rows] = await pool.execute("SELECT * FROM Usuario");
    return rows.map((row) => new Usuario(row));
  }

  async atualizar(id, dadosAtualizados) {
    const campos = [];
    const valores = [];

    for (const chave in dadosAtualizados) {
      campos.push(`${chave} = ?`);
      valores.push(dadosAtualizados[chave]);
    }
    valores.push(id);

    const sql = `UPDATE Usuario SET ${campos.join(", ")} WHERE id = ?`;
    await pool.execute(sql, valores);

    return this.buscarPorID(id);
  }

  async deletar(id) {
    await pool.execute("DELETE FROM Usuario WHERE id = ?", [id]);
  }
}

module.exports = new UsuarioDAO();
