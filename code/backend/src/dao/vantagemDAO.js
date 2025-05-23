const pool = require("../config/db");
const Vantagem = require("../models/vantagem");

class VantagemDAO {
    async criar(vantagemData) {
        const [result] = await pool.execute(
            "INSERT INTO vantagem (nome, descricao, foto, custoMoedas, empresa_id) VALUES (?, ?, ?, ?, ?)",
            [vantagemData.nome, vantagemData.descricao, vantagemData.foto, vantagemData.custoMoedas, vantagemData.empresa_id]
        );
        return this.buscarPorID(result.insertId);
    }

    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM vantagem WHERE id = ?", [id]);
        return rows[0] ? new Vantagem(rows[0]) : null;
    }

    async listarPorEmpresa(empresa_id) {
        const [rows] = await pool.execute("SELECT * FROM vantagem WHERE empresa_id = ?", [empresa_id]);
        return rows.map(row => new Vantagem(row));
    }

    async listarTodasAtivas() {
        const [rows] = await pool.execute("SELECT * FROM vantagem WHERE ativo = TRUE");
        return rows.map(row => new Vantagem(row));
    }

    async atualizar(id, dadosAtualizados) {
        await pool.execute(
            "UPDATE vantagem SET nome = ?, descricao = ?, foto = ?, custoMoedas = ?, ativo = ? WHERE id = ?",
            [dadosAtualizados.nome, dadosAtualizados.descricao, dadosAtualizados.foto,
            dadosAtualizados.custoMoedas, dadosAtualizados.ativo, id]
        );
        return this.buscarPorID(id);
    }

    async deletar(id) {
        await pool.execute("DELETE FROM vantagem WHERE id = ?", [id]);
    }
}

module.exports = new VantagemDAO();