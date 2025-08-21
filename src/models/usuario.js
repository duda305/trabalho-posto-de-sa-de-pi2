import prisma from '../database/database.js';

async function create({ usuario_id, nome, email, senha, data_cadastro }) {
  if (nome && email && senha && data_cadastro) {
    const createdUsuario = await prisma.usuario.create({
      data: { usuario_id, nome, email, senha, data_cadastro },
    });

    return createdUsuario;
  } else {
    throw new Error('Unable to create usuario');
  }
}

async function read(where) {
  if (where?.nome) {
    where.nome = {
      contains: where.nome,
    };
  }

  const usuarios = await prisma.usuario.findMany({ where });

  if (usuarios.length === 1 && where) {
    return usuarios[0];
  }

  return usuarios;
}

async function readById(usuario_id) {
  if (usuario_id) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        usuario_id,
      },
    });

    return usuario;
  } else {
    throw new Error('Unable to find usuario');
  }
}

async function update({ usuario_id, nome, email, senha, data_cadastro }) {
  if (usuario_id && nome && email && senha && data_cadastro) {
    const updatedUsuario = await prisma.usuario.update({
      where: {
        usuario_id,
      },
      data: { nome, email, senha, data_cadastro },
    });

    return updatedUsuario;
  } else {
    throw new Error('Unable to update usuario');
  }
}

async function remove(usuario_id) {
  if (usuario_id) {
    await prisma.usuario.delete({
      where: {
        usuario_id,
      },
    });

    return true;
  } else {
    throw new Error('Unable to remove usuario');
  }
}

export default { create, read, readById, update, remove };