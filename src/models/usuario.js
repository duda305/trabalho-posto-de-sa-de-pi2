import prisma from '../database/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT) || 10;

// Função para criar um usuário
async function create({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new Error('Campos obrigatórios não preenchidos');
  }

  // Verifica duplicidade de email
  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const hashedSenha = await bcrypt.hash(senha, SALT_ROUNDS);

  const createdUsuario = await prisma.usuario.create({
    data: { nome, email, senha: hashedSenha },
    include: {
      image: { select: { path: true } },
    },
  });

  // Remove a senha antes de retornar
  const { senha: _, ...usuarioSemSenha } = createdUsuario;
  return usuarioSemSenha;
}

// Função para listar usuários (com filtro opcional por nome/email)
async function read(where) {
  if (where?.nome) {
    where.nome = { contains: where.nome };
  }
  if (where?.email) {
    where.email = { contains: where.email };
  }

  const usuarios = await prisma.usuario.findMany({
    where,
    include: { image: { select: { path: true } } },
  });

  return usuarios.map(({ senha, ...u }) => u);
}

// Buscar usuário pelo ID
async function readById(usuario_id) {
  if (!usuario_id) {
    throw new Error('ID do usuário não fornecido');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { usuario_id },
    include: { image: { select: { path: true } } },
  });

  if (!usuario) throw new Error('Usuário não encontrado');

  const { senha: _, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

// Buscar usuário pelo email (útil para login)
async function readByEmail(email) {
  if (!email) throw new Error('Email não fornecido');

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { image: { select: { path: true } } },
  });

  return usuario || null;
}

// Atualizar usuário
async function update({ usuario_id, nome, email, senha }) {
  if (!usuario_id || !nome || !email || !senha) {
    throw new Error('Campos obrigatórios não preenchidos para atualização');
  }

  const hashedSenha = await bcrypt.hash(senha, SALT_ROUNDS);

  const updatedUsuario = await prisma.usuario.update({
    where: { usuario_id },
    data: { nome, email, senha: hashedSenha },
    include: { image: { select: { path: true } } },
  });

  const { senha: _, ...usuarioSemSenha } = updatedUsuario;
  return usuarioSemSenha;
}

// Remover usuário
async function remove(usuario_id) {
  if (!usuario_id) {
    throw new Error('ID do usuário não fornecido para remoção');
  }

  await prisma.usuario.delete({ where: { usuario_id } });
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
