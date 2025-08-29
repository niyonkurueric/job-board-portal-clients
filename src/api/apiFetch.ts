// Reusable API fetch utility for all endpoints
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetch<T>(url: string, options: RequestInit = {}, requireAuth = false): Promise<T> {
  // Always use a plain object for headers
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      headers = { ...headers, ...options.headers };
    }
  }
  let token = localStorage.getItem('token');
  if (requireAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const requestUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const res = await fetch(requestUrl, { ...options, headers });
  if ((res.status === 401 || res.status === 403) && requireAuth) {
    // Only redirect if user is currently authenticated
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const err = await res.json();
      msg = err.message || msg;
    } catch {}
    const error: any = new Error(msg);
    error.status = res.status;
    throw error;
  }
  return res.json();
}
