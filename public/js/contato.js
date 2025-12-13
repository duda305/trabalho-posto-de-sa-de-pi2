fetch('/api/contato', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}` // se estiver logado
  },
  body: JSON.stringify({
    nome,
    email,
    mensagem
  })
});
