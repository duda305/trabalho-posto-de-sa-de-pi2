import prisma from '../database/database.js';
import bcrypt from 'bcrypt';

async function create({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new HTTPError('Campos obrigatórios não preenchidos', 400);
  }

  // Verifica duplicidade antes
  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) {
    throw new HTTPError('Email já cadastrado', 409);
  }

  const hashedSenha = await bcrypt.hash(senha, 10);

  const createdUsuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hashedSenha,
    },
  });

  const { senha: _, ...usuarioSemSenha } = createdUsuario;
  return usuarioSemSenha;
}

async function read(where) {
  if (where?.nome) {
    where.nome = {
      contains: where.nome,
    };
  }

  const usuarios = await prisma.usuario.findMany({ where });
  return usuarios.map(({ senha, ...u }) => u);
}

async function readById(usuario_id) {
  if (!usuario_id) {
    throw new HTTPError('ID do usuário não fornecido', 400);
  }

  const usuario = await prisma.usuario.findUnique({
    where: { usuario_id },
  });

  if (!usuario) throw new HTTPError('Usuário não encontrado', 404);

  const { senha: _, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

async function readByEmail(email) {
  if (!email) throw new HTTPError('Email não fornecido', 400);

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    select: {
      usuario_id: true,
      nome: true,
      email: true,
      senha: true 
    }
  });

  return usuario || null;
}

async function update({ usuario_id, nome, email, senha }) {
  if (!usuario_id || !nome || !email || !senha) {
    throw new HTTPError('Campos obrigatórios não preenchidos para atualização', 400);
  }

  const hashedSenha = await bcrypt.hash(senha, 10);

  const updatedUsuario = await prisma.usuario.update({
    where: { usuario_id },
    data: {
      nome,
      email,
      senha: hashedSenha,
    },
  });

  const { senha: _, ...usuarioSemSenha } = updatedUsuario;
  return usuarioSemSenha;
}

async function remove(usuario_id) {
  if (!usuario_id) {
    throw new HTTPError('ID do usuário não fornecido para remoção', 400);
  }

  await prisma.usuario.delete({
    where: { usuario_id },
  });

  return true;
}

export default {
  create,
  read,
  readById,
  readByEmail,
  update,
  remove,
};
