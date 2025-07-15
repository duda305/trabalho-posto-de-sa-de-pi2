import Database from '../database/database.js';

async function create({ relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio }) {
  const db = await Database.connect();

  if (relatorio_id && usuario_id && tipo_relatorio !== undefined) {
    const sql = `
      INSERT INTO Relatorio (relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio)
      VALUES (?, ?, ?, ?)
    `;
    await db.run(sql, [relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio]);
    return { relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio };
  } else {
    throw new Error('Unable to create Relatorio');
  }
}

export default { create };
