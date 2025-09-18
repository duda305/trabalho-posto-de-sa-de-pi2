import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import router from './routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

// Serve a pasta public estática
app.use(express.static(path.join(__dirname, '../public')));

// Rota raiz: servir o arquivo index.html dentro de projeto/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/projeto/index.html'));
});

// Rotas da API sob o prefixo /api
app.use('/api', router);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
