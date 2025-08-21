import prisma from '../database/database.js';

async function create({ medicamento_id, nome, fabricante, data_validade }) {
  if (medicamento_id && nome && fabricante && data_validade) {
    const createdMedicamento = await prisma.medicamento.create({
      data: {
        medicamento_id,
        nome,
        fabricante,
        data_validade: new Date(data_validade),
      },
    });

    return createdMedicamento;
  } else {
    throw new Error('Campos obrigatórios ausentes para criar medicamento');
  }
}

async function read(where) {
  // Se receber filtro, aplica; se não, retorna todos os medicamentos
  const medicamentos = await prisma.medicamento.findMany({
    where: where || {},
  });

  if (medicamentos.length === 1 && where) {
    return medicamentos[0];
  }

  return medicamentos;
}

async function readById(medicamento_id) {
  if (medicamento_id) {
    const medicamento = await prisma.medicamento.findUnique({
      where: { medicamento_id },
    });

    if (!medicamento) throw new Error('Medicamento não encontrado');
    return medicamento;
  } else {
    throw new Error('ID do medicamento é obrigatório');
  }
}

async function update({ medicamento_id, nome, fabricante, data_validade }) {
  if (medicamento_id && nome && fabricante && data_validade) {
    const updatedMedicamento = await prisma.medicamento.update({
      where: { medicamento_id },
      data: {
        nome,
        fabricante,
        data_validade: new Date(data_validade),
      },
    });

    return updatedMedicamento;
  } else {
    throw new Error('Dados incompletos para atualização do medicamento');
  }
}

async function remove(medicamento_id) {
  if (medicamento_id) {
    await prisma.medicamento.delete({
      where: { medicamento_id },
    });

    return true;
  } else {
    throw new Error('ID do medicamento é obrigatório para remoção');
  }
}

export default { create, read, readById, update, remove };

