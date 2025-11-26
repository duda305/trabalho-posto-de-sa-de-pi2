import nodemailer from 'nodemailer';

async function mailConfig() {
  if (process.env.NODE_ENV === 'development') {
    // Cria conta de teste Ethereal
    const testAccount = await nodemailer.createTestAccount();

    console.log('ETHEREAL USER:', testAccount.user);
    console.log('ETHEREAL PASS:', testAccount.pass);

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

  // Para produção
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
