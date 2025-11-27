import API from './services/api.js';
import Auth from './lib/auth.js';

const form = document.querySelector('#upload-form');
let formMethod;

// Função para carregar dados do usuário
async function loadProfile() {
  try {
    const user = await API.read(`/usuarios/me`, true); // true = enviar token

    let imagePath;

    // Verifica se o usuário já possui imagem
    if (user.image && user.image.path) {
      imagePath = user.image.path;
      formMethod = 'put';
    } else {
      imagePath = '/imgs/profile/avatar.png';
      formMethod = 'post';
    }

    // Preenche dados no DOM
    document.querySelector('#profile-name').innerText = user.nome;
    document.querySelector('#user-name').innerText = user.nome;
    document.querySelector('#profile-email').innerText = user.email;
    document.querySelector('#profile-image').src = imagePath;
    document.querySelector('#dropdown-avatar').src = imagePath;

    // Guarda ID do usuário no formulário para upload
    document.querySelector('#usuarioId').value = user.usuario_id;
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  }
}

// Evento submit do formulário de upload
form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    let newImage;

    if (formMethod === 'post') {
      newImage = await API.create('/usuarios/image', formData, true, true);
    } else if (formMethod === 'put') {
      newImage = await API.update('/usuarios/image', formData, true);
    }

    // Atualiza imagem no DOM
    if (newImage && newImage.path) {
      document.querySelector('#profile-image').src = newImage.path;
      document.querySelector('#dropdown-avatar').src = newImage.path;
    }

    form.reset();
  } catch (err) {
    console.error('Erro ao enviar imagem:', err);
  }
};

// Carrega o perfil se usuário estiver autenticado
if (Auth.isAuthenticated()) {
  loadProfile();
}

// Função de logout
window.signout = () => {
  Auth.logout();
  window.location.href = '/login.html';
};
