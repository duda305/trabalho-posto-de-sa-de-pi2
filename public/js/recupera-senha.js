const form = document.getElementById('recuperaForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Link de recuperação enviado!');
  window.location.href = './signin.html';
});
