import prisma from '../database/database.js';

async function create({ medico_id, nome, CRM, disponibilidade, telefone }) {
  if (nome && CRM && disponibilidade && telefone) {
    const createdMedico = await prisma.medico.create({
      data: {
        medico_id,
        nome,
        CRM,
        disponibilidade,
        telefone,
      },
    });

    return createdMedico;
  } else {
    throw new Error('Campos obrigatórios ausentes para criar médico');
  }
}

async function read(where) {
  // Se passar um filtro, retorna os médicos correspondentes; senão, retorna todos
  const medicos = await prisma.medico.findMany({
    where: where || {},
  });

  if (medicos.length === 1 && where) {
    return medicos[0];
  }

  return medicos;
}

async function readById(medico_id) {
  if (medico_id) {
    const medico = await prisma.medico.findUnique({
      where: { medico_id },
    });

    if (!medico) throw new Error('Médico não encontrado');
    return medico;
  } else {
    throw new Error('ID do médico é obrigatório');
  }
}

async function update({ medico_id, nome, CRM, disponibilidade, telefone }) {
  if (medico_id && nome && CRM && disponibilidade && telefone) {
    const updatedMedico = await prisma.medico.update({
      where: { medico_id },
      data: {
        nome,
        CRM,
        disponibilidade,
        telefone,
      },
    });

    return updatedMedico;
  } else {
    throw new Error('Dados incompletos para atualização do médico');
  }
}

async function remove(medico_id) {
  if (medico_id) {
    await prisma.medico.delete({
      where: { medico_id },
    });

    return true;
  } else {
    throw new Error('ID do médico é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };
