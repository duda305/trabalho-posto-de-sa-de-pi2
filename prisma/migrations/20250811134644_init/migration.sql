-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "email" TEXT,
    "senha" TEXT,
    "data_cadastro" DATETIME
);

-- CreateTable
CREATE TABLE "medico" (
    "medico_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CRM" TEXT,
    "nome" TEXT,
    "disponibilidade" TEXT,
    "telefone" TEXT
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
    CONSTRAINT "Tem_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tem_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "Especialidade" ("especialidade_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paciente" (
    "paciente_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "telefone" TEXT,
    "cidade" TEXT,
    "bairro" TEXT,
    "endereco" TEXT,
    "CEP" TEXT
);

-- CreateTable
CREATE TABLE "consulta" (
    "consulta_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_consulta" DATETIME,
    "observacao" TEXT,
    "medico_id" INTEGER,
    "paciente_id" INTEGER,
    CONSTRAINT "consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "medico" ("medico_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente" ("paciente_id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "nome" TEXT,
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
    "usuario_id" INTEGER,
    "tipo_relatorio" TEXT,
    "arquivo_relatorio" TEXT,
    CONSTRAINT "relatorio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notificacao" (
    "notificacao_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER,
    "tipo" TEXT,
    "mensagens" TEXT,
    "data_envio" DATETIME,
    "status" TEXT,
    CONSTRAINT "notificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "medico_CRM_key" ON "medico"("CRM");
