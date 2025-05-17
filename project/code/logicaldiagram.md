Usuario: id (PK), nome, email, senha, dataCadastro, tipo
Aluno: id (PK, FK), CPF, RG, endereco, curso, saldoMoedas
Professor: id (PK, FK), CPF, departamento, saldoMoedas, id_instituicao (FK)
Empresa: id (PK, FK), CNPJ, endereco
InstituicaoEnsino: id (PK), CNPJ, endereco
Vantagem: id (PK), nome, descricao, foto, custoMoedas, empresa_id (FK)
Transacao: id (PK), data, tipo, valorMoedas, mensagem, codigoCupom, aluno_id (FK), professor_id (FK), vantagem_id (FK)