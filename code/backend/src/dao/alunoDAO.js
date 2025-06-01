const pool = require("../config/db");
const Aluno = require("../models/aluno");
const UsuarioDAO = require("../dao/UsuarioDAO");

class AlunoDAO {
    async criar(idUsuario, dadosAluno) {
        const { cpf, rg, endereco, curso } = dadosAluno;

        await pool.execute(
            "INSERT INTO Aluno (id, cpf, rg, endereco, curso) VALUES (?, ?, ?, ?, ?)",
            [idUsuario, cpf, rg, endereco, curso]
        );

        const [rows] = await pool.execute("SELECT * FROM Aluno WHERE id = ?", [idUsuario]);
        return rows[0] ? new Aluno(rows[0]) : null;
    }


    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM Usuario u INNER JOIN aluno a ON u.id = a.id WHERE u.id = ?", [id]);
        return rows[0] ? new Aluno(rows[0]) : null;
    }

    async listarTodos() {
        const [rows] = await pool.execute("SELECT * FROM Aluno");
        return rows.map((row) => new Aluno(row));
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

        const sql = `UPDATE Aluno SET ${campos.join(", ")} WHERE id = ?`;
        await pool.execute(sql, valores);

        return this.buscarPorID(id);
    }

    async deletar(id) {
        await UsuarioDAO.deletar(id);
    }
}

module.exports = new AlunoDAO();