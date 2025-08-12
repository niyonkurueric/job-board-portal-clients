import { apiFetch } from './apiFetch';

export async function fetchAnalytics() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${backendUrl}/api/analytics`, {}, true);
}
