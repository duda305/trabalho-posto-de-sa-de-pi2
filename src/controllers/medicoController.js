import medico from '../models/medico.js';
import emailService from '../services/emailService.js';

async function deletarMedico(req, res) {
  try {
    const medico_id = Number(req.params.id);
    if (isNaN(medico_id)) return res.status(400).json({ message: 'ID inválido' });

    const medicoParaExcluir = await medico.readById(medico_id);
    if (!medicoParaExcluir) return res.status(404).json({ message: 'Médico não encontrado' });

    await medico.remove(medico_id);
    console.log('Chamando emailService para:', medicoParaExcluir.nome);
    await emailService.sendMedicoRemovidoEmail('admin@viver.com', medicoParaExcluir.nome);

    console.log(`🗑 Médico removido: ${medicoParaExcluir.nome}`);

    res.json({ message: 'Médico excluído com sucesso e e-mail enviado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover médico' });
  }
}

async function listarMedicos(req, res) {
  try {
    const medicos = await medico.read(req.query);
    res.json({ medicos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar médicos' });
  }
}

async function criarMedico(req, res) {
  try {
    const novoMedico = await medico.create(req.body);
    res.status(201).json({ message: 'Médico cadastrado com sucesso!', medico: novoMedico });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

async function atualizarMedico(req, res) {
  try {
    const medicoAtualizado = await medico.update({ ...req.body, medico_id: Number(req.params.id) });
    res.json({ message: 'Médico atualizado com sucesso!', medico: medicoAtualizado });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

export default { deletarMedico, listarMedicos, criarMedico, atualizarMedico };
