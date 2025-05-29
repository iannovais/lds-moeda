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
        const { cpf, departamento, saldoMoedas, id_instituicao } = dadosAtualizados;

        await pool.execute(
            "UPDATE Professor SET cpf = ?, departamento = ?, saldoMoedas = ?, id_instituicao = ? WHERE id = ?",
            [cpf, departamento, saldoMoedas, id_instituicao, id]
        );

        const [rows] = await pool.execute("SELECT * FROM Professor WHERE id = ?", [id]);
        return rows[0] ? new Professor(rows[0]) : null;
    }

    async deletar(id) {
        await UsuarioDAO.deletar(id);
    }
}

module.exports = new ProfessorDAO();