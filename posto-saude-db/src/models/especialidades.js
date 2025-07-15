import Database from '../database/database.js';

async function create({ especialidade_id, nome }) {
  const db = await Database.connect();

  if (especialidade_id && nome) {
    const sql = `
      INSERT INTO Especialidade (especialidade_id, nome)
      VALUES (?, ?)
    `;
    await db.run(sql, [especialidade_id, nome]);
    return { especialidade_id, nome };
  } else {
    throw new Error('Unable to create Especialidade');
  }
}

export default { create };
