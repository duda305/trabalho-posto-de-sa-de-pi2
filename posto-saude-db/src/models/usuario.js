import Database from '../database/database.js';

async function create({ usuario_id, nome, email, senha, data_cadastro }) {
  const db = await Database.connect();

  if (nome && email && senha && data_cadastro) {
    const sql = `
      INSERT INTO Usuario (usuario_id, nome, email, senha, data_cadastro)
      VALUES (?, ?, ?, ?, ?)
    `;

    const { lastID } = await db.run(sql, [usuario_id, nome, email, senha, data_cadastro]);
    return await readById(usuario_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar usuario');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Usuario WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Usuario`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Usuario WHERE usuario_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Usuário não encontrado');
}

async function update({ usuario_id, nome, email, senha, data_cadastro }) {
  const db = await Database.connect();

  if (nome && email && senha && data_cadastro && usuario_id) {
    const sql = `
      UPDATE Usuario
      SET nome = ?, email = ?, senha = ?, data_cadastro = ?
      WHERE usuario_id = ?
    `;

    const { changes } = await db.run(sql, [nome, email, senha, data_cadastro, usuario_id]);

    if (changes === 1) return readById(usuario_id);

    throw new Error('Usuário não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos para atualização do usuário');
  }
}

async function remove(usuario_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Usuario WHERE usuario_id = ?`;
  const { changes } = await db.run(sql, [usuario_id]);

  if (changes === 1) return true;

  throw new Error('Usuário não encontrado para remoção');
}

export default { create, read, readById, update, remove };

