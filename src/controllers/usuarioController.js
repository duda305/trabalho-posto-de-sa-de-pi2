import usuarioModel from '../models/usuario.js';
import mailService from '../services/mailService.js';

async function create(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const novoUsuario = await usuarioModel.create({ nome, email, senha });

    // 📩 Enviar e-mail após criação
    await mailService.createNewUser(email);

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: novoUsuario,
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

export default { create };
