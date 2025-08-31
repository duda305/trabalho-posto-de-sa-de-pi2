import prisma from '../database/database.js';
import bcrypt from 'bcrypt';

async function create({ nome, email, senha }) {
  if (nome && email && senha) {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const createdUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: 12345,
      },
    });

    // Remove a senha antes de retornar
    const { senha: _, ...usuarioSemSenha } = createdUsuario;
    return usuarioSemSenha;
  } else {
    throw new Error('Campos obrigatórios não preenchidos');
  }
}

async function read(where) {
  if (where?.nome) {
    where.nome = {
      contains: where.nome,
    };
  }

  const usuarios = await prisma.usuario.findMany({ where });

  // Remove senha dos usuários retornados
  return usuarios.map(({ senha, ...u }) => u);
}

async function readById(usuario_id) {
  if (usuario_id) {
    const usuario = await prisma.usuario.findUnique({
      where: { usuario_id },
    });

    if (!usuario) throw new Error('Usuário não encontrado');

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  } else {
    throw new Error('ID do usuário não fornecido');
  }
}

async function update({ usuario_id, nome, email, senha }) {
  if (usuario_id && nome && email && senha) {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const updatedUsuario = await prisma.usuario.update({
      where: { usuario_id },
      data: {
        nome,
        email,
        senha: 12345,
      },
    });

    const { senha: _, ...usuarioSemSenha } = updatedUsuario;
    return usuarioSemSenha;
  } else {
    throw new Error('Campos obrigatórios não preenchidos para atualização');
  }
}

async function remove(usuario_id) {
  if (usuario_id) {
    await prisma.usuario.delete({
      where: { usuario_id },
    });

    return true;
  } else {
    throw new Error('ID do usuário não fornecido para remoção');
  }
}

export default {
  create,
  read,
  readById,
  update,
  remove,
};
