import nodemailer from 'nodemailer';
import mailConfig from '../config/mailConfig.js';

async function createNewUser(to) {
  const config = await mailConfig();
  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: '"Foods App" <noreply@foodsapp.com>',
    to,
    subject: 'Conta criada no Foods App',
    text: 'Conta criada com sucesso.\nAcesse o aplicativo para gerenciar o cadastro de comidas.',
    html: '<h1>Conta criada com sucesso.</h1><p>Acesse o aplicativo para gerenciar o cadastro de comidas.</p>',
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('E-mail enviado! Preview URL:', previewUrl);
  return previewUrl; // você pode retornar se quiser mostrar na API
}

export default { createNewUser };
