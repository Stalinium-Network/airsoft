import axios from 'axios';
import { NewsItem, mapNewsData } from '@/services/newsService';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define FAQ interface
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

// Создаем серверный экземпляр axios
const serverAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Серверные методы API, которые будут вызываться в Server Components
export const serverApi = {
  // Получение всех новостей
  async getNews(category?: string): Promise<NewsItem[]> {
    try {
      const url = category && category !== 'all' 
        ? `/news?category=${category}`
        : '/news';
      
      const response = await serverAxios.get(url);
      return response.data.map(mapNewsData);
    } catch (error) {
      console.error('Error fetching news from server:', error);
      return [];
    }
  },
  
  // Получение закрепленных новостей
  async getPinnedNews(): Promise<NewsItem[]> {
    try {
      const response = await serverAxios.get('/news/pinned');
      return response.data.map(mapNewsData);
    } catch (error) {
      console.error('Error fetching pinned news from server:', error);
      return [];
    }
  },
  
  // Получение одной новости по ID
  async getNewsItem(id: string): Promise<NewsItem | null> {
    try {
      const response = await serverAxios.get(`/news/${id}`);
      return mapNewsData(response.data);
    } catch (error) {
      console.error(`Error fetching news item ${id} from server:`, error);
      return null;
    }
  },
  
  // Получение недавних новостей
  async getRecentNews(limit = 5): Promise<NewsItem[]> {
    try {
      const response = await serverAxios.get(`/news/recent?limit=${limit}`);
      return response.data.map(mapNewsData);
    } catch (error) {
      console.error('Error fetching recent news from server:', error);
      return [];
    }
  },
  
  // Получение категорий новостей
  async getNewsCategories() {
    try {
      const response = await serverAxios.get('/news/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching news categories from server:', error);
      return [];
    }
  },
  
  // Получение игр
  async getGames() {
    try {
      const response = await serverAxios.get('/games');
      return response.data;
    } catch (error) {
      console.error('Error fetching games from server:', error);
      return { past: [], upcoming: [] };
    }
  },

  // Получение всех FAQ
  async getFaqs(): Promise<FAQ[]> {
    try {
      const response = await serverAxios.get('/faqs');
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs from server:', error);
      return [];
    }
  },

};
