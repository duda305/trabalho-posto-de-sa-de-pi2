import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from './generated/prisma/client.js';
import usuario from './models/usuario.js';
import medico from './models/medico.js';
import { isAuthenticated } from './middleware/auth.js';
import { validate } from './middleware/validate.js';
import emailService from './services/emailService.js';

const prisma = new PrismaClient();
const router = express.Router();

// ----------------- ERRO PERSONALIZADO -----------------
class HTTPError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ----------------- SCHEMAS -----------------
const usuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(3, 'Senha deve ter no mínimo 3 caracteres'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(3, 'Senha deve ter no mínimo 3 caracteres'),
  }),
});

// ----------------- MULTER PARA AVATAR -----------------
const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/imgs/profile';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.userId}${ext}`);
  },
});
const uploadAvatar = multer({ storage: storageAvatar });

// ----------------- MULTER PARA FOTO MÉDICO -----------------
const storageMedico = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/projeto/img';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const medicoId = req.params.id;
    const ext = path.extname(file.originalname);
    cb(null, `medico_${medicoId}${ext}`);
  },
});
const uploadMedico = multer({ storage: storageMedico });

// ----------------- ROTAS USUÁRIO -----------------
router.get('/usuarios', isAuthenticated, async (req, res, next) => {
  try {
    const usuarios = await usuario.read(req.query);
    res.json({ status: 200, usuarios });
  } catch (err) {
    next(err);
  }
});

router.get('/usuarios/me', isAuthenticated, async (req, res, next) => {
  try {
    const user = await usuario.readById(req.userId);
    if (!user) return res.status(404).json({ status: 404, message: 'Usuário não encontrado' });
    res.json({ status: 200, usuario: user });
  } catch (err) {
    next(err);
  }
});

router.post('/usuarios', validate(usuarioSchema), async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    const existingUser = await usuario.readByEmail(email);
    if (existingUser) return res.status(409).json({ status: 409, message: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await usuario.create({ nome, email, senha: hashedPassword });

  

    const { senha: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ status: 201, message: 'Usuário criado com sucesso!', usuario: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

router.put('/usuarios/:id', isAuthenticated, validate(usuarioSchema), async (req, res, next) => {
  try {
    const usuario_id = Number(req.params.id);
    if (isNaN(usuario_id)) return res.status(400).json({ status: 400, message: 'ID inválido' });

    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    const updatedUser = await usuario.update({ usuario_id, nome, email, senha: hashedPassword });
    const { senha: _, ...userWithoutPassword } = updatedUser;

    res.json({ status: 200, message: 'Usuário atualizado com sucesso!', usuario: userWithoutPassword });
  } catch (err) {
    if (err.message === 'Email já cadastrado') return res.status(409).json({ status: 409, message: err.message });
    next(err);
  }
});

router.delete('/usuarios/:id', isAuthenticated, async (req, res, next) => {
  try {
    const usuario_id = Number(req.params.id);
    if (isNaN(usuario_id)) return res.status(400).json({ status: 400, message: 'ID inválido' });

    await usuario.remove(usuario_id);
    res.json({ status: 200, message: 'Usuário removido com sucesso!' });
  } catch (err) {
    next(err);
  }
});

// ----------------- LOGIN -----------------
router.post('/signin', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await usuario.readByEmail(email);

    if (!user) return res.status(401).json({ status: 401, message: 'Usuário não encontrado' });

    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) return res.status(401).json({ status: 401, message: 'Senha incorreta' });

    const token = jwt.sign({ userId: user.usuario_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { senha: _, ...userWithoutPassword } = user;

    res.json({ status: 200, token, usuario: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

// ----------------- AVATAR -----------------
router.post('/usuarios/image', isAuthenticated, uploadAvatar.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ status: 400, message: 'Arquivo não enviado' });

    const pathDB = `/imgs/profile/${req.file.filename}`;
    const existingImage = await prisma.image.findUnique({ where: { usuarioId: req.userId } });

    if (existingImage) {
      return res.status(409).json({ status: 409, message: 'Usuário já possui avatar. Use PUT para atualizar.' });
    }

    const newImage = await prisma.image.create({ data: { usuarioId: req.userId, path: pathDB } });
    res.status(201).json({ status: 201, message: 'Avatar criado com sucesso', image: newImage });
  } catch (err) {
    next(err);
  }
});

router.put('/usuarios/image', isAuthenticated, uploadAvatar.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ status: 400, message: 'Arquivo não enviado' });

    const pathDB = `/imgs/profile/${req.file.filename}`;
    const updatedImage = await prisma.image.upsert({
      where: { usuarioId: req.userId },
      update: { path: pathDB },
      create: { usuarioId: req.userId, path: pathDB },
    });

    res.json({ status: 200, message: 'Avatar atualizado com sucesso', image: updatedImage });
  } catch (err) {
    next(err);
  }
});

// ----------------- MÉDICO -----------------
router.put('/medicos/:id/foto', isAuthenticated, uploadMedico.single('foto'), async (req, res) => {
  try {
    const medico_id = Number(req.params.id);
    if (isNaN(medico_id)) return res.status(400).json({ status: 400, message: 'ID inválido' });

    if (!req.file) return res.status(400).json({ status: 400, message: 'Nenhuma foto enviada' });

    const fotoPath = `/projeto/img/${req.file.filename}`;
    const updatedMedico = await medico.updateFoto(medico_id, fotoPath);

    res.json({ status: 200, message: 'Foto atualizada com sucesso!', medico: updatedMedico });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Erro ao enviar foto' });
  }
});

// ----------------- TRATAMENTO DE ERROS -----------------
router.use((err, req, res,) => {
  if (err instanceof HTTPError) return res.status(err.statusCode).json({ status: err.statusCode, message: err.message });
  if (err.name === 'ZodError') return res.status(400).json({ status: 400, message: 'Erro de validação', errors: err.errors });

  console.error(err);
  res.status(500).json({ status: 500, message: 'Erro interno no servidor' });
});

export default router;
