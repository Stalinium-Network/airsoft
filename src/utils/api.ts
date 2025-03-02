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

// Admin-specific API methods
export const adminApi = {
  // Game management
  getGames: () => api.get('/admin/game-list'),
  createGame: (gameData: any) => api.post('/admin/create-game', gameData),
  updateGame: (gameId: string | number, gameData: any) => 
    api.put(`/admin/update-game/${gameId}`, gameData),
  deleteGame: (gameId: string | number) => 
    api.delete(`/admin/delete-game/${gameId}`),
  
  // Updated methods for handling file uploads
  createGameWithImage: (formData: FormData) => {
    // Make sure the auth interceptor will add the token
    return api.post('/admin/create-game', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization header will be added by interceptor
      }
    });
  },
  
  updateGameWithImage: (gameId: string | number, formData: FormData) => {
    // Make sure the game ID is included in the URL
    return api.put(`/admin/update-game/${gameId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization header will be added by interceptor
      }
    });
  },
  
  // Authentication
  verifyToken: () => api.get('/admin/verify-token'),
};

// Public API methods
export const publicApi = {
  getGames: () => api.get('/games'),
};
