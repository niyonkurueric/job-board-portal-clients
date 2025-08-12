export const login = async (email: string, password: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Login failed');
  }
  return data.data;
};
