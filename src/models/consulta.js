import prisma from '../database/database.js';

async function create({ consulta_id, data_consulta, observacao, medico_id, paciente_id }) {
  if (consulta_id && data_consulta && medico_id && paciente_id) {
    const createdConsulta = await prisma.consulta.create({
      data: {
        consulta_id,
        data_consulta,
        observacao,
        medico_id,
        paciente_id,
      },
    });

    return createdConsulta;
  } else {
    throw new Error('Campos obrigatórios ausentes para criar consulta');
  }
}

async function read(where) {
  // Caso a busca tenha um campo específico, aplica o filtro
  const consultas = await prisma.consulta.findMany({
    where: where || {},
  });

  // Se só houver uma consulta encontrada e tiver filtro, retorna um único objeto
  if (consultas.length === 1 && where) {
    return consultas[0];
  }

  return consultas;
}

async function readById(id) {
  if (id) {
    const consulta = await prisma.consulta.findUnique({
      where: { consulta_id: id },
    });

    if (!consulta) throw new Error('Consulta não encontrada');
    return consulta;
  } else {
    throw new Error('ID da consulta é obrigatório');
  }
}

async function update({ consulta_id, data_consulta, observacao, medico_id, paciente_id }) {
  if (consulta_id && data_consulta && medico_id && paciente_id) {
    const updatedConsulta = await prisma.consulta.update({
      where: { consulta_id },
      data: {
        data_consulta,
        observacao,
        medico_id,
        paciente_id,
      },
    });

    return updatedConsulta;
  } else {
    throw new Error('Dados incompletos para atualização da consulta');
  }
}

async function remove(consulta_id) {
  if (consulta_id) {
    await prisma.consulta.delete({
      where: { consulta_id },
    });

    return true;
  } else {
    throw new Error('ID da consulta é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };