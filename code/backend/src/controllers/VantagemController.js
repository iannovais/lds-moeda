const VantagemDAO = require("../dao/vantagemDAO");
const AlunoDAO = require("../dao/alunoDAO");
const TransacaoDAO = require("../dao/transacaoDAO");
const EmpresaDAO = require("../dao/EmpresaDAO");
const notificacoes = require('../middlewares/notificacoes');

const { v4: uuidv4 } = require('uuid');

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

    async resgatar(req, res) {
        try {
            const { id: alunoId } = req.usuario;
            const { vantagemId } = req.body;

            if (req.usuario.tipo !== 'aluno') {
                return res.status(403).json({ erro: "Apenas alunos podem resgatar vantagens" });
            }

            const aluno = await AlunoDAO.buscarPorID(alunoId);
            const vantagem = await VantagemDAO.buscarPorID(vantagemId);

            if (!vantagem) {
                return res.status(404).json({ erro: "Vantagem não encontrada" });
            }

            if (!vantagem.ativo) {
                return res.status(400).json({ erro: "Esta vantagem não está mais disponível" });
            }

            if (aluno.saldoMoedas < vantagem.custoMoedas) {
                return res.status(400).json({ erro: "Saldo de moedas insuficiente" });
            }

            const codigoCupom = uuidv4().substring(0, 8).toUpperCase();

            const novoSaldo = aluno.saldoMoedas - vantagem.custoMoedas;
            await AlunoDAO.atualizar(alunoId, {
                saldoMoedas: novoSaldo
            });

            await VantagemDAO.desativar(vantagemId);

            const transacao = await TransacaoDAO.criar({
                tipo: "resgate_vantagem",
                valorMoedas: vantagem.custoMoedas,
                mensagem: `Resgate: ${vantagem.nome} - CUPOM: ${codigoCupom}`,
                remetente_id: vantagem.empresa_id,
                destinatario_id: alunoId,
            });


            const empresa = await EmpresaDAO.buscarPorID(vantagem.empresa_id);

            await notificacoes.enviar('cupom_gerado', aluno.email, {
                alunoNome: aluno.nome,
                vantagemNome: vantagem.nome,
                empresaNome: empresa.nome,
                codigoCupom: codigoCupom,
                dataValidade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                enderecoResgate: empresa.endereco || "Informe no local"
            });

            await notificacoes.enviar('cupom_emitido', empresa.email, {
                empresaNome: empresa.nome,
                alunoNome: aluno.nome,
                vantagemNome: vantagem.nome,
                codigoCupom: codigoCupom,
                dataResgate: new Date().toLocaleDateString(),
                valorMoedas: vantagem.custoMoedas
            });

            res.status(200).json({
                mensagem: "Vantagem resgatada com sucesso!",
                cupom: codigoCupom,
                saldoAtual: novoSaldo,
                detalhesVantagem: {
                    nome: vantagem.nome,
                    empresa: empresa.nome
                }
            });

        } catch (error) {
            console.error("Erro ao resgatar vantagem:", error);
            res.status(500).json({ erro: "Erro ao resgatar vantagem" });
        }
    }
}

module.exports = new VantagemController();