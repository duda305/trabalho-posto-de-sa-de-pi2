import prisma from '../database/database.js';

async function create({ nome, CRM, disponibilidade, telefone }) {
  if (!nome || !CRM || !disponibilidade || !telefone) {
    throw new Error('Campos obrigatórios ausentes para criar médico');
  }

  const createdMedico = await prisma.medico.create({
    data: { nome, CRM, disponibilidade, telefone },
  });

  return createdMedico;
}

async function read(where) {
  return await prisma.medico.findMany({ where: where || {} });
}

async function readById(medico_id) {
  if (!medico_id) throw new Error('ID do médico é obrigatório');
  const medico = await prisma.medico.findUnique({ where: { medico_id } });
  return medico || null;
}

async function update({ medico_id, nome, CRM, disponibilidade, telefone }) {
  if (!medico_id || !nome || !CRM || !disponibilidade || !telefone) {
    throw new Error('Dados incompletos para atualização do médico');
  }

  const updatedMedico = await prisma.medico.update({
    where: { medico_id },
    data: { nome, CRM, disponibilidade, telefone },
  });

  return updatedMedico;
}

async function remove(medico_id) {
  if (!medico_id) throw new Error('ID do médico é obrigatório para remoção');

  await prisma.medico.delete({ where: { medico_id } });
  return true;
}

export default { create, read, readById, update, remove };
