import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';

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
import medicoController from './controllers/medicoController.js';


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
// ----------------- USUÁRIOS -----------------

// Listar todos (protegido)
router.get('/usuarios', isAuthenticated, async (req, res, next) => {
  try {
    const usuarios = await usuario.read(req.query);
    res.json({ status: 200, usuarios });
  } catch (err) {
    next(err);
  }
});

// Obter meu perfil (protegido)
router.get('/usuarios/me', isAuthenticated, async (req, res, next) => {
  try {
    const user = await usuario.readById(req.userId);
    if (!user) return res.status(404).json({ status: 404, message: 'Usuário não encontrado' });
    res.json({ status: 200, usuario: user });
  } catch (err) {
    next(err);
  }
});

// Criar usuário (signup) + e-mail
router.post('/usuarios', validate(usuarioSchema), async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await usuario.readByEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ status: 409, message: 'Email já cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuario.create({ nome, email, senha: senhaCriptografada });

    // ENVIAR E-MAIL DE BOAS-VINDAS
    await emailService.createNewUser(novoUsuario.email);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({ status: 201, message: 'Usuário criado com sucesso!', usuario: usuarioSemSenha });
  } catch (err) {
    next(err);
  }
});

// Atualizar usuário (protegido)
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

// Deletar usuário (protegido)
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

// ----------------- MÉDICOS -----------------
router.get('/medicos', isAuthenticated, medicoController.listarMedicos);
router.post('/medicos', isAuthenticated, validate(medicoSchema), medicoController.criarMedico);
router.put('/medicos/:id', isAuthenticated, validate(medicoSchema), medicoController.atualizarMedico);
router.delete('/medicos/:id', isAuthenticated, medicoController.deletarMedico);

// ----------------- DELETAR MÉDICO -----------------
router.delete('/medicos/:id', isAuthenticated, async (req, res, next) => {
  try {
    const medico_id = Number(req.params.id);
    if (isNaN(medico_id)) {
      return res.status(400).json({ status: 400, message: 'ID inválido' });
    }

    // Buscar médico antes de deletar
    const medicoParaExcluir = await medico.readById(medico_id);
    if (!medicoParaExcluir) {
      return res.status(404).json({ status: 404, message: 'Médico não encontrado' });
    }

    // Deletar do banco
    await medico.remove(medico_id);

    // Enviar e-mail ao administrador
    await emailService.sendMedicoRemovidoEmail('admin@viver.com', medicoParaExcluir.nome);

    console.log(`🗑 Médico removido: ${medicoParaExcluir.nome}`);

    res.json({ status: 200, message: 'Médico excluído com sucesso e e-mail enviado!' });

  } catch (err) {
    next(err);
  }
});

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
