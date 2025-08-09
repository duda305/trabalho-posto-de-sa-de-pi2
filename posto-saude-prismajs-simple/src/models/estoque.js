import Database from '../database/database.js';

async function create({ estoque_id, medicamento_id, quantidade }) {
  const db = await Database.connect();

  if (estoque_id && medicamento_id && quantidade >= 0) {
    const sql = `
      INSERT INTO Estoque (estoque_id, medicamento_id, quantidade)
      VALUES (?, ?, ?)
    `;

    await db.run(sql, [estoque_id, medicamento_id, quantidade]);
    return await readById(estoque_id);
  } else {
    throw new Error('Campos obrigatórios ausentes ou inválidos para criar estoque');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Estoque WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Estoque`;
  return await db.all(sql);
}

async function readById(estoque_id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Estoque WHERE estoque_id = ?`;
  const result = await db.get(sql, [estoque_id]);

  if (result) return result;

  throw new Error('Registro de estoque não encontrado');
}

async function update({ estoque_id, medicamento_id, quantidade }) {
  const db = await Database.connect();

  if (estoque_id && medicamento_id && quantidade >= 0) {
    const sql = `
      UPDATE Estoque
      SET medicamento_id = ?, quantidade = ?
      WHERE estoque_id = ?
    `;

    const { changes } = await db.run(sql, [medicamento_id, quantidade, estoque_id]);

    if (changes === 1) return readById(estoque_id);

    throw new Error('Estoque não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos ou inválidos para atualização do estoque');
  }
}

async function remove(estoque_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Estoque WHERE estoque_id = ?`;
  const { changes } = await db.run(sql, [estoque_id]);

  if (changes === 1) return true;

  throw new Error('Estoque não encontrado para remoção');
}

export default { create, read, readById, update, remove };

