import API from './api.js';
import Auth from './auth.js';

const form = document.getElementById('loginUsuario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const senha = form.senha.value.trim();

  // Validação simples
  if (!email || !senha) {
    alert('Por favor, preencha e-mail e senha.');
    return;
  }

  // JSON que será enviado para a API
  const loginUsuario = {
    email: email,
    senha: senha  
  };

  console.log('JSON enviado para /signin:', loginUsuario);

  try {
    // auth = false porque ainda não temos token
    const res = await API.create('/signin', loginUsuario, false);

    console.log('Login realizado:', res);

    // Salva o token se a API retornar
    if (res.token) {
      Auth.setToken(res.token);
    }

    // Redireciona para a página principal (ajuste para a sua rota)
    window.location.href = '/perfil.html';

  } catch (err) {
    console.error('Erro no login:', err.message);
    alert('Login falhou: ' + err.message);
  }
});
