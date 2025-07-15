import Database from '../database/database.js';

async function create({ medico_id, especialidade_id }) {
  const db = await Database.connect();

  if (medico_id && especialidade_id) {
    const sql = `
      INSERT INTO Tem (medico_id, especialidade_id)
      VALUES (?, ?)
    `;
    await db.run(sql, [medico_id, especialidade_id]);
    return { medico_id, especialidade_id };
  } else {
    throw new Error('Unable to create relation in Tem');
  }
}

export default { create };
