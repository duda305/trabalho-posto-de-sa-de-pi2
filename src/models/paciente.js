import prisma from '../database/database.js';

async function create({ paciente_id, nome, telefone, bairro, cidade, endereco, CEP }) {
  if (paciente_id && nome && telefone && bairro && cidade && endereco && CEP) {
    const createdPaciente = await prisma.paciente.create({
      data: { paciente_id, nome, telefone, bairro, cidade, endereco, CEP },
    });

    return createdPaciente;
  } else {
    throw new Error('Unable to create paciente');
  }
}

async function read(where) {
  if (where?.nome) {
    where.nome = {
      contains: where.nome,
    };
  }

  const pacientes = await prisma.paciente.findMany({ where });

  if (pacientes.length === 1 && where) {
    return pacientes[0];
  }

  return pacientes;
}

async function readById(paciente_id) {
  if (paciente_id) {
    const paciente = await prisma.paciente.findUnique({
      where: {
        paciente_id,
      },
    });

    return paciente;
  } else {
    throw new Error('Unable to find paciente');
  }
}

async function update({ paciente_id, nome, telefone, bairro, cidade, endereco, CEP }) {
  if (paciente_id && nome && telefone && bairro && cidade && endereco && CEP) {
    const updatedPaciente = await prisma.paciente.update({
      where: {
        paciente_id,
      },
      data: { nome, telefone, bairro, cidade, endereco, CEP },
    });

    return updatedPaciente;
  } else {
    throw new Error('Unable to update paciente');
  }
}

async function remove(paciente_id) {
  if (paciente_id) {
    await prisma.paciente.delete({
      where: {
        paciente_id,
      },
    });

    return true;
  } else {
    throw new Error('Unable to remove paciente');
  }
}

export default { create, read, readById, update, remove };
