import API from './services/api.js';

const form = document.querySelector('form');

window.handleSubmit = handleSubmit;

async function handleSubmit(event) {
  event.preventDefault();

  if (form.checkValidity()) {
    const formData = new FormData(form);
    
    const password = formData.get('password');
    const confirmationPassword = formData.get('confirmationPassword');

    if (password !== confirmationPassword) {
      const error = 'As senhas não são iguais.';
      const confirmationPasswordError = document.querySelector(
        '#confirmationPassword + .invalid-feedback'
      );
      confirmationPasswordError.textContent = error;
      form.confirmationPassword.setCustomValidity(error);
      return;
    }

    const user = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      senha: password,
    };

    const { usuario, message } = await API.create('/usuarios', user, false);

    if (usuario) {
      location.href = '/signin.html';
    } else if (message === 'Email já cadastrado') {
      const error = 'Email já cadastrado';

      const emailError = document.querySelector('#email + .invalid-feedback');
      emailError.textContent = error;

      form.email.setCustomValidity(error);
      form.email.classList.add('is-invalid');
    } else {
      showToast('Erro no cadastro');
    }
  } else {
    form.classList.add('was-validated');
  }
}

form.email.oninput = () => {
  form.email.classList.remove('is-invalid');

  const emailError = document.querySelector('#email + .invalid-feedback');
  emailError.textContent = 'Informe o email do usuário.';
};

form.confirmationPassword.oninput = () => {
  const password = form.password.value;
  const confirmationPassword = form.confirmationPassword.value;

  if (password !== confirmationPassword) {
    const error = 'As senhas não são iguais.';

    const confirmationPasswordError = document.querySelector(
      '#confirmationPassword + .invalid-feedback'
    );

    confirmationPasswordError.textContent = error;
    form.confirmationPassword.setCustomValidity(error);
  } else {
    form.confirmationPassword.setCustomValidity('');
  }
};

function showToast(message) {
  document.querySelector('.toast-header strong').innerText = message;
  const toast = new bootstrap.Toast(document.querySelector('#liveToast'));
  toast.show();
}