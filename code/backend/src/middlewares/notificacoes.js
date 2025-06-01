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