import Database from '../database/database.js';

async function create({ consulta_id, medicamento_id }) {
  const db = await Database.connect();

  if (consulta_id && medicamento_id) {
    const sql = `
      INSERT INTO Pede (consulta_id, medicamento_id)
      VALUES (?, ?)
    `;

    await db.run(sql, [consulta_id, medicamento_id]);
    return { consulta_id, medicamento_id };
  } else {
    throw new Error('Campos obrigatórios ausentes para criar relação Pede');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Pede WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Pede`;
  return await db.all(sql);
}

async function readById({ consulta_id, medicamento_id }) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Pede WHERE consulta_id = ? AND medicamento_id = ?`;
  const result = await db.get(sql, [consulta_id, medicamento_id]);

  if (result) return result;

  throw new Error('Relação Pede não encontrada');
}

async function remove({ consulta_id, medicamento_id }) {
  const db = await Database.connect();

  const sql = `DELETE FROM Pede WHERE consulta_id = ? AND medicamento_id = ?`;
  const { changes } = await db.run(sql, [consulta_id, medicamento_id]);

  if (changes === 1) return true;

  throw new Error('Relação Pede não encontrada para remoção');
}

export default { create, read, readById, remove };

