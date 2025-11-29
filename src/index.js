import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import router from './routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// ----------------- ROTAS -----------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/projeto/index.html'));
});

// Todas as rotas da API
app.use('/api', router);

// ----------------- TRATAMENTO GLOBAL DE ERROS -----------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido ou ausente' });
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal server error',
  });
});

// ----------------- INICIAR SERVIDOR -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
