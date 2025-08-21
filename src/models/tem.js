import prisma from '../database/database.js';

async function create({ medico_id, especialidade_id }) {
  if (medico_id && especialidade_id) {
    const createdTem = await prisma.tem.create({
      data: { medico_id, especialidade_id },
    });

    return createdTem;
  } else {
    throw new Error('Unable to create Tem relation');
  }
}

async function read(where) {
  const relacoes = await prisma.tem.findMany({ where });

  if (relacoes.length === 1 && where) {
    return relacoes[0];
  }

  return relacoes;
}

async function readById({ medico_id, especialidade_id }) {
  if (medico_id && especialidade_id) {
    const tem = await prisma.tem.findUnique({
      where: {
        medico_id_especialidade_id: {
          medico_id,
          especialidade_id,
        },
      },
    });

    return tem;
  } else {
    throw new Error('Unable to find Tem relation');
  }
}

async function remove({ medico_id, especialidade_id }) {
  if (medico_id && especialidade_id) {
    await prisma.tem.delete({
      where: {
        medico_id_especialidade_id: {
          medico_id,
          especialidade_id,
        },
      },
    });

    return true;
  } else {
    throw new Error('Unable to remove Tem relation');
  }
}

export default { create, read, readById, remove };