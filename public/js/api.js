import Auth from './auth.js';

const domain = '/api'; // prefixo da API

// Função para tratar respostas da API
async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 401) Auth.signout(); // desloga automaticamente
    const errorText = await res.text();
    throw new Error(`Erro ${res.status}: ${errorText}`);
  }
  return res.status !== 204 ? await res.json() : null; // 204 No Content
}

// Retorna o header de autenticação se necessário
function getAuthHeader(auth) {
  return auth ? { Authorization: `Bearer ${Auth.getToken()}` } : {};
}

// -------------------- MÉTODOS --------------------

async function create(resource, data, auth = true, formData = false) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'POST',
    headers: { ...getAuthHeader(auth) },
    body: formData ? data : JSON.stringify(data),
  };

  if (!formData) config.headers['Content-Type'] = 'application/json; charset=UTF-8';

  const res = await fetch(url, config);
  return handleResponse(res);
}

async function read(resource, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'GET',
    headers: { ...getAuthHeader(auth) },
  };

  const res = await fetch(url, config);
  return handleResponse(res);
}

async function update(resource, data, auth = true, formData = false) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'PUT',
    headers: { ...getAuthHeader(auth) },
    body: formData ? data : JSON.stringify(data),
  };

  if (!formData) config.headers['Content-Type'] = 'application/json; charset=UTF-8';

  const res = await fetch(url, config);
  return handleResponse(res);
}

async function remove(resource, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'DELETE',
    headers: { ...getAuthHeader(auth) },
  };

  const res = await fetch(url, config);
  return handleResponse(res);
}

// -------------------- EXPORT --------------------
export default { create, read, update, remove };
