import Database from '../database/database.js';

async function create({ paciente_id, nome, telefone, bairro, cidade, endereco, CEP }) {
  const db = await Database.connect();

  if (paciente_id && nome && telefone && bairro && cidade && endereco && CEP) {
    const sql = `
      INSERT INTO Paciente (paciente_id, nome, telefone, bairro, cidade, endereco, CEP)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.run(sql, [paciente_id, nome, telefone, bairro, cidade, endereco, CEP]);
    return { paciente_id, nome, telefone, bairro, cidade, endereco, CEP };
  } else {
    throw new Error('Unable to create Paciente');
  }
}

export default { create };
