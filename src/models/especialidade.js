import prisma from '../database/database.js';

async function create({ especialidade_id, nome }) {
  if (especialidade_id && nome) {
    const createdEspecialidade = await prisma.especialidade.create({
      data: {
        especialidade_id,
        nome,
      },
    });

    return createdEspecialidade;
  } else {
    throw new Error('Campos obrigatórios ausentes para criar especialidade');
  }
}

async function read(where) {
  // Se um filtro for passado, aplica o where, caso contrário busca tudo
  const especialidades = await prisma.especialidade.findMany({
    where: where || {},
  });

  // Se só encontrar uma especialidade e existir filtro, retorna um único objeto
  if (especialidades.length === 1 && where) {
    return especialidades[0];
  }

  return especialidades;
}

async function readById(id) {
  if (id) {
    const especialidade = await prisma.especialidade.findUnique({
      where: { especialidade_id: id },
    });

    if (!especialidade) throw new Error('Especialidade não encontrada');
    return especialidade;
  } else {
    throw new Error('ID da especialidade é obrigatório');
  }
}

async function update({ especialidade_id, nome }) {
  if (especialidade_id && nome) {
    const updatedEspecialidade = await prisma.especialidade.update({
      where: { especialidade_id },
      data: { nome },
    });

    return updatedEspecialidade;
  } else {
    throw new Error('Dados incompletos para atualização da especialidade');
  }
}

async function remove(especialidade_id) {
  if (especialidade_id) {
    await prisma.especialidade.delete({
      where: { especialidade_id },
    });

    return true;
  } else {
    throw new Error('ID da especialidade é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };
