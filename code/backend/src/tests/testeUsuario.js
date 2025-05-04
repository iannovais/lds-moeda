const UsuarioDAO = require('../dao/UsuarioDAO');

async function testarUsuario() {
  const novoUsuario = {
    nome: 'Ana',
    email: 'ana@email.com',
    senha: '1234',
    tipo: 'aluno'
  };

  const id = await UsuarioDAO.cadastrar(novoUsuario);
  console.log('✅ Usuário cadastrado com ID:', id);
}

testarUsuario();