const pool = require("../config/db");
const Empresa = require("../models/Empresa");
const UsuarioDAO = require("../dao/UsuarioDAO");

class EmpresaDAO {
    async criar(empresaData) {
        const usuarioDAO = require("./UsuarioDAO");
        const usuario = await usuarioDAO.criar({ ...empresaData, tipo: "empresa" });

        await pool.execute(
            "INSERT INTO Empresa (id, cnpj, endereco) VALUES (?, ?, ?)",
            [usuario.id, empresaData.cnpj, empresaData.endereco]
        );

        return new Empresa({ ...usuario, ...empresaData });
    }

    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM Empresa WHERE id = ?", [id]);
        return rows[0] ? new Empresa(rows[0]) : null;
    }

    async atualizar(id, dadosAtualizados) {
        const { cnpj, endereco } = dadosAtualizados;


        try {
            await pool.execute(
                "UPDATE Empresa SET CNPJ = ?, endereco = ? WHERE id = ?",
                [cnpj, endereco, id]
            );

            const [rows] = await pool.execute("SELECT * FROM Empresa WHERE id = ?", [id]);
            return rows[0] ? new Empresa(rows[0]) : null;
        } catch (erro) {
            console.error("Erro ao atualizar empresa:", erro);
            throw new Error("Erro ao atualizar empresa");
        }
    }

    async listarTodos() {
        const [rows] = await pool.execute("SELECT * FROM Empresa");
        return rows.map((row) => new Empresa(row));
    }

    async deletar(id) {
        await UsuarioDAO.deletar(id);
    }
}

module.exports = new EmpresaDAO();