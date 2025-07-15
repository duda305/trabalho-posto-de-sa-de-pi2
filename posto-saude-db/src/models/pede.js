import Database from '../database/database.js';

async function create({ consulta_id, medicamento_id }) {
  const db = await Database.connect();

  if (consulta_id && medicamento_id) {
    const sql = `
      INSERT INTO Pede (consulta_id, medicamento_id)
      VALUES (?, ?)
    `;
    await db.run(sql, [consulta_id, medicamento_id]);
    return { consulta_id, medicamento_id };
  } else {
    throw new Error('Unable to create relation in Pede');
  }
}

export default { create };
