import API from './api.js';
import Auth from './auth.js';

const form = document.getElementById('loginUsuario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const senha = form.senha.value.trim();

  if (!email || !senha) {
    alert('Preencha e-mail e senha.');
    return;
  }

  try {
    // Chama /api/signin corretamente
    const res = await API.create('/signin', { email, senha }, false);

    if (res.token) {
      Auth.signin(res.token); // salva token e redireciona
    } else {
      alert('Login falhou: token não retornado');
    }

  } catch (err) {
    console.error(err);
    alert('Login falhou: ' + err.message);
  }
});
