import Database from '../database/database.js';

async function create({ medico_id, nome, CRM, disponibilidade, telefone }) {
  const db = await Database.connect();

  if (medico_id && nome && CRM && disponibilidade && telefone) {
    const sql = `
      INSERT INTO Medico (medico_id, nome, CRM, disponibilidade, telefone)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(sql, [medico_id, nome, CRM, disponibilidade, telefone]);
    return { medico_id, nome, CRM, disponibilidade, telefone };
  } else {
    throw new Error('Unable to create Medico');
  }
}

export default { create };
