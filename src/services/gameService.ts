export interface Game {
  _id: any;
  name: string;
  date: string;
  location: string;
  coordinates: string;
  description: string;
  image: string;
  capacity: {
    total: number;
    filled: number;
  };
  price: number;
  isPast: boolean;
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
