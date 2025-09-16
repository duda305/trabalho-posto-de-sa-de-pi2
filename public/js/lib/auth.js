function isAuthenticated() {
  if (!getToken()) {
    // Redireciona para a página de login caso não haja token
    window.location.href = '/signin.html';
  } else {
    return true;
  }
}

function getToken() {
  // Recupera o token JWT armazenado no localStorage
  return localStorage.getItem('@posto-saude:token');
}

function signin(token) {
  // Armazena o token após login bem-sucedido
  localStorage.setItem('@posto-saude:token', token);

  // Redireciona para a página principal do sistema
  window.location.href = '/home.html';
}

function signout() {
  // Remove o token ao sair da sessão
  localStorage.removeItem('@posto-saude:token');

  window.location.href = '/signin.html';
}

export default { isAuthenticated, getToken, signin, signout };
