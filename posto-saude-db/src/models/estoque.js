import Database from '../database/database.js';

async function create({ estoque_id, medicamento_id, quantidade }) {
  const db = await Database.connect();

  if (estoque_id && medicamento_id && quantidade >= 0) {
    const sql = `
      INSERT INTO Estoque (estoque_id, medicamento_id, quantidade)
      VALUES (?, ?, ?)
    `;
    await db.run(sql, [estoque_id, medicamento_id, quantidade]);
    return { estoque_id, medicamento_id, quantidade };
  } else {
    throw new Error('Unable to create Estoque');
  }
}

export default { create };
