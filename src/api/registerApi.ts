import { apiFetch } from './apiFetch';

export const register = async (name: string, email: string, password: string) => {
  return apiFetch(`/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};
