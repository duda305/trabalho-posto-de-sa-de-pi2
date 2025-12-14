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
    // Imagem de perfil
    // -------------------------------
    let imagePath = '/projeto/img/cara.png';

    if (user.image?.path) {
      imagePath = '/' + user.image.path;
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
    // ❗ NÃO remove token
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
        const imgPath = '/' + response.path;

        const profileImage = document.querySelector('#profile-image');
        const dropdownAvatar = document.querySelector('#dropdown-avatar');

        if (profileImage) profileImage.src = imgPath;
        if (dropdownAvatar) dropdownAvatar.src = imgPath;
      }

      form.reset();

    } catch (err) {
      // ❗ NÃO remove token
      console.error('Erro ao enviar imagem:', err);
    }
  });
}

// ===============================
// Logout (ÚNICO lugar que remove token)
// ===============================
window.signout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
};

// ===============================
// Init
// ===============================
loadProfile();
