const db = require('../config/db');
const UsuarioDAO = require('./UsuarioDAO');

class AlunoDAO {
    static async criar(aluno) {
        const usuarioId = await UsuarioDAO.criar(aluno);

        await db.execute(`
            INSERT INTO aluno (usuario_id, cpf, rg, endereco, curso, saldo_moedas)
            VALUES (?, ?, ?, ?, ?, ?)
            `, [usuarioId, aluno.cpf, aluno.rg, aluno.endereco, aluno.curso, aluno.saldoMoedas || 0]
        );

        return { id: usuarioId, ...aluno };
    }

    static async buscarPorId(id) {
        const [rows] = await db.execute(`
        SELECT *
        FROM usuario u
        JOIN alunos a ON u.id = a.usuario_id
        WHERE u.id = ?
    `, [id]);

        return rows[0];
    }
}

module.exports = AlunoDAO;
