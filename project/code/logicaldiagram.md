Usuario: id (PK), nome, email, senha, dataCadastro, tipo
Aluno: idUsuario (PK, FK), CPF, RG, endereco, curso, saldoMoedas
Professor: idUsuario (PK, FK), CPF, departamento, saldoMoedas, id_instituicao (FK)
Empresa: idUsuario (PK, FK), CNPJ, endereco
InstituicaoEnsino: id (PK), nome, CNPJ, endereco
Vantagem: id (PK), nome, descricao, foto, custoMoedas, empresa_id (FK), data_cadastro, ativo
Transacao: id (PK), data, tipo, valorMoedas, mensagem, codigoCupom, remetente_id (FK), destinatario_id (FK)