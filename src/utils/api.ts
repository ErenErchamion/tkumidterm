import { auth } from './firebase';

const BASE_URL = 'http://localhost:8080/api';

async function getHeaders(requireAuth: boolean) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Error getting Firebase ID Token:', err);
      }
    }
  }

  return headers;
}

export const api = {
  async get<T>(path: string): Promise<T> {
    // Only request Firebase token for secure GET endpoints like order history or admin tasks
    const requireAuth = path === '/orders' || path.startsWith('/admin') || path.includes('/unanswered');
    const headers = await getHeaders(requireAuth);
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async post<T>(path: string, body: any): Promise<T> {
    const headers = await getHeaders(true);
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async put<T>(path: string, body?: any): Promise<T> {
    const headers = await getHeaders(true);
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async delete<T>(path: string): Promise<T> {
    const headers = await getHeaders(true);
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }
};
