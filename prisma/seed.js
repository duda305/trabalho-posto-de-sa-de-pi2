import { PrismaClient } from '../generated/prisma/client.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

async function main() {
  const filePath = resolve('prisma', 'seeders.json');
  const seedData = JSON.parse(readFileSync(filePath, 'utf-8'));

  await prisma.usuario.createMany({
    data: seedData.usuarios,
    skipDuplicates: true,
  });


  await prisma.medico.createMany({
    data: seedData.medicos,
    skipDuplicates: true,
  });


  await prisma.especialidade.createMany({
    data: seedData.especialidades,
    skipDuplicates: true,
  });


  await prisma.tem.createMany({
    data: seedData.tem,
    skipDuplicates: true,
  });


  await prisma.paciente.createMany({
    data: seedData.pacientes,
    skipDuplicates: true,
  });


  await prisma.consulta.createMany({
    data: seedData.consultas,
    skipDuplicates: true,
  });

 
  await prisma.medicamento.createMany({
    data: seedData.medicamentos,
    skipDuplicates: true,
  });


  await prisma.pede.createMany({
    data: seedData.pede,
    skipDuplicates: true,
  });

 
  await prisma.estoque.createMany({
    data: seedData.estoque,
    skipDuplicates: true,
  });

 
  await prisma.relatorio.createMany({
    data: seedData.relatorios,
    skipDuplicates: true,
  });


  await prisma.notificacoes.createMany({
    data: seedData.notificacoes,
    skipDuplicates: true,
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
