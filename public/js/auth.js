// js/auth.js
function isAuthenticated() {
  if (!getToken()) {
    window.location.href = 'signin.html'; // redireciona se não tiver token
  } else {
    return true;
  }
}

function getToken() {
  return localStorage.getItem('@posto-saude:token'); // token armazenado
}

function signin(token) {
  localStorage.setItem('@posto-saude:token', token);
  window.location.href = 'perfil.html'; // redireciona após login
}

function signout() {
  localStorage.removeItem('@posto-saude:token');
  window.location.href = 'signin.html'; // redireciona para login
}

export default { isAuthenticated, getToken, signin, signout };
