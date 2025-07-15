import Database from '../database/database.js';

async function create({ medicamento_id, nome, fabricante, data_validade }) {
  const db = await Database.connect();

  if (medicamento_id && nome && fabricante && data_validade) {
    const sql = `
      INSERT INTO Medicamento (medicamento_id, nome, fabricante, data_validade)
      VALUES (?, ?, ?, ?)
    `;
    await db.run(sql, [medicamento_id, nome, fabricante, data_validade]);
    return { medicamento_id, nome, fabricante, data_validade };
  } else {
    throw new Error('Unable to create Medicamento');
  }
}

export default { create };
