import { AvailableTemplatesType } from '@/template';
import { Location } from './locationService';

// Базовая модель фракции - с camoSample
export interface Faction {
  _id: string;
  image: string;
  camoSample: string; // Filename of the camo sample image
  shortDescription: string;
  description: string; // Full markdown description
}

// Расширенная модель для фракции внутри игры - с capacity, filled
export interface GameFaction extends Faction {
  capacity: number;
  filled: number;
  details: string; // Дополнительные детали фракции, например детали того что будет делать фракция в игре
}

// Card interface for games
export interface Card {
  title: string;
  svgContent: string;
  content: string;
}

// Cards dictionary interface
export type Cards = {
  [key: string]: Card;
};

// Структура для периода цен
export interface PricePeriod {
  starts: string; // ISO date string
  ends?: string; // ISO date string, optional for last tier
  price: number;
}

// Обновленная структура информации о регистрации (без opens и closes)
export interface RegistrationInfo {
  link: string | null;
  details: string;
  status: 'not-open' | 'open' | 'closed';
}

export interface Game {
  _id: any;
  name: string;
  date: string; // Changed from Date to string
  duration: number;   // Duration in hours
  location: Location | string; // Can be a full Location object or just a location ID (name)
  description: string;  // Short description
  detailedDescription: string;  // Detailed description
  preview: string;  // Changed from 'image' - can be a filename or YouTube URL
  // Используем GameFaction вместо Faction для игр
  factions: GameFaction[];
  prices: PricePeriod[]; // Dynamic pricing model
  currentPrice: number | null; // Current applicable price
  isPast: boolean;
  regInfo: RegistrationInfo; // Updated registration info structure
  templates: AvailableTemplatesType[]; // Array of template IDs
  cards?: Cards; // Cards for the game
}

export type Commander = {
  _id: string;
  name: string;
  image: string;
  description: string;
}

// Вспомогательная функция для определения, является ли превью URL-адресом
export function isPreviewUrl(preview: string): boolean {
  if (!preview) return false;
  try {
    // Check if it's a YouTube link
    return preview.includes('youtube.com') || preview.includes('youtu.be');
  } catch (error) {
    return false;
  }
}

// Extract YouTube video ID from URL
export function getYoutubeVideoId(url: string): string | null {
  try {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

// Get YouTube thumbnail URL
export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export interface GamesResponse {
  past: Game[];
  upcoming: Game[];
}

// Mock data for fallback
const mockGames: GamesResponse = {
  past: [],
  upcoming: []
};

export async function fetchGames(): Promise<GamesResponse> {
  try {
    // In a true server component, this runs on the server during build or request time
    const response = await fetch(`${process.env.API_LOCAL_URL}/games`, {
      cache: 'no-store' // For SSR it's better to use no-store and handle your own cache strategy
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching games:', error);
    // Return mock data as fallback
    return mockGames;
  }
}
