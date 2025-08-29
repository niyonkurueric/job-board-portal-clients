import { apiFetch } from './apiFetch';

export const loginWithGoogle = async (idToken: string) => {
  return apiFetch(`/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
};
