import apiFetch from './api.js';

export async function registerUser(data) {
  // data: { name, email, password }
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function loginUser(data) {
  // data: { email, password }
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
