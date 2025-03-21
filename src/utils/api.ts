import axios from 'axios';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Only in client-side code
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public API methods
export const publicApi = {
  getGames: () => api.get('/games'),
  getLocations: () => api.get('/locations'),
  getLocation: (id: string) => api.get(`/locations/${id}`),
  getFractions: () => api.get('/fractions'),
  getFraction: (id: string) => api.get(`/fractions/${id}`)
};

// Admin-specific API methods
export const adminApi = {
  // Game management
  getGames: () => api.get('/admin/game-list'),
  getGame: (id: string) => api.get(`/admin/game/${id}`),
  createGame: (gameData: any) => api.post('/admin/create-game', gameData),
  createGameWithImage: (formData: FormData) => {
    return api.post('/admin/create-game', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateGame: (gameId: string | number, gameData: any) => 
    api.put(`/admin/update-game/${gameId}`, gameData),
  updateGameWithImage: (id: string | number, formData: FormData) => {
    return api.put(`/admin/update-game/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteGame: (id: string | number) => api.delete(`/admin/delete-game/${id}`),
  
  // Location endpoints
  getLocations: () => api.get('/admin/locations'),
  getLocation: (id: string) => api.get(`/admin/location/${id}`),
  createLocation: (formData: FormData) => {
    return api.post('/admin/create-location', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateLocation: (id: string, formData: FormData) => {
    return api.put(`/admin/update-location/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteLocation: (id: string) => {
    console.log(`API: Sending DELETE request to /admin/delete-location/${id}`);
    return api.delete(`/admin/delete-location/${id}`);
  },
  
  // Fraction endpoints
  getFractions: () => api.get('/admin/fractions'),
  getFraction: (id: string) => api.get(`/admin/fraction/${id}`),
  createFraction: (formData: FormData) => {
    return api.post('/admin/create-fraction', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateFraction: (id: string, formData: FormData) => {
    return api.put(`/admin/update-fraction/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteFraction: (id: string) => api.delete(`/admin/delete-fraction/${id}`),

  // Authentication
  verifyToken: () => api.get('/admin/verify-token'),
};
