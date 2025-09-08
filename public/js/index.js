import API from './services/api.js';
import { mostrarTela } from './lib/view.js';

const form = document.querySelector('form#cadastrarUsuario');

window.cadastrarUsuario = cadastrarUsuario;
window.mostrarTela = mostrarTela;

async function cadastrarUsuario(event) {
    event.preventDefault();

    const user = Object.fromEntries(new FormData(form));

    const { email } = await API.create('/usuarios', user);

    if (email) {
        mostrarTela('perfil')
    }
}