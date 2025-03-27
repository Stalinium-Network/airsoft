import axios from 'axios';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instances
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosAuthInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
axiosAuthInstance.interceptors.request.use(
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
  getGames: () => axiosInstance.get('/games'),
  getLocations: () => axiosInstance.get('/locations'),
  getLocation: (id: string) => axiosInstance.get(`/locations/${id}`),
  getNews: (category?: string) => {
    const url = category && category !== 'all' 
      ? `/news?category=${category}`
      : '/news';
    return axiosInstance.get(url);
  },
  getPinnedNews: () => {
    return axiosInstance.get('/news/pinned');
  },
  getRecentNews: (limit = 5) => {
    return axiosInstance.get(`/news/recent?limit=${limit}`);
  },
  getNewsItem: (id: string) => {
    return axiosInstance.get(`/news/${id}`);
  },
  getNewsCategories: () => {
    return axiosInstance.get('/news/categories');
  },
};

// Admin-specific API methods
export const adminApi = {
  // Game management
  getGames: () => axiosAuthInstance.get('/admin/game-list'),
  getGame: (id: string) => axiosAuthInstance.get(`/admin/game/${id}`),
  createGame: (gameData: any) => axiosAuthInstance.post('/admin/create-game', gameData),
  createGameWithImage: (formData: FormData) => {
    return axiosAuthInstance.post('/admin/create-game', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateGame: (gameId: string | number, gameData: any) => 
    axiosAuthInstance.put(`/admin/update-game/${gameId}`, gameData),
  updateGameWithImage: (id: string | number, formData: FormData) => {
    return axiosAuthInstance.put(`/admin/update-game/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteGame: (id: string | number) => axiosAuthInstance.delete(`/admin/delete-game/${id}`),
  
  // Location endpoints
  getLocations: () => axiosAuthInstance.get('/admin/locations'),
  getLocation: (id: string) => axiosAuthInstance.get(`/admin/location/${id}`),
  createLocation: (formData: FormData) => {
    return axiosAuthInstance.post('/admin/create-location', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateLocation: (id: string, formData: FormData) => {
    return axiosAuthInstance.put(`/admin/update-location/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteLocation: (id: string) => {
    console.log(`API: Sending DELETE request to /admin/delete-location/${id}`);
    return axiosAuthInstance.delete(`/admin/delete-location/${id}`);
  },
  
  // Fraction endpoints
  getFractions: () => axiosAuthInstance.get('/admin/fractions'),
  getFraction: (id: string) => axiosAuthInstance.get(`/admin/fraction/${id}`),
  createFraction: (formData: FormData) => {
    return axiosAuthInstance.post('/admin/create-fraction', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateFraction: (id: string, formData: FormData) => {
    return axiosAuthInstance.put(`/admin/update-fraction/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteFraction: (id: string) => axiosAuthInstance.delete(`/admin/delete-fraction/${id}`),
  
  // Authentication
  verifyToken: () => axiosAuthInstance.get('/admin/verify-token'),

  // Методы для работы с новостями в админке
  getNewsList: () => {
    return axiosAuthInstance.get('/admin/news');
  },
  getNewsItem: (id: string) => {
    return axiosAuthInstance.get(`/admin/news/${id}`);
  },
  createNews: (formData: FormData) => {
    // Убедимся, что Content-Type не устанавливается явно, чтобы браузер автоматически добавил boundary
    return axiosAuthInstance.post('/admin/create-news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateNews: (id: string, formData: FormData) => {
    return axiosAuthInstance.put(`/admin/update-news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteNews: (id: string) => {
    return axiosAuthInstance.delete(`/admin/delete-news/${id}`);
  },
  
  // Team management endpoints
  getAdminTeamList: () => axiosAuthInstance.get('/admin/team'),
  getTeamMember: (id: string) => axiosAuthInstance.get(`/admin/team/${id}`),
  createTeamMember: (formData: FormData) => {
    return axiosAuthInstance.post('/admin/create-team-member', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateTeamMember: (id: string, formData: FormData) => {
    return axiosAuthInstance.put(`/admin/update-team-member/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteTeamMember: (id: string) => axiosAuthInstance.delete(`/admin/delete-team-member/${id}`),
};
