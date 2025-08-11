import Database from '../database/database.js';

async function create({ medicamento_id, nome, fabricante, data_validade }) {
  const db = await Database.connect();

  if (medicamento_id && nome && fabricante && data_validade) {
    const sql = `
      INSERT INTO Medicamento (medicamento_id, nome, fabricante, data_validade)
      VALUES (?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [medicamento_id, nome, fabricante, data_validade]);
    return await readById(medicamento_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar medicamento');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Medicamento WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Medicamento`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Medicamento WHERE medicamento_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Medicamento não encontrado');
}

async function update({ medicamento_id, nome, fabricante, data_validade }) {
  const db = await Database.connect();

  if (medicamento_id && nome && fabricante && data_validade) {
    const sql = `
      UPDATE Medicamento
      SET nome = ?, fabricante = ?, data_validade = ?
      WHERE medicamento_id = ?
    `;

    const { changes } = await db.run(sql, [nome, fabricante, data_validade, medicamento_id]);

    if (changes === 1) return readById(medicamento_id);

    throw new Error('Medicamento não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos para atualização do medicamento');
  }
}

async function remove(medicamento_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Medicamento WHERE medicamento_id = ?`;
  const { changes } = await db.run(sql, [medicamento_id]);

  if (changes === 1) return true;

  throw new Error('Medicamento não encontrado para remoção');
}

export default { create, read, readById, update, remove };

