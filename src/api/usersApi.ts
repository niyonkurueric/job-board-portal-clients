
import { apiFetch } from './apiFetch';

export async function getAllUsers() {
  return apiFetch(`/api/auth/users`, {}, true);
}