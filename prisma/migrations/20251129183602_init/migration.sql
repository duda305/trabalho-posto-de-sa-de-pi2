/*
  Warnings:

  - Made the column `data_consulta` on table `consulta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `medico_id` on table `consulta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paciente_id` on table `consulta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `medicamento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CRM` on table `medico` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `medico` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `notificacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `paciente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `relatorio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senha` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Image_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_consulta" (
    "consulta_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data_consulta" DATETIME NOT NULL,
    "observacao" TEXT,
    "medico_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    CONSTRAINT "consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente" ("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_consulta" ("consulta_id", "data_consulta", "medico_id", "observacao", "paciente_id") SELECT "consulta_id", "data_consulta", "medico_id", "observacao", "paciente_id" FROM "consulta";
DROP TABLE "consulta";
ALTER TABLE "new_consulta" RENAME TO "consulta";
CREATE TABLE "new_medicamento" (
    "medicamento_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "fabricante" TEXT,
    "data_validade" DATETIME
);
INSERT INTO "new_medicamento" ("data_validade", "fabricante", "medicamento_id", "nome") SELECT "data_validade", "fabricante", "medicamento_id", "nome" FROM "medicamento";
DROP TABLE "medicamento";
ALTER TABLE "new_medicamento" RENAME TO "medicamento";
CREATE TABLE "new_medico" (
    "medico_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CRM" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "disponibilidade" TEXT,
    "telefone" TEXT,
    "foto" TEXT
);
INSERT INTO "new_medico" ("CRM", "disponibilidade", "medico_id", "nome", "telefone") SELECT "CRM", "disponibilidade", "medico_id", "nome", "telefone" FROM "medico";
DROP TABLE "medico";
ALTER TABLE "new_medico" RENAME TO "medico";
CREATE UNIQUE INDEX "medico_CRM_key" ON "medico"("CRM");
CREATE TABLE "new_notificacao" (
    "notificacao_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "tipo" TEXT,
    "mensagens" TEXT,
    "data_envio" DATETIME,
    "status" TEXT,
    CONSTRAINT "notificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notificacao" ("data_envio", "mensagens", "notificacao_id", "status", "tipo", "usuario_id") SELECT "data_envio", "mensagens", "notificacao_id", "status", "tipo", "usuario_id" FROM "notificacao";
DROP TABLE "notificacao";
ALTER TABLE "new_notificacao" RENAME TO "notificacao";
CREATE TABLE "new_paciente" (
    "paciente_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "endereco" TEXT,
    "CEP" TEXT
);
INSERT INTO "new_paciente" ("CEP", "bairro", "cidade", "endereco", "nome", "paciente_id", "telefone") SELECT "CEP", "bairro", "cidade", "endereco", "nome", "paciente_id", "telefone" FROM "paciente";
DROP TABLE "paciente";
ALTER TABLE "new_paciente" RENAME TO "paciente";
CREATE TABLE "new_relatorio" (
    "relatorio_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "tipo_relatorio" TEXT,
    "arquivo_relatorio" TEXT,
    CONSTRAINT "relatorio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_relatorio" ("arquivo_relatorio", "relatorio_id", "tipo_relatorio", "usuario_id") SELECT "arquivo_relatorio", "relatorio_id", "tipo_relatorio", "usuario_id" FROM "relatorio";
DROP TABLE "relatorio";
ALTER TABLE "new_relatorio" RENAME TO "relatorio";
CREATE TABLE "new_tem" (
    "medico_id" INTEGER NOT NULL,
    "especialidade_id" INTEGER NOT NULL,

    PRIMARY KEY ("medico_id", "especialidade_id"),
    CONSTRAINT "tem_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "medico" ("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tem_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "especialidade" ("especialidade_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tem" ("especialidade_id", "medico_id") SELECT "especialidade_id", "medico_id" FROM "tem";
DROP TABLE "tem";
ALTER TABLE "new_tem" RENAME TO "tem";
CREATE TABLE "new_usuario" (
    "usuario_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_cadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_usuario" ("data_cadastro", "email", "nome", "senha", "usuario_id") SELECT coalesce("data_cadastro", CURRENT_TIMESTAMP) AS "data_cadastro", "email", "nome", "senha", "usuario_id" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Image_usuarioId_key" ON "Image"("usuarioId");
