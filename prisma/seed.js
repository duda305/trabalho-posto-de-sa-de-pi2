import { PrismaClient } from '../generated/prisma/client.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

function converterDatas(array, camposDeData) {
  return array.map(item => {
    const novo = { ...item };
    camposDeData.forEach(campo => {
      if (novo[campo]) novo[campo] = new Date(novo[campo]);
    });
    return novo;
  });
}

async function main() {
  const filePath = resolve('prisma', 'seeders.json');
  const seedData = JSON.parse(readFileSync(filePath, 'utf-8'));

  // ORDEM CERTA COM skipDuplicates
  await prisma.usuario.createMany({
    data: converterDatas(seedData.usuarios, ['data_cadastro']),
    skipDuplicates: true
  });

  await prisma.especialidade.createMany({
    data: seedData.especialidades,
    skipDuplicates: true
  });

  await prisma.medico.createMany({
    data: seedData.medicos,
    skipDuplicates: true
  });

  await prisma.tem.createMany({
    data: seedData.tem,
    skipDuplicates: true
  });

  await prisma.paciente.createMany({
    data: seedData.pacientes,
    skipDuplicates: true
  });

  await prisma.consulta.createMany({
    data: converterDatas(seedData.consultas, ['data_consulta']),
    skipDuplicates: true
  });

  await prisma.medicamento.createMany({
    data: converterDatas(seedData.medicamentos, ['data_validade']),
    skipDuplicates: true
  });

  await prisma.pede.createMany({
    data: seedData.pede,
    skipDuplicates: true
  });

  await prisma.estoque.createMany({
    data: seedData.estoque,
    skipDuplicates: true
  });

  await prisma.relatorio.createMany({
    data: seedData.relatorios,
    skipDuplicates: true
  });

  await prisma.notificacao.createMany({
    data: converterDatas(seedData.notificacoes, ['data_envio']),
    skipDuplicates: true
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
