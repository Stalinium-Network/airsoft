export interface AdminTokenData {
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export const setAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adminToken', token);
};

export const removeAdminToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminToken');
};

export const isTokenValid = async (token: string): Promise<AdminTokenData | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAdminToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = new Headers(options.headers || {});
  headers.append('Authorization', `Bearer ${token}`);
  
  return fetch(url, {
    ...options,
    headers
  });
};
