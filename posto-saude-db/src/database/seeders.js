import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import Usuario from '../models/usuarios.js';
import Medico from '../models/medicos.js';
import Especialidade from '../models/especialidades.js';
import Tem from '../models/tem.js';
import Paciente from '../models/pacientes.js';
import Consulta from '../models/consultas.js';
import Medicamento from '../models/medicamentos.js';
import Pede from '../models/pede.js';
import Estoque from '../models/estoque.js';
import Relatorio from '../models/relatorio.js';
import Notificacoes from '../models/notificacoes.js';

async function up() {
  const file = resolve('src', 'database', 'seeders.json');
  const seed = JSON.parse(readFileSync(file));


  for (const usuario of seed.usuarios || []) {
    await Usuario.create(usuario);
  }

  for (const medico of seed.medicos || []) {
    await Medico.create(medico);
  }

  for (const especialidade of seed.especialidades || []) {
    await Especialidade.create(especialidade);
  }

  for (const rel of seed.tem || []) {
    await Tem.create(rel);
  }

  for (const paciente of seed.pacientes || []) {
    await Paciente.create(paciente);
  }

  for (const consulta of seed.consultas || []) {
    await Consulta.create(consulta);
  }

  for (const medicamento of seed.medicamentos || []) {
    await Medicamento.create(medicamento);
  }

  for (const entry of seed.pede || []) {
    await Pede.create(entry);
  }

  for (const estoque of seed.estoque || []) {
    await Estoque.create(estoque);
  }

  for (const relatorio of seed.relatorios || []) {
    await Relatorio.create(relatorio);
  }

  for (const notificacao of seed.notificacoes || []) {
    await Notificacoes.create(notificacao);
  }

}

export default { up };
