import auth from './lib/auth.js';
import api from './api.js';

const form = document.getElementById("loginUsuario");
const erro = document.getElementById("loginErro");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (erro) erro.textContent = "";

  const user = Object.fromEntries(new FormData(form));

  try {
    const response = await api.create("/signin", user);

    if (response.auth) {
      alert("Login efetuado com sucesso!");
      window.location.href = "perfil.html";
    } else if (erro) {
      erro.textContent = response.message || "E-mail ou senha incorretos.";
    }
  } catch (error) {
    console.error(error);
    if (erro) erro.textContent = "Erro na comunicação com o servidor.";
  }
});
