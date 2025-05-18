const AlunoDAO = require("../dao/alunoDAO");

const { cpf: cpfValidator } = require("cpf-cnpj-validator");

class AlunoController {
    async criar(req, res) {
        try {
            const id = await AlunoDAO.criar(req.body);
            const aluno = await AlunoDAO.buscarPorID(id);
            res.status(201).json(aluno);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao criar aluno" });
        }
    }

    async listarTodos(req, res) {
        try {
            const alunos = await AlunoDAO.listarTodos();
            res.status(200).json(alunos);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar alunos" });
        }
    }

    async buscarPorID(req, res) {
        try {
            const { id } = req.params;
            const aluno = await AlunoDAO.buscarPorID(id);

            if (!aluno) {
                return res.status(404).json({ erro: "Aluno não encontrado" });
            }

            res.status(200).json(aluno);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar aluno" });
        }
    }


    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            if (dadosAtualizados.cpf && !cpfValidator.isValid(dadosAtualizados.cpf)) {
                return res.status(400).json({ erro: "CPF inválido." });
            }
            if (dadosAtualizados.cpf) {
                dadosAtualizados.cpf = cpfValidator.strip(dadosAtualizados.cpf);
            }

            if (dadosAtualizados.rg && !/^\d{5,12}$/.test(dadosAtualizados.rg)) {
                return res.status(400).json({ erro: "RG inválido. Deve conter entre 5 e 12 dígitos numéricos." });
            }

            const alunoAtualizado = await AlunoDAO.atualizar(id, dadosAtualizados);
            res.status(200).json(alunoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            res.status(500).json({ erro: "Erro ao atualizar aluno" });
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await AlunoDAO.deletar(id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ erro: "Erro ao deletar aluno" });
        }
    }
}

module.exports = new AlunoController();