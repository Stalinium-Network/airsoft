import { Commander, Game } from '@/services/gameService';
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

// Public API methods - модифицированы для непосредственного возврата .data
export const publicApi = {
  getGames: async () => {
    const response = await axiosInstance.get('/games');
    return response.data;
  },
  getGame: async (id: string): Promise<Game> => {
    const response = await axiosInstance.get(`/games/${id}`);
    return response.data;
  },
  getFactions: async () => {
    const response = await axiosInstance.get('/factions');
    return response.data;
  },
  getLocations: async () => {
    const response = await axiosInstance.get('/locations');
    return response.data;
  },
  getLocation: async (id: string) => {
    const response = await axiosInstance.get(`/locations/${id}`);
    return response.data;
  },
  getNews: async (category?: string) => {
    const url = category && category !== 'all'
      ? `/news?category=${category}`
      : '/news';
    const response = await axiosInstance.get(url);
    return response.data;
  },
  getPinnedNews: async () => {
    const response = await axiosInstance.get('/news/pinned');
    return response.data;
  },
  getRecentNews: async (limit = 5) => {
    const response = await axiosInstance.get(`/news/recent?limit=${limit}`);
    return response.data;
  },
  getNewsItem: async (id: string) => {
    const response = await axiosInstance.get(`/news/${id}`);
    return response.data;
  },
  getNewsCategories: async () => {
    const response = await axiosInstance.get('/news/categories');
    return response.data;
  },
  // FAQ endpoints
  getFaqs: async () => {
    const response = await axiosInstance.get('/faqs');
    return response.data;
  },
  // Gallery endpoints
  getGalleryList: async () => {
    const response = await axiosInstance.get('/gallery/list');
    return response.data;
  },
  getImageDetails: async (filename: string) => {
    const response = await axiosInstance.get(`/gallery/details/${filename}`);
    return response.data;
  },
  getTeam: async (): Promise<Commander[]> => {
    const response = await axiosInstance.get('/team');
    return response.data;
  },
  // AI Assistant
  askAssistant: async (question: string) => {
    const response = await axiosInstance.post('/assistant/ask', { question });
    return response.data;
  },
};

