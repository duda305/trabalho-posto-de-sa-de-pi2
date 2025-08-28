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

  await prisma.usuario.createMany({ data: converterDatas(seedData.usuarios, ['data_cadastro']) });
  await prisma.medico.createMany({ data: seedData.medicos });
  await prisma.especialidade.createMany({ data: seedData.especialidades });
  await prisma.tem.createMany({ data: seedData.tem });
  await prisma.paciente.createMany({ data: seedData.pacientes });
  await prisma.consulta.createMany({ data: converterDatas(seedData.consultas, ['data_consulta']) });
  await prisma.medicamento.createMany({ data: converterDatas(seedData.medicamentos, ['data_validade']) });
  await prisma.pede.createMany({ data: seedData.pede });
  await prisma.estoque.createMany({ data: seedData.estoque });
  await prisma.relatorio.createMany({ data: seedData.relatorios });
  await prisma.notificacao.createMany({ data: converterDatas(seedData.notificacoes, ['data_envio']) });

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