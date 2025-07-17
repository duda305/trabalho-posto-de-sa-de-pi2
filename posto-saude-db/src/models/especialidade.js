import Database from '../database/database.js';

async function create({ especialidade_id, nome }) {
  const db = await Database.connect();

  if (especialidade_id && nome) {
    const sql = `
      INSERT INTO Especialidade (especialidade_id, nome)
      VALUES (?, ?)
    `;

    const { lastID } = await db.run(sql, [especialidade_id, nome]);
    return await readById(especialidade_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar especialidade');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Especialidade WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Especialidade`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Especialidade WHERE especialidade_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Especialidade não encontrada');
}

async function update({ especialidade_id, nome }) {
  const db = await Database.connect();

  if (especialidade_id && nome) {
    const sql = `
      UPDATE Especialidade
      SET nome = ?
      WHERE especialidade_id = ?
    `;

    const { changes } = await db.run(sql, [nome, especialidade_id]);

    if (changes === 1) return readById(especialidade_id);

    throw new Error('Especialidade não encontrada para atualização');
  } else {
    throw new Error('Dados incompletos para atualização da especialidade');
  }
}

async function remove(especialidade_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Especialidade WHERE especialidade_id = ?`;
  const { changes } = await db.run(sql, [especialidade_id]);

  if (changes === 1) return true;

  throw new Error('Especialidade não encontrada para remoção');
}

export default { create, read, readById, update, remove };
