import prisma from '../database/database.js';

async function create({ consulta_id, medicamento_id }) {
  if (consulta_id && medicamento_id) {
    const createdPede = await prisma.pede.create({
      data: { consulta_id, medicamento_id },
    });

    return createdPede;
  } else {
    throw new Error('Unable to create Pede relation');
  }
}

async function read(where) {
  const pedes = await prisma.pede.findMany({ where });

  if (pedes.length === 1 && where) {
    return pedes[0];
  }

  return pedes;
}

async function readById({ consulta_id, medicamento_id }) {
  if (consulta_id && medicamento_id) {
    const pede = await prisma.pede.findUnique({
      where: {
        consulta_id_medicamento_id: {
          consulta_id,
          medicamento_id,
        },
      },
    });

    return pede;
  } else {
    throw new Error('Unable to find Pede relation');
  }
}

async function remove({ consulta_id, medicamento_id }) {
  if (consulta_id && medicamento_id) {
    await prisma.pede.delete({
      where: {
        consulta_id_medicamento_id: {
          consulta_id,
          medicamento_id,
        },
      },
    });

    return true;
  } else {
    throw new Error('Unable to remove Pede relation');
  }
}

export default { create, read, readById, remove };