// Admin-specific API methods - модифицированы для непосредственного возврата .data
export const adminApi = {
  // Game management
  getGames: async () => {
    const response = await axiosAuthInstance.get('/admin/game-list');
    return response.data;
  },
  getGame: async (id: string) => {
    const response = await axiosAuthInstance.get(`/admin/game/${id}`);
    return response.data;
  },
  createGame: async (gameData: any) => {
    const response = await axiosAuthInstance.post('/admin/create-game', gameData);
    return response.data;
  },
  createGameWithImage: async (formData: FormData) => {
    const response = await axiosAuthInstance.post('/admin/create-game', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateGame: async (gameId: string | number, gameData: any) => {
    const response = await axiosAuthInstance.put(`/admin/update-game/${gameId}`, gameData);
    return response.data;
  },
  updateGameWithImage: async (id: string | number, formData: FormData) => {
    const response = await axiosAuthInstance.put(`/admin/update-game/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteGame: async (id: string | number) => {
    const response = await axiosAuthInstance.delete(`/admin/delete-game/${id}`);
    return response.data;
  },
  
  // Card management
  getCardTypes: async (): Promise<{ types: string[] }> => {
    const response = await axiosAuthInstance.get('/admin/card-types');
    return response.data; // Ожидаемый формат: { types: ['timeline', 'starter-pack'] }
  },

  // Location endpoints
  getLocations: async () => {
    const response = await axiosAuthInstance.get('/admin/locations');
    return response.data;
  },
  getLocation: async (id: string) => {
    const response = await axiosAuthInstance.get(`/admin/location/${id}`);
    return response.data;
  },
  createLocation: async (formData: FormData) => {
    const response = await axiosAuthInstance.post('/admin/create-location', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateLocation: async (id: string, formData: FormData) => {
    const response = await axiosAuthInstance.put(`/admin/update-location/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteLocation: async (id: string) => {
    console.log(`API: Sending DELETE request to /admin/delete-location/${id}`);
    const response = await axiosAuthInstance.delete(`/admin/delete-location/${id}`);
    return response.data;
  },

  // Faction endpoints
  getFactions: async () => {
    const response = await axiosAuthInstance.get('/admin/factions');
    return response.data;
  },
  getFaction: async (id: string) => {
    const response = await axiosAuthInstance.get(`/admin/faction/${id}`);
    return response.data;
  },
  createFaction: async (formData: FormData) => {
    const response = await axiosAuthInstance.post('/admin/create-faction', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateFaction: async (id: string, formData: FormData) => {
    const response = await axiosAuthInstance.put(`/admin/update-faction/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteFaction: async (id: string) => {
    const response = await axiosAuthInstance.delete(`/admin/delete-faction/${id}`);
    return response.data;
  },

  // Authentication
  verifyToken: async () => {
    const response = await axiosAuthInstance.get('/admin/verify-token');
    return response.data;
  },

  // Методы для работы с новостями в админке
  getNewsList: async () => {
    const response = await axiosAuthInstance.get('/admin/news');
    return response.data;
  },
  getNewsItem: async (id: string) => {
    const response = await axiosAuthInstance.get(`/admin/news/${id}`);
    return response.data;
  },
  createNews: async (formData: FormData) => {
    // Убедимся, что Content-Type не устанавливается явно, чтобы браузер автоматически добавил boundary
    const response = await axiosAuthInstance.post('/admin/create-news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updateNews: async (id: string, formData: FormData) => {
    const response = await axiosAuthInstance.put(`/admin/update-news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteNews: async (id: string) => {
    const response = await axiosAuthInstance.delete(`/admin/delete-news/${id}`);
    return response.data;
  },

  // Team management endpoints
  getAdminTeamList: async () => {
    const response = await axiosAuthInstance.get('/admin/team');
    return response.data;
  },
  getTeamMember: async (id: string) => {
    const response = await axiosAuthInstance.get(`/admin/team/${id}`);
    return response.data;
  },
  createTeamMember: async (formData: FormData) => {
    const response = await axiosAuthInstance.post('/admin/create-team-member', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateTeamMember: async (id: string, formData: FormData) => {
    const response = await axiosAuthInstance.put(`/admin/update-team-member/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteTeamMember: async (id: string) => {
    const response = await axiosAuthInstance.delete(`/admin/delete-team-member/${id}`);
    return response.data;
  },

  // FAQ management endpoints
  getFaqs: async () => {
    const response = await axiosAuthInstance.get('/admin/faqs');
    return response.data;
  },
  createFaq: async (faqData: { question: string, answer: string }) => {
    const response = await axiosAuthInstance.post('/admin/create-faq', faqData);
    return response.data;
  },
  updateFaq: async (id: string, faqData: { question: string, answer: string }) => {
    const response = await axiosAuthInstance.put(`/admin/update-faq/${id}`, faqData);
    return response.data;
  },
  deleteFaq: async (id: string) => {
    const response = await axiosAuthInstance.delete(`/admin/delete-faq/${id}`);
    return response.data;
  },

  // Gallery management
  getGalleryImages: async () => {
    const response = await axiosAuthInstance.get('/admin/gallery/list');
    return response.data;
  },
  uploadGalleryImage: async (formData: FormData) => {
    const response = await axiosAuthInstance.post('/admin/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updateGalleryImage: async (filename: string, data: any) => {
    const response = await axiosAuthInstance.put(`/admin/gallery/update/${filename}`, data);
    return response.data;
  },
  deleteGalleryImage: async (filename: string) => {
    const response = await axiosAuthInstance.delete(`/admin/gallery/delete/${filename}`);
    return response.data;
  }
};
