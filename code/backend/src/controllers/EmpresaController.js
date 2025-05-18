const EmpresaDAO = require("../dao/EmpresaDAO");

const { cnpj: cnpjValidator } = require("cpf-cnpj-validator");

class EmpresaController {
    async criar(req, res) {
        try {
            const id = await EmpresaDAO.criar(req.body);
            const empresa = await EmpresaDAO.buscarPorID(id);
            res.status(201).json(empresa);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao criar empresa" });
        }
    }

    async listarTodos(req, res) {
        try {
            const empresas = await EmpresaDAO.listarTodos();
            res.status(200).json(empresas);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar empresas" });
        }
    }

    async buscarPorID(req, res) {
        try {
            const { id } = req.params;
            const empresa = await EmpresaDAO.buscarPorID(id);

            if (!empresa) {
                return res.status(404).json({ erro: "Empresa não encontrada" });
            }

            res.status(200).json(empresa);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar empresa" });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            if (dadosAtualizados.cnpj && !cnpjValidator.isValid(dadosAtualizados.cnpj)) {
                return res.status(400).json({ erro: "CNPJ inválido." });
            }

            if (dadosAtualizados.cnpj) {
                dadosAtualizados.cnpj = cnpjValidator.strip(dadosAtualizados.cnpj);
            }

            const empresaAtualizada = await EmpresaDAO.atualizar(id, dadosAtualizados);
            res.status(200).json(empresaAtualizada);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao atualizar empresa" });
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await EmpresaDAO.deletar(id);
            res.status(204).end();
        } catch (error) {
            console.error("Erro:", error);
            res.status(500).json({ erro: "Erro ao deletar empresa" });
        }
    }
}

module.exports = new EmpresaController();