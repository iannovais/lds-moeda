const VantagemDAO = require("../dao/vantagemDAO");

class VantagemController {
    async criar(req, res) {
        try {
            if (req.usuario.tipo !== 'empresa') {
                return res.status(403).json({ erro: "Apenas empresas podem criar vantagens" });
            }

            const dadosVantagem = {
                ...req.body,
                foto: req.file ? `/uploads/${req.file.filename}` : null,
                empresa_id: req.usuario.id
            };

            const vantagem = await VantagemDAO.criar(dadosVantagem);
            res.status(201).json(vantagem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao criar vantagem" });
        }
    }

    async listarTodasAtivas(req, res) {
        try {
            const vantagens = await VantagemDAO.listarTodasAtivas();
            res.status(200).json(vantagens);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar vantagens" });
        }
    }

    async listarPorEmpresa(req, res) {
        try {
            if (req.usuario.tipo !== 'empresa') {
                return res.status(403).json({ erro: "Apenas empresas podem listar suas vantagens" });
            }

            const vantagens = await VantagemDAO.listarPorEmpresa(req.usuario.id);
            res.status(200).json(vantagens);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar vantagens da empresa" });
        }
    }
}

module.exports = new VantagemController();