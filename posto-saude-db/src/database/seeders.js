import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import Usuario from '../models/usuario.js';
import Medico from '../models/medico.js';
import Especialidade from '../models/especialidade.js';
import Tem from '../models/tem.js';
import Paciente from '../models/paciente.js';
import Consulta from '../models/consulta.js';
import Medicamento from '../models/medicamento.js';
import Pede from '../models/pede.js';
import Estoque from '../models/estoque.js';
import Relatorio from '../models/relatorio.js';
import Notificacoes from '../models/notificacoes.js';

async function up() {
  const file = resolve('src', 'database', 'seeders.json');
  const seed = JSON.parse(readFileSync(file));


  for (const usuario of seed.usuario || []) {
    await Usuario.create(usuario);
  }

  for (const medico of seed.medico || []) {
    await Medico.create(medico);
  }

  for (const especialidade of seed.especialidade || []) {
    await Especialidade.create(especialidade);
  }

  for (const rel of seed.tem || []) {
    await Tem.create(rel);
  }

  for (const paciente of seed.paciente || []) {
    await Paciente.create(paciente);
  }

  for (const consulta of seed.consulta || []) {
    await Consulta.create(consulta);
  }

  for (const medicamento of seed.medicamento || []) {
    await Medicamento.create(medicamento);
  }

  for (const entry of seed.pede || []) {
    await Pede.create(entry);
  }

  for (const estoque of seed.estoque || []) {
    await Estoque.create(estoque);
  }

  for (const relatorio of seed.relatorio || []) {
    await Relatorio.create(relatorio);
  }

  for (const notificacao of seed.notificacoes || []) {
    await Notificacoes.create(notificacao);
  }

}

export default { up };
