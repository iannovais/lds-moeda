const pool = require("../config/db");
const Transacao = require("../models/transacao");

class TransacaoDAO {
    async criar(transacaoData) {
        const { tipo, valorMoedas, mensagem, remetente_id, destinatario_id } = transacaoData;

        const [result] = await pool.execute(
            "INSERT INTO Transacao (tipo, valorMoedas, mensagem, remetente_id, destinatario_id) VALUES (?, ?, ?, ?, ?)",
            [tipo, valorMoedas, mensagem, remetente_id, destinatario_id]
        );

        return this.buscarPorID(result.insertId);
    }

    async buscarPorID(id) {
        const [rows] = await pool.execute("SELECT * FROM Transacao WHERE id = ?", [id]);
        return rows[0] ? new Transacao(rows[0]) : null;
    }

    async listarPorRemetente(remetente_id) {
        const [rows] = await pool.execute("SELECT * FROM Transacao WHERE remetente_id = ?", [remetente_id]);
        return rows.map(row => new Transacao(row));
    }

    async listarPorDestinatario(destinatario_id) {
        const [rows] = await pool.execute("SELECT * FROM Transacao WHERE destinatario_id = ?", [destinatario_id]);
        return rows.map(row => new Transacao(row));
    }

    async listarPorUsuario(usuario_id) {
        const [rows] = await pool.execute(
            "SELECT * FROM Transacao WHERE remetente_id = ? OR destinatario_id = ?",
            [usuario_id, usuario_id]
        );
        return rows.map(row => new Transacao(row));
    }
}

module.exports = new TransacaoDAO();