import API from './services/api.js';
import { mostrarTela } from './lib/view.js';

window.cadastrarUsuario = cadastrarUsuario;
window.loginUsuario = loginUsuario;
window.mostrarTela = mostrarTela;

async function cadastrarUsuario(event) {
    event.preventDefault();

    const form = document.querySelector('form#cadastrarUsuario');
    const user = Object.fromEntries(new FormData(form));

    // Verifica se as senhas são iguais
    if (user.senha !== user.confirmacao_senha) {
        alert('As senhas não coincidem.');
        return;
    }

    try {
        // Tenta criar o usuário
        const { email } = await API.create('/usuarios', user);

        if (email) {
            alert('Cadastro realizado com sucesso! Faça login.');
            form.reset(); // limpa o formulário
            mostrarTela('login'); // redireciona para a tela de login
        }
    } catch (error) {
        // Verifica se o erro foi um 400 (ex: email já cadastrado)
        if (error.response && error.response.status === 400) {
            alert('Este e-mail já está cadastrado. Tente fazer login.');
        } else {
            alert('Erro ao cadastrar. Tente novamente mais tarde.');
        }
        console.error(error);
    }
}

async function loginUsuario(event) {
    event.preventDefault();

    const form = document.querySelector('form#loginUsuario');

    const user = Object.fromEntries(new FormData(form));

    const { auth, token } = await API.create('/signin', user);

if (auth) {
        mostrarTela('perfil'); // Correção aqui
    } else {
        alert("Usuário ou senha incorretos.");
    }
}