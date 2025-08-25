import express from 'express';

import Usuario from './models/usuario.js';
import Medico from './models/medico.js';
import Especialidade from './models/especialidade.js';
import Tem from './models/tem.js';
import Paciente from './models/paciente.js';
import Consulta from './models/consulta.js';
import Medicamento from './models/medicamento.js';
import Pede from './models/pede.js';
import Estoque from './models/estoque.js';
import Relatorio from './models/relatorio.js';
import Notificacoes from './models/notificacoes.js';

const router = express.Router();

class HTTPError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// Rotas GET
router.get('/medicos', async (req, res) => {
  const data = await Medico.read();
  res.json(data);
});

router.get('/usuarios', async (req, res) => {
  const data = await Usuario.read();
  res.json(data);
});

router.get('/especialidades', async (req, res) => {
  const data = await Especialidade.read();
  res.json(data);
});

router.get('/pacientes', async (req, res) => {
  const data = await Paciente.read();
  res.json(data);
});

router.get('/consultas', async (req, res) => {
  const data = await Consulta.read();
  res.json(data);
});

router.get('/medicamentos', async (req, res) => {
  const data = await Medicamento.read();
  res.json(data);
});

router.get('/estoque', async (req, res) => {
  const data = await Estoque.read();
  res.json(data);
});

router.get('/relatorios', async (req, res) => {
  const data = await Relatorio.read();
  res.json(data);
});

router.get('/notificacoes', async (req, res) => {
  const data = await Notificacoes.read();
  res.json(data);
});

router.get('/pede', async (req, res) => {
  const data = await Pede.read();
  res.json(data);
});

router.get('/tem', async (req, res) => {
  const data = await Tem.read();
  res.json(data);
});

// Rotas POST
router.post('/usuarios', async (req, res) => {
  try {
    const usuario = req.body;
    const created = await Usuario.create(usuario);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar usuario' });
  }
});

router.post('/medicos', async (req, res) => {
  try {
    const medico = req.body;
    const created = await Medico.create(medico);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar medico' });
  }
});

router.post('/especialidades', async (req, res) => {
  try {
    const especialidade = req.body;
    const created = await Especialidade.create(especialidade);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar especialidade' });
  }
});

router.post('/tem', async (req, res) => {
  try {
    const tem = req.body;
    const created = await Tem.create(tem);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao associar especialidade ao medico' });
  }
});

router.post('/pacientes', async (req, res) => {
  try {
    const paciente = req.body;
    const created = await Paciente.create(paciente);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar paciente' });
  }
});

router.post('/consultas', async (req, res) => {
  try {
    const consulta = req.body;
    const created = await Consulta.create(consulta);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar consulta' });
  }
});

router.post('/medicamentos', async (req, res) => {
  try {
    const medicamento = req.body;
    const created = await Medicamento.create(medicamento);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar medicamento' });
  }
});

router.post('/pede', async (req, res) => {
  try {
    const pede = req.body;
    const created = await Pede.create(pede);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao vincular medicamento à consulta' });
  }
});

router.post('/estoque', async (req, res) => {
  try {
    const estoque = req.body;
    const created = await Estoque.create(estoque);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar estoque' });
  }
});

router.post('/relatorios', async (req, res) => {
  try {
    const relatorio = req.body;
    const created = await Relatorio.create(relatorio);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar relatorio' });
  }
});

router.post('/notificacoes', async (req, res) => {
  try {
    const notificacao = req.body;
    const created = await Notificacoes.create(notificacao);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar notificacao' });
  }
});

// Middleware para rota não encontrada (404)
router.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Middleware para tratamento de erros
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

export default router;