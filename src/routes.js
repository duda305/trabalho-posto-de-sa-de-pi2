import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { upload } from "./config/multer.js";


import medico from './models/medico.js';
import usuario from './models/usuario.js';
import especialidade from './models/especialidade.js';
import paciente from './models/paciente.js';
import consulta from './models/consulta.js';
import medicamento from './models/medicamento.js';
import estoque from './models/estoque.js';
import relatorio from './models/relatorio.js';
import notificacao from './models/notificacao.js';

import { isAuthenticated } from './middleware/auth.js';
import { validate } from './middleware/validate.js';
import emailService from './services/emailService.js';
import medicoController from '../controllers/medicoController.js';

const router = express.Router();

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

const medicoSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    CRM: z.string().min(1, 'CRM é obrigatório'),
    disponibilidade: z.string().min(1, 'Disponibilidade é obrigatória'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
  }),
});

// ----------------- CONFIG MULTER PARA AVATAR -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/imgs/profile';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.userId}${ext}`);
  },
});
const upload = multer({ storage });

// ----------------- USUÁRIOS -----------------
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

    const usuarioExistente = await usuario.readByEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ status: 409, message: 'Email já cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuario.create({ nome, email, senha: senhaCriptografada });

    await emailService.createNewUser(novoUsuario.email);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({ status: 201, message: 'Usuário criado com sucesso!', usuario: usuarioSemSenha });
  } catch (err) {
    next(err);
  }
});

router.put('/usuarios/:id', isAuthenticated, validate(usuarioSchema), async (req, res, next) => {
  try {
    const usuario_id = Number(req.params.id);
    if (isNaN(usuario_id)) return res.status(400).json({ status: 400, message: 'ID inválido' });

    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioAtualizado = await usuario.update({ usuario_id, nome, email, senha: senhaCriptografada });
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    res.json({ status: 200, message: 'Usuário atualizado com sucesso!', usuario: usuarioSemSenha });
  } catch (err) {
    if (err.message === 'Email já cadastrado') {
      return res.status(409).json({ status: 409, message: err.message });
    }
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

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ status: 401, message: 'Senha incorreta' });

    const token = jwt.sign({ userId: user.usuario_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 200, auth: true, token });
  } catch (err) {
    next(err);
  }
});

// ----------------- AVATAR DO USUÁRIO -----------------
router.post('/usuarios/image', isAuthenticated, upload.single('image'), async (req, res, next) => {
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

router.put('/usuarios/image', isAuthenticated, upload.single('image'), async (req, res, next) => {
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

// ----------------- MÉDICOS -----------------
const storageMedicos = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/projeto/img';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const medicoId = req.params.id;
    const ext = path.extname(file.originalname);

    // nome final = foto_medicoID.png
    cb(null, `medico_${medicoId}${ext}`);
  }
});

const uploadMedico = multer({ storage: storageMedicos });

// ROTA PARA ALTERAR FOTO DO MÉDICO
router.put(
  "/medicos/:id/foto",
  isAuthenticated,
  uploadMedico.single("foto"),
  async (req, res) => {

    try {
      const medico_id = Number(req.params.id);

      if (isNaN(medico_id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma foto enviada" });
      }

      const fotoPath = `/projeto/img/${req.file.filename}`;

      const atualizado = await medico.updateFoto(medico_id, fotoPath);

      res.json({
        message: "Foto atualizada com sucesso!",
        medico: atualizado,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao enviar foto" });
    }
  }
);
// ----------------- TRATAMENTO DE ERROS -----------------
router.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    return res.status(err.statusCode).json({ status: err.statusCode, message: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ status: 400, message: 'Erro de validação', errors: err.errors });
  }

  console.error(err);
  res.status(500).json({ status: 500, message: 'Erro interno no servidor' });
});

export default router;
