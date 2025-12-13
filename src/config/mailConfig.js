import nodemailer from 'nodemailer';

async function mailConfig() {
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined;

  // ============================
  // AMBIENTE DE DESENVOLVIMENTO
  // ============================
  if (isDev) {
    const testAccount = await nodemailer.createTestAccount();

    console.log('📧 Ethereal account criada');
    console.log('USER:', testAccount.user);
    console.log('PASS:', testAccount.pass);

    return {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  }

  // ============================
  // AMBIENTE DE PRODUÇÃO
  // ============================
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Configuração de e-mail inválida: EMAIL_USER ou EMAIL_PASS não definidos'
    );
  }

  return {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
}

export default mailConfig;
