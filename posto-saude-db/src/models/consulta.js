import Database from '../database/database.js';

async function create({ consulta_id, data_consulta, observacao, medico_id, paciente_id }) {
  const db = await Database.connect();

  if (consulta_id && data_consulta && medico_id && paciente_id) {
    const sql = `
      INSERT INTO Consulta (consulta_id, data_consulta, observacao, medico_id, paciente_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [consulta_id, data_consulta, observacao, medico_id, paciente_id]);
    return await readById(consulta_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar consulta');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Consulta WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Consulta`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Consulta WHERE consulta_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Consulta não encontrada');
}

async function update({ consulta_id, data_consulta, observacao, medico_id, paciente_id }) {
  const db = await Database.connect();

  if (consulta_id && data_consulta && medico_id && paciente_id) {
    const sql = `
      UPDATE Consulta
      SET data_consulta = ?, observacao = ?, medico_id = ?, paciente_id = ?
      WHERE consulta_id = ?
    `;

    const { changes } = await db.run(sql, [data_consulta, observacao, medico_id, paciente_id, consulta_id]);

    if (changes === 1) return readById(consulta_id);

    throw new Error('Consulta não encontrada para atualização');
  } else {
    throw new Error('Dados incompletos para atualização da consulta');
  }
}

async function remove(consulta_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Consulta WHERE consulta_id = ?`;
  const { changes } = await db.run(sql, [consulta_id]);

  if (changes === 1) return true;

  throw new Error('Consulta não encontrada para remoção');
}

export default { create, read, readById, update, remove };

