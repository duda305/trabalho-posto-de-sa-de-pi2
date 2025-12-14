document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  // ===============================
  // Autenticação
  // ===============================
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // ===============================
  // Elementos
  // ===============================
  const userPic = document.getElementById('userProfilePic');
  const perfilBtn = document.getElementById('perfilBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // ===============================
  // Função única de redirecionamento
  // ===============================
  const goToProfile = () => {
    window.location.href = 'profile.html';
  };

  // ===============================
  // Carregar avatar do usuário
  // ===============================
  try {
    const response = await fetch('/api/usuarios/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }

    const { usuario } = await response.json();

    if (usuario?.image?.path && userPic) {
      userPic.src = '/' + usuario.image.path;
    }

  } catch (err) {
    console.warn('Não foi possível carregar avatar:', err);
    // mantém cara.png como fallback
  }

  // ===============================
  // Ações de perfil
  // ===============================
  if (userPic) {
    userPic.addEventListener('click', goToProfile);
  }

  if (perfilBtn) {
    perfilBtn.addEventListener('click', goToProfile);
  }

  // ===============================
  // Logout
  // ===============================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'signin.html';
    });
  }
});
