export const loginWithGoogle = async (idToken: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  const res = await fetch(`${backendUrl}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Google login failed');
  }
  return data;
};
