import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { isAuthenticated } from './middleware/auth.js';

import medico from './models/medico.js';
import usuario from './models/usuario.js';
import especialidade from './models/especialidade.js';
import paciente from './models/paciente.js';
import consulta from './models/consulta.js';
import medicamento from './models/medicamento.js';
import estoque from './models/estoque.js';
import relatorio from './models/relatorio.js';
import notificacao from './models/notificacao.js';

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

// --- MÉDICOS ---
// Listar médicos
router.get('/medicos', isAuthenticated, async (req, res, next) => {
  try {
    const medicos = await medico.read(req.query);
    res.json(medicos);
  } catch (error) {
    next(error);
  }
});

// Criar médico
router.post('/medicos', isAuthenticated, async (req, res, next) => {
  try {
    const medicoData = req.body;

    if (!medicoData.nome || !medicoData.CRM) {
      throw new HTTPError('Nome e CRM são obrigatórios', 400);
    }

    const novoMedico = await medico.create(medicoData);

    res.status(201).json({ message: 'Médico cadastrado com sucesso!', medico: novoMedico });
  } catch (error) {
    next(error);
  }
});

// --- USUÁRIOS ---
// Listar usuários (somente para admins, talvez)
router.get('/usuarios', isAuthenticated, async (req, res, next) => {
  try {
    const usuarios = await usuario.read(req.query);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

// Criar usuário (cadastro)
router.post('/usuarios', async (req, res, next) => {
  try {
    const userData = req.body;

    if (!userData.nome || !userData.email || !userData.senha) {
      throw new HTTPError('Nome, email e senha são obrigatórios', 400);
    }

    // Aqui, idealmente, você hash a senha antes de salvar
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    userData.senha = hashedPassword;

    const novoUsuario = await usuario.create(userData);

    delete novoUsuario.senha;

    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    next(error);
  }
});

// Obter dados do usuário logado
router.get('/usuarios/me', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await usuario.readById(userId);

    if (!user) throw new HTTPError('Usuário não encontrado', 404);

    delete user.senha;

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// --- LOGIN ---
router.post('/signin', async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) throw new HTTPError('Email e senha são obrigatórios', 400);

    const user = await usuario.read({ email });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ auth: true, token });
  } catch (error) {
    next(error);
  }
});

// --- ESPECIALIDADES ---
router.get('/especialidades', isAuthenticated, async (req, res, next) => {
  try {
    const especialidades = await especialidade.read(req.query);
    res.json(especialidades);
  } catch (error) {
    next(error);
  }
});

router.post('/especialidades', isAuthenticated, async (req, res, next) => {
  try {
    const especialidadeData = req.body;

    if (!especialidadeData.nome) {
      throw new HTTPError('Nome da especialidade é obrigatório', 400);
    }

    const novaEspecialidade = await especialidade.create(especialidadeData);

    res.status(201).json({ message: 'Especialidade criada com sucesso!', especialidade: novaEspecialidade });
  } catch (error) {
    next(error);
  }
});

// --- PACIENTES ---
router.get('/pacientes', isAuthenticated, async (req, res, next) => {
  try {
    const pacientes = await paciente.read(req.query);
    res.json(pacientes);
  } catch (error) {
    next(error);
  }
});

router.post('/pacientes', isAuthenticated, async (req, res, next) => {
  try {
    const pacienteData = req.body;

    if (!pacienteData.nome) {
      throw new HTTPError('Nome do paciente é obrigatório', 400);
    }

    const novoPaciente = await paciente.create(pacienteData);

    res.status(201).json({ message: 'Paciente criado com sucesso!', paciente: novoPaciente });
  } catch (error) {
    next(error);
  }
});

// --- CONSULTAS ---
router.get('/consultas', isAuthenticated, async (req, res, next) => {
  try {
    const consultas = await consulta.read(req.query);
    res.json(consultas);
  } catch (error) {
    next(error);
  }
});

