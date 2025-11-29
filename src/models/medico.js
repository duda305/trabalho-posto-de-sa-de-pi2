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

async function update(medico_id, data) {
  return prisma.medico.update({
    where: { medico_id },
    data,
  });
}

async function updateFoto(medico_id, foto) {
  return prisma.medico.update({
    where: { medico_id },
    data: { foto },
  });
}

async function remove(medico_id) {
  if (!medico_id) throw new Error('ID do médico é obrigatório para remoção');

  await prisma.medico.delete({ where: { medico_id } });
  return true;
}

export default { 
  create, 
  read, 
  readById, 
  update,     
  updateFoto, 
  remove 
};
