const db = require('../config/db');

async function testarConexao() {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('Conexão OK!');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    db.end();
  }
}

testarConexao();