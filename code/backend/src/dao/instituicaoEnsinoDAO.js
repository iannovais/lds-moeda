const pool = require("../config/db");
const InstituicaoEnsino = require("../models/instituicaoEnsino");

class InstituicaoEnsinoDAO {
    async buscarPorID(id) {
        const [rows] = await pool.execute(
            "SELECT * FROM instituicaoensino WHERE id = ?", 
            [id]
        );
        return rows[0] ? new InstituicaoEnsino(rows[0]) : null;
    }

    async buscarTodas() {
        const [rows] = await pool.execute(
            "SELECT id, nome FROM instituicaoensino"
        );
        return rows.map(row => new InstituicaoEnsino(row));
    }
}

module.exports = new InstituicaoEnsinoDAO();
