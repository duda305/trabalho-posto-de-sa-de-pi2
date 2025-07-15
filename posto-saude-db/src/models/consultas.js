import Database from '../database/database.js';

async function create({ consulta_id, data_consulta, observacao, medico_id, paciente_id }) {
  const db = await Database.connect();

  if (consulta_id && data_consulta && medico_id && paciente_id) {
    const sql = `
      INSERT INTO Consulta (consulta_id, data_consulta, observacao, medico_id, paciente_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(sql, [consulta_id, data_consulta, observacao, medico_id, paciente_id]);
    return { consulta_id, data_consulta, observacao, medico_id, paciente_id };
  } else {
    throw new Error('Unable to create Consulta');
  }
}

export default { create };
