import express from 'express';
import { PrismaClient } from '../generated/prisma/client.js';

import medico from './models/medico.js';
import usuario from './models/usuario.js';          // <-- seu model com bcrypt
import especialidade from './models/especialidade.js';
import tem from './models/tem.js';
import paciente from './models/paciente.js';
import consulta from './models/consulta.js';
import pede from './models/pede.js';
import medicamento from './models/medicamento.js';
import estoque from './models/estoque.js';
import relatorio from './models/relatorio.js';
import notificacao from './models/notificacao.js';

const router = express.Router();
const prisma = new PrismaClient();

// --- Rotas dos Médicos ---
router.get('/medicos', async (req, res) => {
  try {
    const medicos = await prisma.medico.findMany({
      include: { 
        especialidades: {
          include: { especialidade: true }
        }
      }
    });
    res.json(medicos);
  } catch (error) {
    console.error('Erro na rota /medicos:', error);
    res.status(500).json({ error: 'Erro ao buscar médicos' });
  }
});

router.post('/medicos', async (req, res) => {
  const { nome, CRM, disponibilidade, telefone, especialidadeIds } = req.body;

  if (!nome || !CRM || !especialidadeIds || !Array.isArray(especialidadeIds) || especialidadeIds.length === 0) {
    return res.status(400).json({ error: 'Nome, CRM e pelo menos uma especialidade são obrigatórios' });
  }

  try {
    const novoMedico = await prisma.medico.create({
      data: {
        nome,
        CRM,
        disponibilidade,
        telefone,
        especialidades: {
          create: especialidadeIds.map(id => ({
            especialidade_id: id
          }))
        }
      },
      include: {
        especialidades: {
          include: { especialidade: true }
        }
      }
    });
    res.status(201).json({ message: 'Médico cadastrado com sucesso!', medico: novoMedico });
  } catch (error) {
    console.error('Erro ao cadastrar médico:', error);
    res.status(500).json({ error: 'Erro ao cadastrar médico' });
  }
});

// --- Rotas dos Usuários ---
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await usuario.read(req.query);
    res.json(usuarios);
  } catch (error) {
    console.error('Erro na rota GET /usuarios:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoUsuario = await usuario.create({ nome, email, senha });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: error.message || 'Erro ao cadastrar usuário' });
  }
});

// --- Rotas das Especialidades ---
router.get('/especialidades', async (req, res) => {
  try {
    const especialidades = await prisma.especialidade.findMany();
    res.json(especialidades);
  } catch (error) {
    console.error('Erro na rota /especialidades:', error);
    res.status(500).json({ error: 'Erro ao buscar especialidades' });
  }
});

router.post('/especialidades', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome da especialidade é obrigatório' });

  try {
    const novaEspecialidade = await prisma.especialidade.create({
      data: { nome }
    });
    res.status(201).json({ message: 'Especialidade cadastrada com sucesso!', especialidade: novaEspecialidade });
  } catch (error) {
    console.error('Erro ao cadastrar especialidade:', error);
    res.status(500).json({ error: 'Erro ao cadastrar especialidade' });
  }
});

// --- Rotas dos Pacientes ---
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    console.error('Erro na rota /pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

router.post('/pacientes', async (req, res) => {
  const { nome, telefone, bairro, cidade, endereco, CEP } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  try {
    const novoPaciente = await prisma.paciente.create({
      data: { nome, telefone, bairro, cidade, endereco, CEP }
    });
    res.status(201).json({ message: 'Paciente cadastrado com sucesso!', paciente: novoPaciente });
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar paciente' });
  }
});

// --- Rotas das Consultas ---
router.get('/consultas', async (req, res) => {
  try {
    const consultas = await prisma.consulta.findMany({
      include: {
        paciente: true,
        medico: true,
        medicamentos: {
          include: { medicamento: true }
        }
      }
    });
    res.json(consultas);
  } catch (error) {
    console.error('Erro na rota /consultas:', error);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});

router.post('/consultas', async (req, res) => {
  const { paciente_id, medico_id, data_consulta, observacao, medicamentoIds } = req.body;
  
  if (!paciente_id || !medico_id || !data_consulta) {
    return res.status(400).json({ error: 'Paciente, médico e data da consulta são obrigatórios' });
  }

  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        paciente_id,
        medico_id,
        data_consulta: new Date(data_consulta),
        observacao,
        medicamentos: medicamentoIds && medicamentoIds.length > 0 ? {
          create: medicamentoIds.map(id => ({
            medicamento_id: id
          }))
        } : undefined
      },
      include: {
        paciente: true,
        medico: true,
        medicamentos: { include: { medicamento: true } }
      }
    });
    res.status(201).json({ message: 'Consulta cadastrada com sucesso!', consulta: novaConsulta });
  } catch (error) {
    console.error('Erro ao cadastrar consulta:', error);
    res.status(500).json({ error: 'Erro ao cadastrar consulta' });
  }
});

// --- Rotas dos Medicamentos ---
router.get('/medicamentos', async (req, res) => {
  try {
    const medicamentos = await prisma.medicamento.findMany();
    res.json(medicamentos);
  } catch (error) {
    console.error('Erro na rota /medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

router.post('/medicamentos', async (req, res) => {
  const { nome, fabricante, data_validade } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome do medicamento é obrigatório' });
  }
  try {
    const novoMedicamento = await prisma.medicamento.create({
      data: {
        nome,
        fabricante,
        data_validade: data_validade ? new Date(data_validade) : null,
      }
    });
    res.status(201).json({ message: 'Medicamento cadastrado com sucesso!', medicamento: novoMedicamento });
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
  }
});

// --- Rotas do Estoque ---
router.get('/estoque', async (req, res) => {
  try {
    const estoque = await prisma.estoque.findMany({
      include: { medicamento: true }
    });
    res.json(estoque);
  } catch (error) {
    console.error('Erro na rota /estoque:', error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

router.post('/estoque', async (req, res) => {
  const { medicamento_id, quantidade } = req.body;
  if (!medicamento_id || quantidade == null) {
    return res.status(400).json({ error: 'Medicamento e quantidade são obrigatórios' });
  }
  try {
    const estoqueExistente = await prisma.estoque.findUnique({
      where: { medicamento_id }
    });

    let estoqueAtualizado;

    if (estoqueExistente) {
      estoqueAtualizado = await prisma.estoque.update({
        where: { medicamento_id },
        data: { quantidade }
      });
    } else {
      estoqueAtualizado = await prisma.estoque.create({
        data: { medicamento_id, quantidade }
      });
    }

    res.status(201).json({ message: 'Estoque atualizado com sucesso!', estoque: estoqueAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

// --- Rotas dos Relatórios ---
router.get('/relatorios', async (req, res) => {
  try {
    const relatorios = await prisma.relatorio.findMany({
      include: { usuario: true }
    });
    res.json(relatorios);
  } catch (error) {
    console.error('Erro na rota /relatorios:', error);
    res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
});

router.post('/relatorios', async (req, res) => {
  const { usuario_id, tipo_relatorio, arquivo_relatorio } = req.body;
  if (!usuario_id || !tipo_relatorio) {
    return res.status(400).json({ error: 'Usuário e tipo do relatório são obrigatórios' });
  }
  try {
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        usuario_id,
        tipo_relatorio,
        arquivo_relatorio
      }
    });
    res.status(201).json({ message: 'Relatório cadastrado com sucesso!', relatorio: novoRelatorio });
  } catch (error) {
    console.error('Erro ao cadastrar relatório:', error);
    res.status(500).json({ error: 'Erro ao cadastrar relatório' });
  }
});

// --- Rotas das Notificações ---
router.get('/notificacoes', async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany({
      include: { usuario: true }
    });
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro na rota /notificacoes:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

router.post('/notificacoes', async (req, res) => {
  const { usuario_id, mensagem } = req.body;
  if (!usuario_id || !mensagem) {
    return res.status(400).json({ error: 'Usuário e mensagem são obrigatórios' });
  }
  try {
    const novaNotificacao = await prisma.notificacao.create({
      data: { usuario_id, mensagem }
    });
    res.status(201).json({ message: 'Notificação cadastrada com sucesso!', notificacao: novaNotificacao });
  } catch (error) {
    console.error('Erro ao cadastrar notificação:', error);
    res.status(500).json({ error: 'Erro ao cadastrar notificação' });
  }
});

export default router;