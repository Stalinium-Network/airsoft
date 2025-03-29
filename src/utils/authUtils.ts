export interface AdminTokenData {
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};