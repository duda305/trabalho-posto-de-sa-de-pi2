import Auth from './auth.js';

const domain = '/api'; // importante: garante que todas as requisições vão para /api

async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 401) Auth.signout(); // se não autorizado, desloga
    const errorText = await res.text();
    throw new Error(`Erro ${res.status}: ${errorText}`);
  }
  return await res.json();
}

function getAuthHeader(auth) {
  return auth ? { Authorization: `Bearer ${Auth.getToken()}` } : {};
}

async function create(resource, data, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(auth),
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, config);
  return await handleResponse(res);
}

export default { create };
