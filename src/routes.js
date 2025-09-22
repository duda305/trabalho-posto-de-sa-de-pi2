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

const router = express.Router();

class HTTPError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// --- Schemas ---

const medicoSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    CRM: z.string().min(1, 'CRM é obrigatório'),
  }),
});

const usuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
});

const especialidadeSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome da especialidade é obrigatório'),
  }),
});

const pacienteSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome do paciente é obrigatório'),
  }),
});

const consultaSchema = z.object({
  body: z.object({
    paciente_id: z.number().int().positive('ID do paciente inválido'),
    medico_id: z.number().int().positive('ID do médico inválido'),
    data_consulta: z.string().min(1, 'Data da consulta é obrigatória'),
  }),
});

const medicamentoSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome do medicamento é obrigatório'),
  }),
});

const estoqueSchema = z.object({
  body: z.object({
    medicamento_id: z.number().int().positive('ID do medicamento inválido'),
    quantidade: z.number().int().nonnegative('Quantidade deve ser >= 0'),
  }),
});

const relatorioSchema = z.object({
  body: z.object({
    usuario_id: z.number().int().positive('ID do usuário inválido'),
    tipo_relatorio: z.string().min(1, 'Tipo de relatório é obrigatório'),
  }),
});

const notificacaoSchema = z.object({
  body: z.object({
    usuario_id: z.number().int().positive('ID do usuário inválido'),
    mensagem: z.string().min(1, 'Mensagem é obrigatória'),
  }),
});

// --- MÉDICOS ---
router.get('/medicos', isAuthenticated, async (req, res, next) => {
  try {
    const medicos = await medico.read(req.query);
    res.json(medicos);
  } catch (err) {
    next(err);
  }
});

router.post('/medicos', isAuthenticated, validate(medicoSchema), async (req, res, next) => {
  try {
    const novoMedico = await medico.create(req.body);
    res.status(201).json({ message: 'Médico cadastrado com sucesso!', medico: novoMedico });
  } catch (err) {
    next(err);
  }
});

// --- USUÁRIOS ---
router.get('/usuarios', isAuthenticated, async (req, res, next) => {
  try {
    const usuarios = await usuario.read(req.query);
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
});

router.get('/usuarios/me', isAuthenticated, async (req, res, next) => {
  try {
    const user = await usuario.readById(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/usuarios', validate(usuarioSchema), async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    const novoUsuario = await usuario.create({ nome, email, senha });
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: usuarioSemSenha });
  } catch (err) {
    if (err.message === 'Email já cadastrado') {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
});

router.put('/usuarios/:id', isAuthenticated, validate(usuarioSchema), async (req, res, next) => {
  try {
    const usuario_id = Number(req.params.id);
    if (isNaN(usuario_id)) return res.status(400).json({ message: 'ID inválido' });

    const { nome, email, senha } = req.body;
    const usuarioAtualizado = await usuario.update({ usuario_id, nome, email, senha });
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    res.json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioSemSenha });
  } catch (err) {
    if (err.message === 'Email já cadastrado') {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
});

router.delete('/usuarios/:id', isAuthenticated, async (req, res, next) => {
  try {
    const usuario_id = Number(req.params.id);
    if (isNaN(usuario_id)) return res.status(400).json({ message: 'ID inválido' });

    await usuario.remove(usuario_id);
    res.json({ message: 'Usuário removido com sucesso!' });
  } catch (err) {
    next(err);
  }
});

// --- LOGIN ---
router.post('/signin', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await usuario.readByEmail(email);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    // const senhaValida = await bcrypt.compare(senha, user.senha);
    // if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    if (senha !== user.senha) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { userId: user.usuario_id || user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ auth: true, token });
  } catch (err) {
    next(err);
  }
});

// --- ESPECIALIDADES ---
router.get('/especialidades', isAuthenticated, async (req, res, next) => {
  try {
    const especialidades = await especialidade.read(req.query);
    res.json(especialidades);
  } catch (err) {
    next(err);
  }
});

