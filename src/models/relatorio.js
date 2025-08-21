import prisma from '../database/database.js';

async function create({ relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio }) {
  if (relatorio_id && usuario_id && tipo_relatorio) {
    const createdRelatorio = await prisma.relatorio.create({
      data: { relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio },
    });

    return createdRelatorio;
  } else {
    throw new Error('Unable to create relatorio');
  }
}

async function read(where) {
  if (where?.tipo_relatorio) {
    where.tipo_relatorio = {
      contains: where.tipo_relatorio,
    };
  }

  const relatorios = await prisma.relatorio.findMany({ where });

  if (relatorios.length === 1 && where) {
    return relatorios[0];
  }

  return relatorios;
}

async function readById(relatorio_id) {
  if (relatorio_id) {
    const relatorio = await prisma.relatorio.findUnique({
      where: {
        relatorio_id,
      },
    });

    return relatorio;
  } else {
    throw new Error('Unable to find relatorio');
  }
}

async function update({ relatorio_id, usuario_id, tipo_relatorio, arquivo_relatorio }) {
  if (relatorio_id && usuario_id && tipo_relatorio) {
    const updatedRelatorio = await prisma.relatorio.update({
      where: {
        relatorio_id,
      },
      data: { usuario_id, tipo_relatorio, arquivo_relatorio },
    });

    return updatedRelatorio;
  } else {
    throw new Error('Unable to update relatorio');
  }
}

async function remove(relatorio_id) {
  if (relatorio_id) {
    await prisma.relatorio.delete({
      where: {
        relatorio_id,
      },
    });

    return true;
  } else {
    throw new Error('Unable to remove relatorio');
  }
}

export default { create, read, readById, update, remove };
