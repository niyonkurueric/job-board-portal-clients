import { apiFetch } from './apiFetch';

export const login = async (email: string, password: string) => {
  const res = await apiFetch<any>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
  return (res as any).data;
};
