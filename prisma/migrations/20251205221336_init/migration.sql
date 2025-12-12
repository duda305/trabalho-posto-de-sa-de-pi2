-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_cadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "image_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medico" (
    "medico_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CRM" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "disponibilidade" TEXT,
    "telefone" TEXT,
    "foto" TEXT
);

-- CreateTable
CREATE TABLE "especialidade" (
    "especialidade_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tem" (
    "medico_id" INTEGER NOT NULL,
    "especialidade_id" INTEGER NOT NULL,

    PRIMARY KEY ("medico_id", "especialidade_id"),
    CONSTRAINT "tem_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tem_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "especialidade" ("especialidade_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paciente" (
    "paciente_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "endereco" TEXT,
    "CEP" TEXT
);

-- CreateTable
CREATE TABLE "consulta" (
    "consulta_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_consulta" DATETIME NOT NULL,
    "observacao" TEXT,
    "medico_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    CONSTRAINT "consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente" ("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pede" (
    "consulta_id" INTEGER NOT NULL,
    "medicamento_id" INTEGER NOT NULL,

    PRIMARY KEY ("consulta_id", "medicamento_id"),
    CONSTRAINT "pede_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "consulta" ("consulta_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pede_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamento" ("medicamento_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medicamento" (
    "medicamento_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "fabricante" TEXT,
    "data_validade" DATETIME
);

-- CreateTable
CREATE TABLE "estoque" (
    "estoque_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicamento_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "estoque_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamento" ("medicamento_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "relatorio" (
    "relatorio_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "tipo_relatorio" TEXT,
    "arquivo_relatorio" TEXT,
    CONSTRAINT "relatorio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notificacao" (
    "notificacao_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "tipo" TEXT,
    "mensagens" TEXT,
    "data_envio" DATETIME,
    "status" TEXT,
    CONSTRAINT "notificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "image_usuarioId_key" ON "image"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "medico_CRM_key" ON "medico"("CRM");
