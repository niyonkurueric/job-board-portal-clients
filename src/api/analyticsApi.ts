import { apiFetch } from './apiFetch';

export async function fetchAnalytics() {
  return apiFetch(`/api/analytics`, {}, true);
}
