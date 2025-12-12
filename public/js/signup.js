// js/signup.js

const form = document.getElementById('cadastrarUsuario');
const mensagemCadastro = document.getElementById('mensagemCadastro');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Limpa mensagens anteriores
    mensagemCadastro.textContent = '';
    mensagemCadastro.className = '';

    // Captura valores
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();
    const confirmacaoSenha = form.confirmacao_senha.value.trim();

    // Validação front-end
    if (!nome || !email || !senha || !confirmacaoSenha) {
        mensagemCadastro.textContent = 'Preencha todos os campos!';
        mensagemCadastro.classList.add('erro');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mensagemCadastro.textContent = 'Email inválido!';
        mensagemCadastro.classList.add('erro');
        return;
    }

    if (senha.length < 3) {
        mensagemCadastro.textContent = 'A senha deve ter pelo menos 3 caracteres.';
        mensagemCadastro.classList.add('erro');
        return;
    }

    if (senha !== confirmacaoSenha) {
        mensagemCadastro.textContent = 'As senhas não coincidem.';
        mensagemCadastro.classList.add('erro');
        return;
    }

    // Monta objeto para envio
    const data = { nome, email, senha };

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            mensagemCadastro.textContent = 'Cadastro realizado com sucesso!';
            mensagemCadastro.classList.add('sucesso');
            form.reset();

            // Redireciona para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        } else {
            // Erros do backend (Zod ou conflito de email)
            if (result.errors && Array.isArray(result.errors)) {
                mensagemCadastro.textContent = result.errors.map(e => e.message).join(', ');
            } else {
                mensagemCadastro.textContent = result.message || 'Erro no cadastro.';
            }
            mensagemCadastro.classList.add('erro');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mensagemCadastro.textContent = 'Erro ao se comunicar com o servidor.';
        mensagemCadastro.classList.add('erro');
    }
});


