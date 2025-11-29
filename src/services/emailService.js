import nodemailer from 'nodemailer';
import mailConfig from '../config/mailConfig.js';

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
          <h1 style="
            color: #2d6a4f; 
            margin-bottom: 10px;
            font-size: 28px;
          ">
           Bem-vindo ao Sistema VIVER!
          </h1>

          <p style="
            font-size: 16px; 
            margin-bottom: 20px;
            color: #344e41;
          ">
            Sua conta foi criada com sucesso e agora você faz parte da nossa plataforma de Posto de Saúde.
          </p>
        </div>

        <div style="
          background: #d8f3dc;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        ">
          <p style="
            font-size: 16px; 
            text-align: center;
            color: #1b4332;
            margin: 0;
          ">
            A partir de agora, você pode acompanhar <strong>consultas</strong>, 
            <strong>profissionais</strong> e <strong>serviços</strong> oferecidos pelo nosso Posto de Saúde.
          </p>
        </div>

        <p style="font-size: 15px; text-align: center; color: #2d6a4f;">
          Caso precise de ajuda, nossa equipe está sempre pronta para atender você.  
          <br><br>
          <strong>Que a saúde esteja sempre presente em sua vida. 💚</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #b7e4c7; margin: 25px 0;">

        <p style="
          font-size: 13px; 
          text-align: center; 
          color: #52796f;
        ">
          Este é um e-mail automático. Não é necessário responder.
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('📧 E-mail enviado! Preview URL:', previewUrl);

  return previewUrl; 
}

async function sendMedicoRemovidoEmail(to, nomeMedico) {
  const config = await mailConfig();
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: '"Sistema VIVER • Saúde e Bem-Estar" <noreply@viver.com>',
    to,
    subject: '⚠️ Médico Removido do Sistema VIVER',
    html: `
      <div style="background:#fff5f5;padding:30px;border-radius:12px;font-family:Arial;color:#5a1a1a;">
        <h1 style="text-align:center;color:#a4161a;">
          🩺 Médico Removido
        </h1>

        <p style="text-align:center;font-size:16px;">
          O profissional <strong>${nomeMedico}</strong> foi removido
          do cadastro do Posto de Saúde VIVER.
        </p>

        <div style="background:#ffe3e3;padding:18px;border-radius:10px;margin-top:20px;">
          <p style="font-size:15px;color:#7f1d1d;margin:0;">
            Caso essa remoção não tenha sido solicitada por você,
            entre em contato com a coordenação do sistema.
          </p>
        </div>

        <p style="text-align:center;margin-top:20px;font-size:15px;color:#5a1a1a;">
          Esta mensagem é apenas informativa.  
          <br>Equipe VIVER 💚
        </p>
      </div>
    `,
  });

  console.log('📧 Email enviado (médico removido):', nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
}



export default {
  createNewUser,
  sendMedicoRemovidoEmail
};
