import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ============================================================================
// CONFIGURAÇÕES INICIAIS (devem vir ANTES de qualquer outro import da aplicação)
// ============================================================================

// Corrige __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env da raiz do projeto
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// (Opcional) só mostra no console fora do ambiente de teste
if (process.env.NODE_ENV !== "test") {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
}

// ============================================================================
// IMPORTS DA APLICAÇÃO (devem vir DEPOIS do dotenv.config())
// ============================================================================
import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes.js";

// ============================================================================
// INICIALIZAÇÃO DO APP
// ============================================================================
const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Uploads estáticos
app.use("/uploads", express.static("uploads"));

// ----------------- ROTA PRINCIPAL (REDIRECIONA PARA SIGNIN) -----------------
app.get("/", (_, res) => {
  const filePath = path.join(__dirname, "../public/signin.html");
  res.sendFile(filePath);
});

// ----------------- ARQUIVOS ESTÁTICOS -----------------
app.use(express.static(path.join(__dirname, "../public")));

// ----------------- ROTAS DA API -----------------
app.use("/api", router);

// ----------------- TRATAMENTO GLOBAL DE ERROS -----------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Token inválido ou ausente" });
  }

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal server error",
  });
});

// ============================================================================
// EXPORT DO APP (SUPERTEST PRECISA DISSO)
// ============================================================================

// ============================================================================
// INICIAR SERVIDOR (SÓ FORA DOS TESTES)
// ============================================================================
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  });
}

export default app;