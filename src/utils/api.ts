import { Commander, Faction, Game } from '@/services/gameService';
import { NewsCategory, NewsItem } from '@/services/newsService';
import axios from 'axios';
import { FAQ } from './api-server';
import { Location } from '@/services/locationService';

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

/**
 * Example: ```await publicApi.getGame(params.id, { revalidate: 3600 }) ```
 */
const nativeFetch = async (url: string, options: RequestInit['next'] = {}) => {
  return fetch(url, { next: options }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

// Public API methods - модифицированы для непосредственного возврата .data
export const publicApi = {
  getGames: async (options?: RequestInit['next']): Promise<{ past: Game[]; upcoming: Game[] }> => {
    const response = await nativeFetch(`${API_URL}/games`, options);
    return response;
  },
  getGame: async (id: string, options?: RequestInit['next']): Promise<Game> => {
    const response = await nativeFetch(`${API_URL}/games/${id}`, options);
    return response;
  },
  getFactions: async (options?: RequestInit['next']): Promise<Faction[]> => {
    const response = await nativeFetch(`${API_URL}/factions`, options);
    return response || [];
  },
  getLocations: async (options?: RequestInit['next']): Promise<Location[]> => {
    const response = await nativeFetch(`${API_URL}/locations`, options);
    return response;
  },
  getLocation: async (id: string, options?: RequestInit['next']): Promise<Location> => {
    const response = await nativeFetch(`${API_URL}/locations/${id}`, options);
    return response;
  },
  getNews: async (category?: string, options?: RequestInit['next']): Promise<NewsItem[]> => {
    const url = category && category !== "all" ? `/news?category=${category}` : "/news";
    const response = await nativeFetch(`${API_URL}${url}`, options);
    return response;
  },
  getPinnedNews: async (options?: RequestInit['next']): Promise<NewsItem[]> => {
    const response = await nativeFetch(`${API_URL}/news/pinned`, options);
    return response;
  },
  getRecentNews: async (limit = 5, options?: RequestInit['next']): Promise<NewsItem[]> => {
    const response = await nativeFetch(`${API_URL}/news/recent?limit=${limit}`, options);
    return response;
  },
  getNewsItem: async (id: string, options?: RequestInit['next']): Promise<NewsItem> => {
    const response = await nativeFetch(`${API_URL}/news/${id}`, options);
    return response;
  },
  getNewsCategories: async (options?: RequestInit['next']): Promise<NewsCategory[]> => {
    const response = await nativeFetch(`${API_URL}/news/categories`, options);
    return response;
  },
  // FAQ endpoints
  getFaqs: async (options?: RequestInit['next']): Promise<FAQ[]> => {
    const response = await nativeFetch(`${API_URL}/faqs`, options);
    return response;
  },
  // Gallery endpoints
  getGalleryList: async (options?: RequestInit['next']) => {
    const response = await nativeFetch(`${API_URL}/gallery/list`, options);
    return response;
  },
  getImageDetails: async (filename: string, options?: RequestInit['next']) => {
    const response = await nativeFetch(`${API_URL}/gallery/details/${filename}`, options);
    return response;
  },
  getTeam: async (options?: RequestInit['next']): Promise<Commander[]> => {
    const response = await nativeFetch(`${API_URL}/team`, options);
    return response;
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
    return response.data; // Ожидаемый формат: { types: ['timeline', 'starter_pack'] }
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
