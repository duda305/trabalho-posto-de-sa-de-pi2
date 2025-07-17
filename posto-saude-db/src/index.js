import express from 'express';
import medicos from './src/models/Medico.js';
import usuarios from './src/models/Usuario.js';
import especialidades from './src/models/Especialidade.js';
import pacientes from './src/models/Paciente.js';
import consultas from './src/models/Consulta.js';
import medicamentos from './src/models/Medicamento.js';
import estoque from './src/models/Estoque.js';
import relatorios from './src/models/Relatorio.js';
import notificacoes from './src/models/Notificacoes.js';
import pede from './src/models/Pede.js';
import tem from './src/models/Tem.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('API do Posto de Saúde em funcionamento!');
});


app.get('/medicos', async (req, res) => {
  const data = await medicos.read();
  res.json(data);
});


app.get('/usuarios', async (req, res) => {
  const data = await usuarios.read();
  res.json(data);
});


app.get('/especialidades', async (req, res) => {
  const data = await especialidades.read();
  res.json(data);
});


app.get('/pacientes', async (req, res) => {
  const data = await pacientes.read();
  res.json(data);
});


app.get('/consultas', async (req, res) => {
  const data = await consultas.read();
  res.json(data);
});


app.get('/medicamentos', async (req, res) => {
  const data = await medicamentos.read();
  res.json(data);
});


app.get('/estoque', async (req, res) => {
  const data = await estoque.read();
  res.json(data);
});


app.get('/relatorios', async (req, res) => {
  const data = await relatorios.read();
  res.json(data);
});


app.get('/notificacoes', async (req, res) => {
  const data = await notificacoes.read();
  res.json(data);
});


app.get('/pede', async (req, res) => {
  const data = await pede.read();
  res.json(data);
});


app.get('/tem', async (req, res) => {
  const data = await tem.read();
  res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
