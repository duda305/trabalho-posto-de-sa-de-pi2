import Auth from './auth.js'; 

const domain = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 401) {
      Auth.signout(); // Desloga se não autorizado
    }
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
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...getAuthHeader(auth),
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, config);
  return await handleResponse(res);
}

async function read(resource, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'GET',
    mode: 'cors',
    headers: {
      ...getAuthHeader(auth),
    },
  };

  const res = await fetch(url, config);
  return await handleResponse(res);
}

async function update(resource, data, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...getAuthHeader(auth),
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, config);
  return await handleResponse(res);
}

async function remove(resource, auth = true) {
  const url = `${domain}${resource}`;
  const config = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      ...getAuthHeader(auth),
    },
  };

  const res = await fetch(url, config);
  return await handleResponse(res);
}

export default { create, read, update, remove };
