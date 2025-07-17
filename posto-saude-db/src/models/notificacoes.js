import Database from '../database/database.js';

async function create({ notificacao_id, usuario_id, tipo, mensagens, data_envio, status }) {
  const db = await Database.connect();

  if (notificacao_id && usuario_id && tipo && mensagens && data_envio && status) {
    const sql = `
      INSERT INTO Notificacoes (notificacao_id, usuario_id, tipo, mensagens, data_envio, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.run(sql, [notificacao_id, usuario_id, tipo, mensagens, data_envio, status]);
    return await readById(notificacao_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar notificação');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Notificacoes WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Notificacoes`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Notificacoes WHERE notificacao_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Notificação não encontrada');
}

async function update({ notificacao_id, usuario_id, tipo, mensagens, data_envio, status }) {
  const db = await Database.connect();

  if (notificacao_id && usuario_id && tipo && mensagens && data_envio && status) {
    const sql = `
      UPDATE Notificacoes
      SET usuario_id = ?, tipo = ?, mensagens = ?, data_envio = ?, status = ?
      WHERE notificacao_id = ?
    `;

    const { changes } = await db.run(sql, [usuario_id, tipo, mensagens, data_envio, status, notificacao_id]);

    if (changes === 1) return readById(notificacao_id);

    throw new Error('Notificação não encontrada para atualização');
  } else {
    throw new Error('Dados incompletos para atualização da notificação');
  }
}

async function remove(notificacao_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Notificacoes WHERE notificacao_id = ?`;
  const { changes } = await db.run(sql, [notificacao_id]);

  if (changes === 1) return true;

  throw new Error('Notificação não encontrada para remoção');
}

export default { create, read, readById, update, remove };

