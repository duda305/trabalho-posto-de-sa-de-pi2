import Database from '../database/database.js';

async function create({ medico_id, especialidade_id }) {
  const db = await Database.connect();

  if (medico_id && especialidade_id) {
    const sql = `
      INSERT INTO Tem (medico_id, especialidade_id)
      VALUES (?, ?)
    `;

    const { lastID } = await db.run(sql, [medico_id, especialidade_id]);
    return { medico_id, especialidade_id };
  } else {
    throw new Error('Campos obrigatórios ausentes para criar relação Tem');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Tem WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Tem`;
  return await db.all(sql);
}

async function readById({ medico_id, especialidade_id }) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Tem WHERE medico_id = ? AND especialidade_id = ?`;
  const result = await db.get(sql, [medico_id, especialidade_id]);

  if (result) return result;

  throw new Error('Relação Tem não encontrada');
}

async function remove({ medico_id, especialidade_id }) {
  const db = await Database.connect();

  const sql = `DELETE FROM Tem WHERE medico_id = ? AND especialidade_id = ?`;
  const { changes } = await db.run(sql, [medico_id, especialidade_id]);

  if (changes === 1) return true;

  throw new Error('Relação Tem não encontrada para remoção');
}

export default { create, read, readById, remove };

