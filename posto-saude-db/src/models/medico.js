import Database from '../database/database.js';

async function create({ medico_id, nome, CRM, disponibilidade, telefone }) {
  const db = await Database.connect();

  if (nome && CRM && disponibilidade && telefone) {
    const sql = `
      INSERT INTO Medico (medico_id, nome, CRM, disponibilidade, telefone)
      VALUES (?, ?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [medico_id, nome, CRM, disponibilidade, telefone]);
    return await readById(medico_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar medico');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Medico WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Medico`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Medico WHERE medico_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Médico não encontrado');
}

async function update({ medico_id, nome, CRM, disponibilidade, telefone }) {
  const db = await Database.connect();

  if (nome && CRM && disponibilidade && telefone && medico_id) {
    const sql = `
      UPDATE Medico
      SET nome = ?, CRM = ?, disponibilidade = ?, telefone = ?
      WHERE medico_id = ?
    `;

    const { changes } = await db.run(sql, [nome, CRM, disponibilidade, telefone, medico_id]);

    if (changes === 1) return readById(medico_id);

    throw new Error('Médico não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos para atualização do médico');
  }
}

async function remove(medico_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Medico WHERE medico_id = ?`;
  const { changes } = await db.run(sql, [medico_id]);

  if (changes === 1) return true;

  throw new Error('Médico não encontrado para remoção');
}

export default { create, read, readById, update, remove };

