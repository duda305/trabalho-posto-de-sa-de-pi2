import Database from '../database/database.js';

async function create({ notificacao_id, usuario_id, tipo, mensagens, data_envio, status }) {
  const db = await Database.connect();

  if (notificacao_id && usuario_id && tipo && mensagens && data_envio && status) {
    const sql = `
      INSERT INTO Notificacoes (notificacao_id, usuario_id, tipo, mensagens, data_envio, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.run(sql, [notificacao_id, usuario_id, tipo, mensagens, data_envio, status]);
    return { notificacao_id, usuario_id, tipo, mensagens, data_envio, status };
  } else {
    throw new Error('Unable to create Notificacao');
  }
}

export default { create };
