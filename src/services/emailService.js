import nodemailer from 'nodemailer';
import mailConfig from '../config/mailConfig.js';

// ===============================
// EMAIL: NOVO USUÁRIO
// ===============================
async function createNewUser(to) {
  const config = await mailConfig();
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: '"Sistema VIVER • Saúde e Bem-Estar" <noreply@viver.com>',
    to,
    subject: '✨ Bem-vindo ao Sistema VIVER!',
    text:
      'Sua conta foi criada com sucesso no Sistema VIVER.\n' +
      'Agora você pode acessar a plataforma para acompanhar os médicos disponíveis, agendamentos de consultas, entre outros serviços.',
    html: `
      <div style="
        background: #f4f9f4;
        padding: 30px;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        color: #1b4332;
      ">
        <div style="text-align: center;">
          <h1 style="color:#2d6a4f;font-size:28px;">
            Bem-vindo ao Sistema VIVER!
          </h1>

          <p style="font-size:16px;color:#344e41;">
            Sua conta foi criada com sucesso e agora você faz parte da nossa plataforma.
          </p>
        </div>

        <div style="background:#d8f3dc;padding:15px;border-radius:8px;margin:20px 0;">
          <p style="text-align:center;">
            Acompanhe <strong>consultas</strong>, <strong>profissionais</strong> e <strong>serviços</strong>.
          </p>
        </div>

        <p style="text-align:center;">
          Que a saúde esteja sempre presente em sua vida 💚
        </p>

        <hr style="border-top:1px solid #b7e4c7;">

        <p style="font-size:13px;text-align:center;color:#52796f;">
          Este é um e-mail automático. Não responda.
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('📧 E-mail enviado (novo usuário):', previewUrl);

  return previewUrl;
}

// ===============================
// EMAIL: MÉDICO REMOVIDO
// ===============================
async function sendMedicoRemovidoEmail(to, nomeMedico) {
  const config = await mailConfig();
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: '"Sistema VIVER • Saúde e Bem-Estar" <noreply@viver.com>',
    to,
    subject: '⚠️ Médico Removido do Sistema VIVER',
    html: `
      <div style="background:#fff5f5;padding:30px;border-radius:12px;font-family:Arial;">
        <h1 style="text-align:center;color:#a4161a;">🩺 Médico Removido</h1>

        <p style="text-align:center;">
          O profissional <strong>${nomeMedico}</strong> foi removido do sistema.
        </p>

        <p style="text-align:center;color:#7f1d1d;">
          Caso isso não tenha sido solicitado, entre em contato com a coordenação.
        </p>

        <p style="text-align:center;margin-top:20px;">
          Equipe VIVER 💚
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('📧 Email enviado (médico removido):', previewUrl);

  return previewUrl;
}

// ===============================
// EMAIL: CONTATO
// ===============================
async function send({ to, usuario, mensagem }) {
  const config = await mailConfig();
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: '"Sistema VIVER • Contato" <noreply@viver.com>',
    to,
    subject: '📩 Nova mensagem de contato',
    html: `
      <div style="font-family:Arial;padding:30px;background:#f4f9f4;border-radius:12px;">
        <h2 style="color:#2d6a4f;text-align:center;">
          📬 Nova mensagem de contato
        </h2>

        <p><strong>Usuário logado:</strong></p>
        <ul>
          <li><strong>Nome:</strong> ${usuario.nome}</li>
          <li><strong>Email:</strong> ${usuario.email}</li>
          <li><strong>ID:</strong> ${usuario.usuario_id}</li>
        </ul>

        <hr>

        <p><strong>Mensagem:</strong></p>
        <div style="background:#d8f3dc;padding:15px;border-radius:8px;">
          ${mensagem}
        </div>

        <hr>

        <p style="font-size:13px;text-align:center;color:#52796f;">
          Mensagem enviada através do formulário de contato do Sistema VIVER.
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('📧 Email de contato enviado:', previewUrl);

  return previewUrl;
}

// ===============================
// EXPORT
// ===============================
export default {
  createNewUser,
  sendMedicoRemovidoEmail,
  send
};
