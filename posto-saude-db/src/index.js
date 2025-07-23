import express from 'express';
import medicos from './models/medico.js';
import usuarios from './models/usuario.js';
import especialidades from './models/especialidade.js';
import pacientes from './models/paciente.js';
import consultas from './models/consulta.js';
import medicamentos from './models/medicamento.js';
import estoque from './models/estoque.js';
import relatorios from './models/relatorio.js';
import notificacoes from './models/notificacoes.js';
import pede from './models/pede.js';
import tem from './models/tem.js';

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
