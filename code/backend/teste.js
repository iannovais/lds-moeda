const ProfessorController = require('./src/controllers/ProfessorController');
const ProfessorDAO = require('./src/dao/professorDAO');
const TransacaoDAO = require('./src/dao/transacaoDAO');

async function testarRecargaMensal() {
    try {
        console.log("=== INÍCIO DO TESTE ===");

        const professoresAntes = await ProfessorDAO.listarTodos();
        console.log("\nProfessores ANTES da recarga:");
        professoresAntes.forEach(p => {
            console.log(`- ${p.nome} (ID:${p.id}): ${p.saldoMoedas} moedas`);
        });

        console.log("\nExecutando recarga mensal...");
        await ProfessorController.enviarMoedasMensais();

        const professoresDepois = await ProfessorDAO.listarTodos();
        console.log("\nProfessores DEPOIS da recarga:");
        professoresDepois.forEach(p => {
            console.log(`(ID:${p.id}): ${p.saldoMoedas} moedas`);
        });

        console.log("\nTransações registradas:");
        for (const professor of professoresDepois) {
            const transacoes = await TransacaoDAO.listarPorDestinatario(professor.id);
            transacoes.forEach(t => {
                console.log(`- Para ${professor.nome}: ${t.valorMoedas} moedas (${t.mensagem})`);
            });
        }

        console.log("\n=== TESTE CONCLUÍDO COM SUCESSO ===");
    } catch (error) {
        console.error("ERRO NO TESTE:", error);
    }
}

testarRecargaMensal();