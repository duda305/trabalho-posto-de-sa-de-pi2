const form = document.querySelector('form');

form.addEventListener('submit', handleSubmit);

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

    try {
      const { usuario, message } = await API.create('/usuarios', user, false);

      if (usuario) {
        showToast('Cadastro realizado com sucesso!');
        setTimeout(() => {
          location.href = '/signin.html';
        }, 2000);
      } else if (message && message.toLowerCase().includes('email')) {
        const error = 'Email já cadastrado';

        const emailError = document.querySelector('#email + .invalid-feedback');
        emailError.textContent = error;

        form.email.setCustomValidity(error);
        form.email.classList.add('is-invalid');
      } else {
        showToast('Erro no cadastro');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro no servidor');
    }
  } else {
    form.classList.add('was-validated');
  }
}