router.post('/consultas', isAuthenticated, async (req, res, next) => {
  try {
    const consultaData = req.body;

    if (!consultaData.paciente_id || !consultaData.medico_id || !consultaData.data_consulta) {
      throw new HTTPError('Paciente, médico e data da consulta são obrigatórios', 400);
    }

    consultaData.data_consulta = new Date(consultaData.data_consulta);

    const novaConsulta = await consulta.create(consultaData);

    res.status(201).json({ message: 'Consulta criada com sucesso!', consulta: novaConsulta });
  } catch (error) {
    next(error);
  }
});

// --- MEDICAMENTOS ---
router.get('/medicamentos', isAuthenticated, async (req, res, next) => {
  try {
    const medicamentos = await medicamento.read(req.query);
    res.json(medicamentos);
  } catch (error) {
    next(error);
  }
});

router.post('/medicamentos', isAuthenticated, async (req, res, next) => {
  try {
    const medicamentoData = req.body;

    if (!medicamentoData.nome) {
      throw new HTTPError('Nome do medicamento é obrigatório', 400);
    }

    const novoMedicamento = await medicamento.create(medicamentoData);

    res.status(201).json({ message: 'Medicamento criado com sucesso!', medicamento: novoMedicamento });
  } catch (error) {
    next(error);
  }
});

// --- ESTOQUE ---
router.get('/estoque', isAuthenticated, async (req, res, next) => {
  try {
    const estoqueDados = await estoque.read(req.query);
    res.json(estoqueDados);
  } catch (error) {
    next(error);
  }
});

router.post('/estoque', isAuthenticated, async (req, res, next) => {
  try {
    const estoqueData = req.body;

    if (!estoqueData.medicamento_id || estoqueData.quantidade == null) {
      throw new HTTPError('Medicamento e quantidade são obrigatórios', 400);
    }

    const novoEstoque = await estoque.create(estoqueData);

    res.status(201).json({ message: 'Estoque atualizado com sucesso!', estoque: novoEstoque });
  } catch (error) {
    next(error);
  }
});

// --- RELATÓRIOS ---
router.get('/relatorios', isAuthenticated, async (req, res, next) => {
  try {
    const relatoriosDados = await relatorio.read(req.query);
    res.json(relatoriosDados);
  } catch (error) {
    next(error);
  }
});

router.post('/relatorios', isAuthenticated, async (req, res, next) => {
  try {
    const relatorioData = req.body;

    if (!relatorioData.usuario_id || !relatorioData.tipo_relatorio) {
      throw new HTTPError('Usuário e tipo de relatório são obrigatórios', 400);
    }

    const novoRelatorio = await relatorio.create(relatorioData);

    res.status(201).json({ message: 'Relatório criado com sucesso!', relatorio: novoRelatorio });
  } catch (error) {
    next(error);
  }
});

// --- NOTIFICAÇÕES ---
router.get('/notificacoes', isAuthenticated, async (req, res, next) => {
  try {
    const notificacoesDados = await notificacao.read(req.query);
    res.json(notificacoesDados);
  } catch (error) {
    next(error);
  }
});

router.post('/notificacoes', isAuthenticated, async (req, res, next) => {
  try {
    const notificacaoData = req.body;

    if (!notificacaoData.usuario_id || !notificacaoData.mensagem) {
      throw new HTTPError('Usuário e mensagem são obrigatórios', 400);
    }

    const novaNotificacao = await notificacao.create(notificacaoData);

    res.status(201).json({ message: 'Notificação criada com sucesso!', notificacao: novaNotificacao });
  } catch (error) {
    next(error);
  }
});

// --- 404 handler ---
router.use((req, res) => {
  res.status(404).json({ message: 'Content not found!' });
});

// --- Error handler middleware ---
router.use((error, req, res, next) => {
  if (error instanceof HTTPError) {
    res.status(error.code).json({ message: error.message });
  } else {
    console.error(error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
