import axios from 'axios';
import { NewsItem, mapNewsData } from '@/services/newsService';
import { Game } from '@/services/gameService';

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
