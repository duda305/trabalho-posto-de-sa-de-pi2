import Database from '../database/database.js';

async function create({ usuario_id, nome, email, senha, data_cadastro }) {
  const db = await Database.connect();

  if (usuario_id && nome && email && senha && data_cadastro) {
    const sql = `
      INSERT INTO Usuario (usuario_id, nome, email, senha, data_cadastro)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(sql, [usuario_id, nome, email, senha, data_cadastro]);
    return { usuario_id, nome, email, senha, data_cadastro };
  } else {
    throw new Error('Unable to create Usuario');
  }
}

export default { create };
