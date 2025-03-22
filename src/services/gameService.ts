import { Location } from './locationService';

// Базовая модель фракции - без registrationLink
export interface Fraction {
  _id: string;
  name?: string;
  image?: string;
  shortDescription?: string; 
  description?: string; // Full markdown description
}

// Расширенная модель для фракции внутри игры - с capacity, filled и registrationLink
export interface GameFraction extends Fraction {
  capacity: number;
  filled: number;
  registrationLink?: string; // Скрыто, но оставлено для будущего использования
}

export interface Game {
  _id: any;
  name: string;
  date: Date;
  duration: number;   // Duration in hours
  location: Location | string; // Can be a full Location object or just a location ID (name)
  description: string;  // Short description
  detailedDescription?: string;  // Detailed description
  image: string;
  // Используем GameFraction вместо Fraction для игр
  fractions: GameFraction[];
  price: number;
  isPast: boolean;
  registrationLink?: string; // Новое поле для общей ссылки регистрации
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
