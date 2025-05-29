const pool = require("../config/db");
const Professor = require("../models/professor");
const UsuarioDAO = require("../dao/UsuarioDAO");

class ProfessorDAO {
    async criar(idUsuario, dadosProfessor) {
        const { cpf, departamento, id_instituicao } = dadosProfessor;

        await pool.execute(
            "INSERT INTO Professor (id, cpf, departamento, id_instituicao) VALUES (?, ?, ?, ?)",
            [idUsuario, cpf, departamento, id_instituicao]
        );

        const [rows] = await pool.execute("SELECT * FROM Professor WHERE id = ?", [idUsuario]);
        return rows[0] ? new Professor(rows[0]) : null;
    }

    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM Professor WHERE id = ?", [id]);
        return rows[0] ? new Professor(rows[0]) : null;
    }

    async listarTodos() {
        const [rows] = await pool.execute("SELECT * FROM Professor");
        return rows.map((row) => new Professor(row));
    }

    async atualizar(id, dadosAtualizados) {
        const camposValidos = {};
        for (const [chave, valor] of Object.entries(dadosAtualizados)) {
            if (valor !== undefined) {
                camposValidos[chave] = valor;
            }
        }

        if (Object.keys(camposValidos).length === 0) {
            return this.buscarPorID(id);
        }

        const campos = [];
        const valores = [];

        for (const [chave, valor] of Object.entries(camposValidos)) {
            campos.push(`${chave} = ?`);
            valores.push(valor);
        }
        valores.push(id);

        const sql = `UPDATE Professor SET ${campos.join(", ")} WHERE id = ?`;
        await pool.execute(sql, valores);

        return this.buscarPorID(id);
    }

    async deletar(id) {
        await UsuarioDAO.deletar(id);
    }
}

module.exports = new ProfessorDAO();