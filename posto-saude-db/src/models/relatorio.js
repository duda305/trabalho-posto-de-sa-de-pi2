import Database from '../database/database.js';

async function create({ relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio }) {
  const db = await Database.connect();

  if (relatorio_id && usuario_id && tipo_relatorio) {
    const sql = `
      INSERT INTO Relatorio (relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio)
      VALUES (?, ?, ?, ?)
    `;

    await db.run(sql, [relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio]);
    return await readById(relatorio_id);
  } else {
    throw new Error('Campos obrigatórios ausentes para criar relatório');
  }
}

async function read(field, value) {
  const db = await Database.connect();

  if (field && value) {
    const sql = `SELECT * FROM Relatorio WHERE ${field} = ?`;
    return await db.all(sql, [value]);
  }

  const sql = `SELECT * FROM Relatorio`;
  return await db.all(sql);
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM Relatorio WHERE relatorio_id = ?`;
  const result = await db.get(sql, [id]);

  if (result) return result;

  throw new Error('Relatório não encontrado');
}

async function update({ relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio }) {
  const db = await Database.connect();

  if (relatorio_id && usuario_id && tipo_relatorio) {
    const sql = `
      UPDATE Relatorio
      SET usuario_id = ?, tipo_relatorio = ?, arquivo_relatorio = ?
      WHERE relatorio_id = ?
    `;

    const { changes } = await db.run(sql, [usuario_id, tipo_relatorio, arquivo_relatorio, relatorio_id]);

    if (changes === 1) return readById(relatorio_id);

    throw new Error('Relatório não encontrado para atualização');
  } else {
    throw new Error('Dados incompletos para atualização do relatório');
  }
}

async function remove(relatorio_id) {
  const db = await Database.connect();

  const sql = `DELETE FROM Relatorio WHERE relatorio_id = ?`;
  const { changes } = await db.run(sql, [relatorio_id]);

  if (changes === 1) return true;

  throw new Error('Relatório não encontrado para remoção');
}

export default { create, read, readById, update, remove };

