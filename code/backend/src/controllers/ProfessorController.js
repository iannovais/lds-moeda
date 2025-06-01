const ProfessorDAO = require("../dao/professorDAO");
const TransacaoDAO = require("../dao/transacaoDAO");
const AlunoDAO = require("../dao/alunoDAO");
const InstituicaoEnsinoDAO = require("../dao/instituicaoEnsinoDAO");
const InstituicaoEnsino = require("../models/instituicaoEnsino");
const notificacoes = require('../middlewares/notificacoes');

const { cpf: cpfValidator } = require("cpf-cnpj-validator");

class ProfessorController {
    async criar(req, res) {
        try {
            const id = await ProfessorDAO.criar(req.body);
            const professor = await ProfessorDAO.buscarPorID(id);
            res.status(201).json(professor);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao criar professor" });
        }
    }

    async listarTodos(req, res) {
        try {
            const professores = await ProfessorDAO.listarTodos();
            res.status(200).json(professores);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar professores" });
        }
    }

    async buscarPorID(req, res) {
        try {
            const { id } = req.params;
            const professor = await ProfessorDAO.buscarPorID(id);

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }

            res.status(200).json(professor);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar professor" });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            if (dadosAtualizados.cpf && !cpfValidator.isValid(dadosAtualizados.cpf)) {
                return res.status(400).json({ erro: "CPF inválido." });
            }

            const professorAtualizado = await ProfessorDAO.atualizar(id, dadosAtualizados);
            res.status(200).json(professorAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar professor:", error);
            res.status(500).json({ erro: "Erro ao atualizar professor" });
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await ProfessorDAO.deletar(id);
            res.status(204).end();
        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: "Erro ao deletar professor" });
        }
    }

    async enviarMoedas(req, res) {
        try {
            const { id: professorId } = req.usuario;
            const { alunoId, valor, mensagem } = req.body;

            if (!valor || !alunoId) {
                return res.status(400).json({ erro: "Valor e alunoId são obrigatórios" });
            }

            const professor = await ProfessorDAO.buscarPorID(professorId);
            if (professor.saldoMoedas < valor) {
                return res.status(400).json({ erro: "Saldo insuficiente" });
            }

            if (valor <= 0) {
                return res.status(400).json({ erro: "Você não pode enviar valor negativo ou zero!" })
            }

            const aluno = await AlunoDAO.buscarPorID(alunoId);
            if (!aluno) {
                return res.status(404).json({ erro: "Aluno não encontrado" });
            }

            if (!mensagem) {
                return res.status(404).json({ erro: "Você não pode enviar sem uma mensagem" });
            }

            const transacao = await TransacaoDAO.criar({
                tipo: "envio_moedas",
                valorMoedas: valor,
                mensagem: mensagem,
                remetente_id: professorId,
                destinatario_id: alunoId
            });

            await ProfessorDAO.atualizar(professorId, {
                saldoMoedas: professor.saldoMoedas - valor
            });

            await AlunoDAO.atualizar(alunoId, {
                saldoMoedas: aluno.saldoMoedas + valor
            });

            await notificacoes.enviar('moedas_recebidas', aluno.email, {
                alunoNome: aluno.nome,
                remetenteNome: professor.nome,
                valor: valor,
                mensagem: mensagem
            });

            res.status(201).json(transacao);
        } catch (error) {
            console.error("Erro ao enviar moedas:", error);
            res.status(500).json({ erro: "Erro ao enviar moedas" });
        }
    }

    async getExtrato(req, res) {
        try {
            const { id } = req.usuario;
            const transacoes = await TransacaoDAO.listarPorUsuario(id);
            res.status(200).json(transacoes);
        } catch (error) {
            console.error("Erro ao buscar extrato:", error);
            res.status(500).json({ erro: "Erro ao buscar extrato" });
        }
    }

    async enviarMoedasMensais() {
        try {
            const professores = await ProfessorDAO.listarTodos();

            for (const professor of professores) {
                const instituicao = await InstituicaoEnsinoDAO.buscarPorID(professor.id_instituicao);
                if (!instituicao) {
                    console.warn(`Instituição não encontrada para o professor ${professor.nome}`);
                    continue;
                }

                const valorEnvio = instituicao.MAXENVIOPARAPROFESSOR;

                await ProfessorDAO.atualizar(professor.id, {
                    saldoMoedas: professor.saldoMoedas + valorEnvio
                });

                await TransacaoDAO.criar({
                    tipo: "recarga_instituicao",
                    valorMoedas: valorEnvio,
                    mensagem: `Recarga mensal de ${valorEnvio} moedas`,
                    remetente_id: null,
                    destinatario_id: professor.id
                });
            }

            console.log(`Recarga mensal concluída para ${professores.length} professores`);
        } catch (error) {
            console.error("Erro no envio mensal de moedas:", error);
            throw error;
        }
    }
}

module.exports = new ProfessorController();