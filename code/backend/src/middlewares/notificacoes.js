const nodemailer = require('nodemailer');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('Credenciais de e-mail não configuradas no .env');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const templates = {
  moedas_recebidas: (dados) => ({
    subject: `🎉 ${dados.valor} moedas recebidas!`,
    html: `
    <div style="background-color: #f7f6f6; font-family: Arial, sans-serif; width: 100%;">
      <!--[if mso]>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
              <td style="background-color: #f7f6f6; padding: 20px 0;">
      <![endif]-->
      <div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 630px; margin: 0 auto; line-height: 1.6;">
        <div style="background-color: #2e7d32; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Sistema de Moedas Acadêmicas</h1>
        </div>
        <div style="background-color: #ffffff; padding: 5px 50px 5px 50px;">
          <h1 style="color: #2e7d32; margin-bottom: 5px;">Novas Moedas Recebidas!</h1>
          <p style="color: #666;">Olá ${dados.alunoNome},</p>
          
          <p>Você acaba de receber uma transferência de moedas acadêmicas:</p>
          
          <div style="background: #f7f6f6; border-radius: 8px; padding: 18px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: #2e7d32;">${dados.valor} moedas recebidas</h3>
            <p style="margin-bottom: 0;"><strong>Mensagem:</strong> ${dados.mensagem}</p>
          </div>
          
          <p>Estas moedas já estão disponíveis em sua conta e podem ser utilizadas para:</p>
          <ul>
            <li>Trocar por recompensas</li>
            <li>Obter vantagens acadêmicas</li>
            <li>E muito mais!</li>
          </ul>
          
          <p style="margin-top: 25px;">Atenciosamente,<br>
          <strong style="color: #2e7d32;">Equipe Acadêmica</strong><br>
          
          <div style="margin-top: 30px; font-size: 0.8em; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            Este é um e-mail automático. Em caso de dúvidas, entre em contato com a secretaria acadêmica.
          </div>
        </div>
      </div>
      <!--[if mso]>
              </td>
          </tr>
      </table>
      <![endif]-->
    </div>
    `
  }),
  cupom_gerado: (dados) => ({
    subject: `🎁 Seu cupom para ${dados.vantagemNome} está pronto!`,
    html: `
    <div style="background-color: #f7f6f6; font-family: Arial, sans-serif; width: 100%;">
      <!--[if mso]>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
              <td style="background-color: #f7f6f6; padding: 20px 0;">
      <![endif]-->
      <div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 630px; margin: 0 auto; line-height: 1.6;">
        <div style="background-color: #2e7d32; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Cupom de Vantagem</h1>
        </div>
        <div style="background-color: #ffffff; padding: 5px 50px 5px 50px;">
          <h1 style="color: #2e7d32; margin-bottom: 5px;">${dados.vantagemNome}</h1>
          <p style="color: #666;">Olá ${dados.alunoNome},</p>
          
          <p>Seu resgate foi processado com sucesso! Aqui estão os detalhes do seu cupom:</p>
          
          <div style="background: #f7f6f6; border-radius: 8px; padding: 18px; margin: 25px 0; text-align: center; border: 2px dashed #2e7d32;">
            <h2 style="margin-top: 0; color: #2e7d32;">CÓDIGO DO CUPOM</h2>
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #2e7d32;">
              ${dados.codigoCupom}
            </div>
            <p style="margin-bottom: 0;"><strong>Validade:</strong> ${new Date(dados.dataValidade).toLocaleDateString('pt-BR')}</p>
          </div>
          
          <h3 style="color: #2e7d32;">Como utilizar:</h3>
          <ol>
            <li>Apresente este cupom no estabelecimento <strong>${dados.empresaNome}</strong></li>
            <li>Endereço: ${dados.enderecoResgate}</li>
            <li>O código deve ser mostrado ao atendente ou inserido no sistema</li>
            <li>Valide o uso com o responsável</li>
          </ol>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #fff8e1; border-left: 4px solid #ffc107;">
            <p style="margin: 0;"><strong>Importante:</strong> Este cupom é pessoal e intransferível. Cada código só pode ser utilizado uma vez.</p>
          </div>
          
          <p style="margin-top: 25px;">Atenciosamente,<br>
          <strong style="color: #2e7d32;">Equipe Acadêmica</strong><br>
          
          <div style="margin-top: 30px; font-size: 0.8em; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            Você resgatou esta vantagem utilizando ${dados.valorMoedas} moedas acadêmicas.
          </div>
        </div>
      </div>
      <!--[if mso]>
              </td>
          </tr>
      </table>
      <![endif]-->
    </div>
    `
  }),
  cupom_emitido: (dados) => ({
    subject: `📝 Novo cupom emitido para ${dados.vantagemNome}`,
    html: `
    <div style="background-color: #f7f6f6; font-family: Arial, sans-serif; width: 100%;">
      <!--[if mso]>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
              <td style="background-color: #f7f6f6; padding: 20px 0;">
      <![endif]-->
      <div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 630px; margin: 0 auto; line-height: 1.6;">
        <div style="background-color: #1565c0; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Cupom Emitido - ${dados.vantagemNome}</h1>
        </div>
        <div style="background-color: #ffffff; padding: 5px 50px 5px 50px;">
          <h1 style="color: #1565c0; margin-bottom: 5px;">Novo resgate realizado</h1>
          <p style="color: #666;">Olá ${dados.empresaNome},</p>
          
          <p>O aluno ${dados.alunoNome} resgatou uma vantagem em seu estabelecimento:</p>
          
          <div style="background: #f7f6f6; border-radius: 8px; padding: 18px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #1565c0;">Detalhes do Cupom</h3>
            <p><strong>Código:</strong> <span style="font-family: monospace; font-size: 18px; font-weight: bold;">${dados.codigoCupom}</span></p>
            <p><strong>Data de Emissão:</strong> ${dados.dataResgate}</p>
            <p><strong>Valor em Moedas:</strong> ${dados.valorMoedas}</p>
          </div>
          
          <h3 style="color: #1565c0;">Instruções para validação:</h3>
          <ol>
            <li>Quando o aluno apresentar o cupom, solicite o código</li>
            <li>Verifique no sistema ou com o responsável</li>
            <li>Confirme a validade do cupom</li>
            <li>Registre a utilização</li>
          </ol>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #1565c0;">
            <p style="margin: 0;"><strong>Dica:</strong> Mantenha este e-mail como comprovante da transação.</p>
          </div>
          
          <p style="margin-top: 25px;">Atenciosamente,<br>
          <strong style="color: #1565c0;">Sistema de Moedas Acadêmicas</strong><br>
          
          <div style="margin-top: 30px; font-size: 0.8em; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            Este cupom foi gerado automaticamente pelo sistema acadêmico.
          </div>
        </div>
      </div>
      <!--[if mso]>
              </td>
          </tr>
      </table>
      <![endif]-->
    </div>
    `
  })
};

module.exports = {
  enviar: async (tipo, destinatario, dados) => {

    try {
      const template = templates[tipo](dados);

      await transporter.sendMail({
        from: '"Sistema Acadêmico" <noreply@escola.com>',
        to: destinatario,
        ...template
      });
    } catch (error) {
      console.error(`Erro ao enviar notificação ${tipo}:`, error);
    }
  }
};