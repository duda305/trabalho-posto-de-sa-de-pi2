import API from './services/api.js';
import Auth from './lib/auth.js';

const form = document.querySelector('form#loginUsuario'); // mais específico

if (form) {
  form.onsubmit = handleSubmit;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (form.checkValidity()) {
    const user = Object.fromEntries(new FormData(form));

    try {
      const response = await API.create('/signin', user, false);

      if (response.auth) {
        Auth.signin(response.token); // salva o token e redireciona
      } else {
        showToast(response.message || 'Erro no login. Verifique os dados.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro de conexão com o servidor.');
    }
  } else {
    form.classList.add('was-validated');
  }
}

function showToast(message) {
  const toastHeader = document.querySelector('.toast-header strong');
  const toastElement = document.querySelector('#liveToast');

  if (toastHeader) toastHeader.innerText = message;

  if (toastElement) {
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  } else {
    alert(message); // fallback
  }
}