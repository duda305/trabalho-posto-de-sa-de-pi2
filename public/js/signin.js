// js/signin.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginUsuario');
    const mensagemLogin = document.createElement('div');
    form.appendChild(mensagemLogin);
    mensagemLogin.style.marginTop = '10px';
    mensagemLogin.style.minHeight = '20px';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpa mensagens anteriores
        mensagemLogin.textContent = '';
        mensagemLogin.className = '';

        // Captura valores
        const email = form.email.value.trim();
        const senha = form.senha.value.trim();

        // Validação simples
        if (!email || !senha) {
            mensagemLogin.textContent = 'Preencha todos os campos!';
            mensagemLogin.style.color = 'red';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mensagemLogin.textContent = 'Email inválido!';
            mensagemLogin.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (response.ok) {
                // Salva token no localStorage
                localStorage.setItem('token', result.token);

                mensagemLogin.textContent = 'Login realizado com sucesso!';
                mensagemLogin.style.color = 'green';

                // Redireciona para home
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                mensagemLogin.textContent = result.message || 'Falha no login.';
                mensagemLogin.style.color = 'red';
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            mensagemLogin.textContent = 'Erro ao se comunicar com o servidor.';
            mensagemLogin.style.color = 'red';
        }
    });
});
