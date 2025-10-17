import api from './api.js'; // ajuste o caminho se necessário

const form = document.getElementById('cadastrarUsuario');
const mensagem = document.getElementById('mensagemCadastro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  mensagem.textContent = '';
  mensagem.className = '';

  const formData = new FormData(form);
  const user = Object.fromEntries(formData);

  if (user.senha !== user.confirmacao_senha) {
    mensagem.textContent = 'As senhas não coincidem.';
    mensagem.classList.add('erro');
    return;
  }

  delete user.confirmacao_senha;

  try {
    const response = await api.create('/usuarios', user);

    if (response.status === 201) {
      mensagem.textContent = response.message || 'Cadastro realizado com sucesso!';
      mensagem.classList.add('sucesso');
      setTimeout(() => window.location.href = 'signin.html', 2000);
    } else {
      mensagem.textContent = response.message || 'Erro ao cadastrar.';
      mensagem.classList.add('erro');
    }
  } catch (err) {
    console.error(err);
    mensagem.textContent = 'Erro de comunicação com o servidor.';
    mensagem.classList.add('erro');
  }
});
