import { PrismaClient } from '../src/generated/prisma/client.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const prisma = new PrismaClient();

/**
 * Converte campos DateTime vindos como string para Date
 */
function converterDatas(array, camposDeData) {
  if (!array) return [];
  return array.map(item => {
    const novo = { ...item };
    camposDeData.forEach(campo => {
      if (novo[campo]) novo[campo] = new Date(novo[campo]);
    });
    return novo;
  });
}

async function main() {
  // ✅ Caminho absoluto correto do seeders.json
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = resolve(__filename, '..');
  const filePath = resolve(__dirname, 'seeders.json');

  const seedData = JSON.parse(readFileSync(filePath, 'utf-8'));

  // =========================
  // USUÁRIOS
  // =========================
  if (seedData.usuarios?.length) {
    await prisma.usuario.createMany({
      data: converterDatas(seedData.usuarios, ['data_cadastro'])
    });
  }

  // =========================
  // IMAGENS
  // =========================
  if (seedData.images?.length) {
    await prisma.image.createMany({
      data: seedData.images
    });
  }

  // =========================
  // ESPECIALIDADES
  // =========================
  if (seedData.especialidades?.length) {
    await prisma.especialidade.createMany({
      data: seedData.especialidades
    });
  }

  // =========================
  // MÉDICOS
  // =========================
  if (seedData.medicos?.length) {
    await prisma.medico.createMany({
      data: seedData.medicos
    });
  }

  // =========================
  // RELAÇÃO TEM
  // =========================
  if (seedData.tem?.length) {
    await prisma.tem.createMany({
      data: seedData.tem
    });
  }

  // =========================
  // PACIENTES
  // =========================
  if (seedData.pacientes?.length) {
    await prisma.paciente.createMany({
      data: seedData.pacientes
    });
  }

  // =========================
  // CONSULTAS
  // =========================
  if (seedData.consultas?.length) {
    await prisma.consulta.createMany({
      data: converterDatas(seedData.consultas, ['data_consulta'])
    });
  }

  // =========================
  // MEDICAMENTOS
  // =========================
  if (seedData.medicamentos?.length) {
    await prisma.medicamento.createMany({
      data: converterDatas(seedData.medicamentos, ['data_validade'])
    });
  }

  // =========================
  // PEDE
  // =========================
  if (seedData.pede?.length) {
    await prisma.pede.createMany({
      data: seedData.pede
    });
  }

  // =========================
  // ESTOQUE
  // =========================
  if (seedData.estoque?.length) {
    await prisma.estoque.createMany({
      data: seedData.estoque
    });
  }

  // =========================
  // RELATÓRIOS
  // =========================
  if (seedData.relatorios?.length) {
    await prisma.relatorio.createMany({
      data: seedData.relatorios
    });
  }

  // =========================
  // NOTIFICAÇÕES
  // =========================
  if (seedData.notificacoes?.length) {
    await prisma.notificacao.createMany({
      data: converterDatas(seedData.notificacoes, ['data_envio'])
    });
  }

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
