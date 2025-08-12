export const register = async (name: string, email: string, password: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  const res = await fetch(`${backendUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Registration failed');
  }
  return data;
};
