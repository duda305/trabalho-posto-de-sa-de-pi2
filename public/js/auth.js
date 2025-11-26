function getToken() {
  return localStorage.getItem('@posto-saude:token');
}

function signin(token) {
  localStorage.setItem('@posto-saude:token', token);
  window.location.href = 'perfil.html';
}

function signout() {
  localStorage.removeItem('@posto-saude:token');
  window.location.href = 'signin.html';
}

export default { getToken, signin, signout };
