-- CreateTable
CREATE TABLE "Usuario" (
    "usuario_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "email" TEXT,
    "senha" TEXT,
    "data_cadastro" DATETIME
);

-- CreateTable
CREATE TABLE "Medico" (
    "medico_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CRM" TEXT,
    "nome" TEXT,
    "disponibilidade" TEXT,
    "telefone" TEXT
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "especialidade_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tem" (
    "medico_id" INTEGER NOT NULL,
    "especialidade_id" INTEGER NOT NULL,

    PRIMARY KEY ("medico_id", "especialidade_id"),
    CONSTRAINT "Tem_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tem_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "Especialidade" ("especialidade_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paciente" (
    "paciente_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "telefone" TEXT,
    "cidade" TEXT,
    "bairro" TEXT,
    "endereco" TEXT,
    "CEP" TEXT
);

-- CreateTable
CREATE TABLE "Consulta" (
    "consulta_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_consulta" DATETIME,
    "observacao" TEXT,
    "medico_id" INTEGER,
    "paciente_id" INTEGER,
    CONSTRAINT "Consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico" ("medico_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente" ("paciente_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pede" (
    "consulta_id" INTEGER NOT NULL,
    "medicamento_id" INTEGER NOT NULL,

    PRIMARY KEY ("consulta_id", "medicamento_id"),
    CONSTRAINT "Pede_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta" ("consulta_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pede_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "Medicamento" ("medicamento_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "medicamento_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "fabricante" TEXT,
    "data_validade" DATETIME
);

-- CreateTable
CREATE TABLE "Estoque" (
    "estoque_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicamento_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Estoque_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "Medicamento" ("medicamento_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Relatorio" (
    "relatorio_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER,
    "tipo_relatorio" TEXT,
    "arquivo_relatorio" TEXT,
    CONSTRAINT "Relatorio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacoes" (
    "notificacao_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER,
    "tipo" TEXT,
    "mensagens" TEXT,
    "data_envio" DATETIME,
    "status" TEXT,
    CONSTRAINT "Notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Medico_CRM_key" ON "Medico"("CRM");
