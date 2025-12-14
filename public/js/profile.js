// ===============================
// Elementos
// ===============================
const form = document.querySelector('#upload-form');

// ===============================
// API helper
// ===============================
const API = {
  async request(url, options = {}) {
    const token = localStorage.getItem('token');

    const response = await fetch('/api' + url, {
      ...options,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return response.json();
  },

  read(url) {
    return this.request(url, { method: 'GET' });
  },

  create(url, body, isFormData = false) {
    return this.request(url, {
      method: 'POST',
      body,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    });
  }
};

// ===============================
// Token (APENAS leitura)
// ===============================
const token = localStorage.getItem('token');

if (!token) {
  console.warn('Token não encontrado. Usuário não autenticado.');
}

// ===============================
// Carregar perfil
// ===============================
async function loadProfile() {
  try {
    const response = await API.read('/usuarios/me');
    const user = response.usuario;

    if (!user) return;

    // -------------------------------
    // Imagem de perfil (fallback)
    // -------------------------------
    let imagePath = '/projeto/img/cara.png';

    if (user.image?.path) {
      // cache busting para evitar imagem antiga
      imagePath = '/' + user.image.path + '?v=' + Date.now();
    }

    // -------------------------------
    // Preenchimento do DOM
    // -------------------------------
    const profileName = document.querySelector('#profile-name');
    const profileEmail = document.querySelector('#profile-email');
    const userName = document.querySelector('#user-name');
    const profileImage = document.querySelector('#profile-image');
    const dropdownAvatar = document.querySelector('#dropdown-avatar');

    if (profileName) profileName.innerText = user.nome || '';
    if (profileEmail) profileEmail.innerText = user.email || '';
    if (userName) userName.innerText = user.nome || '';
    if (profileImage) profileImage.src = imagePath;
    if (dropdownAvatar) dropdownAvatar.src = imagePath;

  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  }
}

// ===============================
// Upload de imagem
// ===============================
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await API.create('/usuarios/image', formData, true);

      if (response?.path) {
        // cache busting após upload
        const imgPath = '/' + response.path + '?v=' + Date.now();

        document.querySelector('#profile-image').src = imgPath;
        document.querySelector('#dropdown-avatar').src = imgPath;
      }

      form.reset();

      // -------------------------------
      // Fechar modal após upload ✅
      // -------------------------------
      const modalElement = document.getElementById('uploadModal');
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);

      modalInstance.hide();

    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }
  });
}

// ===============================
// Logout (ÚNICO lugar que remove token)
// ===============================
window.signout = () => {
  localStorage.removeItem('token');
  window.location.href = '/signin.html';
};

// ===============================
// Init
// ===============================
loadProfile();
