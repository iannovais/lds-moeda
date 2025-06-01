const instituicaoEnsinoDAO = require('../dao/instituicaoEnsinoDAO');

class InstituicaoEnsinoController {
    async listar(req, res) {
        try {
            const instituicoes = await instituicaoEnsinoDAO.buscarTodas();
            res.json(instituicoes);
        } catch (error) {
            console.error("Erro ao buscar instituições:", error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}

module.exports = new InstituicaoEnsinoController();
