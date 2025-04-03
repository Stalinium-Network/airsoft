import { Location } from './locationService';

// Базовая модель фракции - с camoSample
export interface Faction {
  _id: string;
  name?: string;
  image?: string;
  camoSample?: string; // Filename of the camo sample image
  shortDescription?: string;
  description?: string; // Full markdown description
}

// Расширенная модель для фракции внутри игры - с capacity, filled
export interface GameFaction extends Faction {
  capacity: number;
  filled: number;
  details: string; // Дополнительные детали фракции, например детали того что будет делать фракция в игре
}

// Новая структура информации о регистрации
export interface RegistrationInfo {
  link: string | null;
  opens: string | null; // Changed from Date to string
  closes: string | null; // Changed from Date to string
  status: 'not-open' | 'open' | 'closed'; // Registration status
  details: string;
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
  price: number;
  isPast: boolean;
  regInfo: RegistrationInfo; // New registration info structure replacing registrationLink
}

// Вспомогательная функция для определения, является ли превью URL-адресом
export function isPreviewUrl(preview: string): boolean {
  try {
    new URL(preview);
    return true;
  } catch {
    return false;
  }
}


// Extract YouTube video ID if it's a YouTube URL
export const getYoutubeVideoId = (url: string): string | null => {
  try {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Get YouTube thumbnail URL
export const getYoutubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

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