router.post('/especialidades', isAuthenticated, validate(especialidadeSchema), async (req, res, next) => {
  try {
    const novaEspecialidade = await especialidade.create(req.body);
    res.status(201).json({ message: 'Especialidade criada com sucesso!', especialidade: novaEspecialidade });
  } catch (err) {
    next(err);
  }
});

// --- PACIENTES ---
router.get('/pacientes', isAuthenticated, async (req, res, next) => {
  try {
    const pacientes = await paciente.read(req.query);
    res.json(pacientes);
  } catch (err) {
    next(err);
  }
});

router.post('/pacientes', isAuthenticated, validate(pacienteSchema), async (req, res, next) => {
  try {
    const novoPaciente = await paciente.create(req.body);
    res.status(201).json({ message: 'Paciente criado com sucesso!', paciente: novoPaciente });
  } catch (err) {
    next(err);
  }
});

// --- CONSULTAS ---
router.get('/consultas', isAuthenticated, async (req, res, next) => {
  try {
    const consultas = await consulta.read(req.query);
    res.json(consultas);
  } catch (err) {
    next(err);
  }
});

router.post('/consultas', isAuthenticated, validate(consultaSchema), async (req, res, next) => {
  try {
    const dataConsulta = new Date(req.body.data_consulta);
    if (isNaN(dataConsulta)) throw new HTTPError('Data da consulta inválida', 400);

    const novaConsulta = await consulta.create({
      paciente_id: req.body.paciente_id,
      medico_id: req.body.medico_id,
      data_consulta: dataConsulta,
    });

    res.status(201).json({ message: 'Consulta criada com sucesso!', consulta: novaConsulta });
  } catch (err) {
    next(err);
  }
});

// --- MEDICAMENTOS ---
router.get('/medicamentos', isAuthenticated, async (req, res, next) => {
  try {
    const medicamentos = await medicamento.read(req.query);
    res.json(medicamentos);
  } catch (err) {
    next(err);
  }
});

router.post('/medicamentos', isAuthenticated, validate(medicamentoSchema), async (req, res, next) => {
  try {
    const novoMedicamento = await medicamento.create(req.body);
    res.status(201).json({ message: 'Medicamento criado com sucesso!', medicamento: novoMedicamento });
  } catch (err) {
    next(err);
  }
});

// --- ESTOQUE ---
router.get('/estoque', isAuthenticated, async (req, res, next) => {
  try {
    const estoqueList = await estoque.read(req.query);
    res.json(estoqueList);
  } catch (err) {
    next(err);
  }
});

router.post('/estoque', isAuthenticated, validate(estoqueSchema), async (req, res, next) => {
  try {
    const novoEstoque = await estoque.create(req.body);
    res.status(201).json({ message: 'Estoque atualizado com sucesso!', estoque: novoEstoque });
  } catch (err) {
    next(err);
  }
});

// --- RELATÓRIOS ---
router.get('/relatorios', isAuthenticated, async (req, res, next) => {
  try {
    const relatorios = await relatorio.read(req.query);
    res.json(relatorios);
  } catch (err) {
    next(err);
  }
});

router.post('/relatorios', isAuthenticated, validate(relatorioSchema), async (req, res, next) => {
  try {
    const novoRelatorio = await relatorio.create(req.body);
    res.status(201).json({ message: 'Relatório criado com sucesso!', relatorio: novoRelatorio });
  } catch (err) {
    next(err);
  }
});

// --- NOTIFICAÇÕES ---
router.get('/notificacoes', isAuthenticated, async (req, res, next) => {
  try {
    const notificacoes = await notificacao.read(req.query);
    res.json(notificacoes);
  } catch (err) {
    next(err);
  }
});

router.post('/notificacoes', isAuthenticated, validate(notificacaoSchema), async (req, res, next) => {
  try {
    const novaNotificacao = await notificacao.create(req.body);
    res.status(201).json({ message: 'Notificação criada com sucesso!', notificacao: novaNotificacao });
  } catch (err) {
    next(err);
  }
});

// --- Tratamento de erros genérico ---
router.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ message: 'Erro de validação', errors: err.errors });
  }

  if (err.message === 'Email já cadastrado') {
    return res.status(409).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno no servidor' });
});

export default router;
