import Database from '../database/database.js';

async function create({ paciente_id, nome, telefone, bairro, cidade, endereco, CEP }) {
  const db = await Database.connect();

  if (paciente_id && nome && telefone && bairro && cidade && endereco && CEP) {
    const sql = `
      INSERT INTO Paciente (paciente_id, nome, telefone, bairro, cidade, endereco, CEP)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [paciente_id, nome, telefone, bairro, cidade, endereco, CEP]);
    return await readById(paciente_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar paciente');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Paciente WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Paciente`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Paciente WHERE paciente_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Paciente não encontrado');
}

async function update({ paciente_id, nome, telefone, bairro, cidade, endereco, CEP }) {
  const db = await Database.connect();

  if (paciente_id && nome && telefone && bairro && cidade && endereco && CEP) {
    const sql = `
      UPDATE Paciente
      SET nome = ?, telefone = ?, bairro = ?, cidade = ?, endereco = ?, CEP = ?
      WHERE paciente_id = ?
    `;

    const { changes } = await db.run(sql, [nome, telefone, bairro, cidade, endereco, CEP, paciente_id]);

    if (changes === 1) return readById(paciente_id);

    throw new Error('Paciente não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos para atualização do paciente');
  }
}

async function remove(paciente_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Paciente WHERE paciente_id = ?`;
  const { changes } = await db.run(sql, [paciente_id]);

  if (changes === 1) return true;

  throw new Error('Paciente não encontrado para remoção');
}

export default { create, read, readById, update, remove };

