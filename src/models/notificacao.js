import prisma from '../database/database.js';

async function create({ notificacao_id, usuario_id, tipo, mensagens, data_envio, status }) {
  if (notificacao_id && usuario_id && tipo && mensagens && data_envio && status) {
    const createdNotificacao = await prisma.notificacao.create({
      data: {
        notificacao_id,
        usuario_id,
        tipo,
        mensagens,
        data_envio,
        status,
      },
    });

    return createdNotificacao;
  } else {
    throw new Error('Campos obrigatórios ausentes para criar notificação');
  }
}

async function read(where) {
  const notificacao = await prisma.notificacoes.findMany({
    where: where || {},
  });

  if (notificacao.length === 1 && where) {
    return notificacao[0];
  }

  return notificacao;
}

async function readById(notificacao_id) {
  if (notificacao_id) {
    const notificacao = await prisma.notificacoes.findUnique({
      where: { notificacao_id },
    });

    if (!notificacao) throw new Error('Notificação não encontrada');
    return notificacao;
  } else {
    throw new Error('ID da notificação é obrigatório');
  }
}

async function update({ notificacao_id, usuario_id, tipo, mensagens, data_envio, status }) {
  if (notificacao_id && usuario_id && tipo && mensagens && data_envio && status) {
    const updatedNotificacao = await prisma.notificacao.update({
      where: { notificacao_id },
      data: {
        usuario_id,
        tipo,
        mensagens,
        data_envio,
        status,
      },
    });

    return updatedNotificacao;
  } else {
    throw new Error('Dados incompletos para atualização da notificação');
  }
}

async function remove(notificacao_id) {
  if (notificacao_id) {
    await prisma.notificacao.delete({
      where: { notificacao_id },
    });

    return true;
  } else {
    throw new Error('ID da notificação é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };