import express from 'express';
import { PrismaClient } from '../generated/prisma/client.js';

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// GET todos os médicos
// ========================
router.get('/medicos', async (req, res) => {
  try {
    const medicos = await prisma.medico.findMany({
      include: { especialidades: true } // ajustar conforme seu schema
    });
    res.json(medicos);
  } catch (error) {
    console.error('Erro na rota /medicos:', error);
    res.status(500).json({ error: 'Erro ao buscar médicos' });
  }
});

// ========================
// POST cadastrar médico
// ========================
router.post('/medicos', async (req, res) => {
  const { nome, especialidade, descricao, horario, foto } = req.body;
  if (!nome || !especialidade || !descricao || !horario || !foto) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoMedico = await prisma.medico.create({
      data: { nome, especialidade, descricao, horario, foto }
    });
    res.status(201).json({ message: 'Médico cadastrado com sucesso!', novoMedico });
  } catch (error) {
    console.error('Erro ao cadastrar médico:', error);
    res.status(500).json({ error: 'Erro ao cadastrar médico' });
  }
});

// ========================
// GET todos os usuários
// ========================
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error('Erro na rota /usuarios:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// ========================
// POST cadastrar usuário
// ========================
router.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha }
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', novoUsuario });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// ========================
// GET todas as especialidades
// ========================
router.get('/especialidades', async (req, res) => {
  try {
    const especialidades = await prisma.especialidade.findMany();
    res.json(especialidades);
  } catch (error) {
    console.error('Erro na rota /especialidades:', error);
    res.status(500).json({ error: 'Erro ao buscar especialidades' });
  }
});

// ========================
// POST cadastrar especialidade
// ========================
router.post('/especialidades', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome da especialidade é obrigatório' });

  try {
    const novaEspecialidade = await prisma.especialidade.create({
      data: { nome }
    });
    res.status(201).json({ message: 'Especialidade cadastrada com sucesso!', novaEspecialidade });
  } catch (error) {
    console.error('Erro ao cadastrar especialidade:', error);
    res.status(500).json({ error: 'Erro ao cadastrar especialidade' });
  }
});

// ========================
// GET todos os pacientes
// ========================
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    console.error('Erro na rota /pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

// ========================
// POST cadastrar paciente
// ========================
router.post('/pacientes', async (req, res) => {
  const { nome, cpf, telefone, endereco } = req.body;
  if (!nome || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
  }
  try {
    const novoPaciente = await prisma.paciente.create({
      data: { nome, cpf, telefone, endereco }
    });
    res.status(201).json({ message: 'Paciente cadastrado com sucesso!', novoPaciente });
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar paciente' });
  }
});

// ========================
// GET todas as consultas
// ========================
router.get('/consultas', async (req, res) => {
  try {
    const consultas = await prisma.consulta.findMany({
      include: { paciente: true, medico: true }
    });
    res.json(consultas);
  } catch (error) {
    console.error('Erro na rota /consultas:', error);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});

// ========================
// POST cadastrar consulta
// ========================
router.post('/consultas', async (req, res) => {
  const { pacienteId, medicoId, data, horario } = req.body;
  if (!pacienteId || !medicoId || !data || !horario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        pacienteId,
        medicoId,
        data: new Date(data),
        horario
      }
    });
    res.status(201).json({ message: 'Consulta cadastrada com sucesso!', novaConsulta });
  } catch (error) {
    console.error('Erro ao cadastrar consulta:', error);
    res.status(500).json({ error: 'Erro ao cadastrar consulta' });
  }
});

// ========================
// GET todos os medicamentos
// ========================
router.get('/medicamentos', async (req, res) => {
  try {
    const medicamentos = await prisma.medicamento.findMany();
    res.json(medicamentos);
  } catch (error) {
    console.error('Erro na rota /medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

// ========================
// POST cadastrar medicamento
// ========================
router.post('/medicamentos', async (req, res) => {
  const { nome, descricao, quantidade } = req.body;
  if (!nome || !descricao || quantidade == null) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoMedicamento = await prisma.medicamento.create({
      data: { nome, descricao, quantidade }
    });
    res.status(201).json({ message: 'Medicamento cadastrado com sucesso!', novoMedicamento });
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
  }
});

// ========================
// GET estoque
// ========================
router.get('/estoque', async (req, res) => {
  try {
    const estoque = await prisma.estoque.findMany();
    res.json(estoque);
  } catch (error) {
    console.error('Erro na rota /estoque:', error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

// ========================
// POST cadastrar estoque
// ========================
router.post('/estoque', async (req, res) => {
  const { medicamentoId, quantidade } = req.body;
  if (!medicamentoId || quantidade == null) {
    return res.status(400).json({ error: 'Medicamento e quantidade são obrigatórios' });
  }
  try {
    const novoEstoque = await prisma.estoque.create({
      data: { medicamentoId, quantidade }
    });
    res.status(201).json({ message: 'Estoque atualizado com sucesso!', novoEstoque });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

// ========================
// GET relatórios
// ========================
router.get('/relatorios', async (req, res) => {
  try {
    const relatorios = await prisma.relatorio.findMany();
    res.json(relatorios);
  } catch (error) {
    console.error('Erro na rota /relatorios:', error);
    res.status(500).json({ error: 'Erro ao buscar relatórios' });
  }
});

// ========================
// POST cadastrar relatório
// ========================
router.post('/relatorios', async (req, res) => {
  const { titulo, conteudo } = req.body;
  if (!titulo || !conteudo) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  try {
    const novoRelatorio = await prisma.relatorio.create({
      data: { titulo, conteudo }
    });
    res.status(201).json({ message: 'Relatório cadastrado com sucesso!', novoRelatorio });
  } catch (error) {
    console.error('Erro ao cadastrar relatório:', error);
    res.status(500).json({ error: 'Erro ao cadastrar relatório' });
  }
});

// ========================
// GET notificações
// ========================
router.get('/notificacoes', async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany();
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro na rota /notificacoes:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

// ========================
// POST cadastrar notificação
// ========================
router.post('/notificacoes', async (req, res) => {
  const { titulo, mensagem, usuarioId } = req.body;
  if (!titulo || !mensagem || !usuarioId) {
    return res.status(400).json({ error: 'Título, mensagem e usuário são obrigatórios' });
  }
  try {
    const novaNotificacao = await prisma.notificacao.create({
      data: { titulo, mensagem, usuarioId }
    });
    res.status(201).json({ message: 'Notificação cadastrada com sucesso!', novaNotificacao });
  } catch (error) {
    console.error('Erro ao cadastrar notificação:', error);
    res.status(500).json({ error: 'Erro ao cadastrar notificação' });
  }
});

export default router;