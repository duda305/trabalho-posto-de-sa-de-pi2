import prisma from '../database/database.js';

async function create({ estoque_id, medicamento_id, quantidade }) {
  if (estoque_id && medicamento_id && quantidade >= 0) {
    const createdEstoque = await prisma.estoque.create({
      data: {
        estoque_id,
        medicamento_id,
        quantidade,
      },
    });

    return createdEstoque;
  } else {
    throw new Error('Campos obrigatórios ausentes ou inválidos para criar estoque');
  }
}

async function read(where) {
  // Se um filtro for passado, aplica o where; caso contrário, busca todos os registros
  const estoques = await prisma.estoque.findMany({
    where: where || {},
  });

  // Se só encontrar um e houver filtro, retorna apenas um objeto
  if (estoques.length === 1 && where) {
    return estoques[0];
  }

  return estoques;
}

async function readById(estoque_id) {
  if (estoque_id) {
    const estoque = await prisma.estoque.findUnique({
      where: { estoque_id },
    });

    if (!estoque) throw new Error('Registro de estoque não encontrado');
    return estoque;
  } else {
    throw new Error('ID do estoque é obrigatório');
  }
}

async function update({ estoque_id, medicamento_id, quantidade }) {
  if (estoque_id && medicamento_id && quantidade >= 0) {
    const updatedEstoque = await prisma.estoque.update({
      where: { estoque_id },
      data: {
        medicamento_id,
        quantidade,
      },
    });

    return updatedEstoque;
  } else {
    throw new Error('Dados incompletos ou inválidos para atualização do estoque');
  }
}

async function remove(estoque_id) {
  if (estoque_id) {
    await prisma.estoque.delete({
      where: { estoque_id },
    });

    return true;
  } else {
    throw new Error('ID do estoque é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };

