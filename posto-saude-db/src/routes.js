import express from 'express';

import Usuario from '../models/Usuario.js';
import Medico from '../models/Medico.js';
import Especialidade from '../models/Especialidade.js';
import Tem from '../models/Tem.js';
import Paciente from '../models/Paciente.js';
import Consulta from '../models/Consulta.js';
import Medicamento from '../models/Medicamento.js';
import Pede from '../models/Pede.js';
import Estoque from '../models/Estoque.js';
import Relatorio from '../models/Relatorio.js';
import Notificacoes from '../models/Notificacoes.js';

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

router.post('/usuarios', async (req, res) => {
  try {
    const usuario = req.body;
    const created = await Usuario.create(usuario);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar usuario', 400);
  }
});

router.post('/medicos', async (req, res) => {
  try {
    const medico = req.body;
    const created = await Medico.create(medico);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar medico', 400);
  }
});

router.post('/especialidades', async (req, res) => {
  try {
    const especialidade = req.body;
    const created = await Especialidade.create(especialidade);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar especialidade', 400);
  }
});

router.post('/tem', async (req, res) => {
  try {
    const tem = req.body;
    const created = await Tem.create(tem);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao associar especialidade ao medico', 400);
  }
});

router.post('/pacientes', async (req, res) => {
  try {
    const paciente = req.body;
    const created = await Paciente.create(paciente);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar paciente', 400);
  }
});

router.post('/consultas', async (req, res) => {
  try {
    const consulta = req.body;
    const created = await Consulta.create(consulta);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar consulta', 400);
  }
});

router.post('/medicamentos', async (req, res) => {
  try {
    const medicamento = req.body;
    const created = await Medicamento.create(medicamento);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar medicamento', 400);
  }
});

router.post('/pede', async (req, res) => {
  try {
    const pede = req.body;
    const created = await Pede.create(pede);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao vincular medicamento à consulta', 400);
  }
});

router.post('/estoque', async (req, res) => {
  try {
    const estoque = req.body;
    const created = await Estoque.create(estoque);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar estoque', 400);
  }
});

router.post('/relatorios', async (req, res) => {
  try {
    const relatorio = req.body;
    const created = await Relatorio.create(relatorio);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar relatorio', 400);
  }
});

router.post('/notificacoes', async (req, res) => {
  try {
    const notificacao = req.body;
    const created = await Notificacoes.create(notificacao);
    return res.status(201).json(created);
  } catch (error) {
    throw new HTTPError('Erro ao criar notificacao', 400);
  }
});

// 404 handler
router.use((req, res) => {
  return res.status(404).json({ message: 'Rota não encontrada.' });
});

// Error handler
router.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    return res.status(err.code).json({ message: err.message });
  } else {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;
