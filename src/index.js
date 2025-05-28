import express from 'express';
import { medicos } from './data/medicos.js';

const app = express();

app.use(express.static('public'))
 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/medicos', (req, res) => {
  res.json(medicos);
});
 
app.listen(3000, () => {
  console.log('App running on port 3000');
});
 