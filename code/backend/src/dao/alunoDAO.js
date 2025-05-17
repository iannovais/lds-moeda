const pool = require("../config/db");
const Aluno = require("../models/aluno");
const UsuarioDAO = require("../dao/UsuarioDAO");

class AlunoDAO {
    async criar(alunoData) {
        const usuarioDAO = require("./UsuarioDAO");
        const usuario = await usuarioDAO.criar({ ...alunoData, tipo: "aluno" });

        await pool.execute(
            "INSERT INTO Aluno (id, cpf, rg, endereco, curso) VALUES (?, ?, ?, ?, ?)",
            [usuario.id, alunoData.cpf, alunoData.rg, alunoData.endereco, alunoData.curso]
        );

        return new Aluno({ ...usuario, ...alunoData });
    }

    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM Aluno WHERE id = ?", [id]);
        return rows[0] ? new Aluno(rows[0]) : null;
    }

    async listarTodos() {
        const [rows] = await pool.execute("SELECT * FROM Aluno");
        return rows.map((row) => new Aluno(row));
    }

    async atualizar(id, dadosAtualizados) {
        const { cpf, rg, endereco, curso, saldomoedas } = dadosAtualizados;

        await pool.execute(
            "UPDATE Aluno SET cpf = ?, rg = ?, endereco = ?, curso = ?, saldoMoedas = ? WHERE id = ?",
            [cpf, rg, endereco, curso, saldomoedas, id]
        );

        const [rows] = await pool.execute("SELECT * FROM Aluno WHERE id = ?", [id]);
        return rows[0] ? new Aluno(rows[0]) : null;
    }

    async deletar(id) {
        await UsuarioDAO.deletar(id);
    }
}

module.exports = new AlunoDAO();