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
  past: [
    {
      _id: 4,
      name: "Clearsky Offensive",
      date: "September 12, 2023",
      location: "Urban Zone, Kharkiv",
      coordinates: "50.0051,36.2310",
      description: "Epic battle that took place in the urban ruins. Teams fought for control of artifacts.",
      image: "https://images.unsplash.com/photo-1518407613690-d9fc990e795f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      capacity: { total: 45, filled: 45 },
      price: 70,
      isPast: true
    }
  ],
  upcoming: [
    {
      _id: 1,
      name: "Operation: Red Forest",
      date: "October 15, 2023",
      location: "Abandoned Factory, Kiev",
      coordinates: "50.4501,30.5234",
      description: "Navigate through radioactive zones and hunt for artifacts in this scenario inspired by the Red Forest.",
      image: "https://images.unsplash.com/photo-1578876773714-23a143fa1e0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      capacity: { total: 50, filled: 35 },
      price: 75,
      isPast: false
    },
    {
      _id: 2,
      name: "Raid on Pripyat",
      date: "November 5, 2023",
      location: "Woodland Arena, Odessa",
      coordinates: "46.4825,30.7233",
      description: "Join the faction war in the heart of the Zone. Collect artifacts and establish dominance.",
      image: "https://images.unsplash.com/photo-1577188949561-1ce1bc6ccc9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      capacity: { total: 40, filled: 18 },
      price: 65,
      isPast: false
    },
    {
      _id: 3,
      name: "Monolith Rising",
      date: "November 20, 2023",
      location: "Military Base, Lviv",
      coordinates: "49.8397,24.0297",
      description: "Face dangerous anomalies and enemy stalkers as you venture deep into uncharted territory.",
      image: "https://images.unsplash.com/photo-1579702493440-8b1b56d47e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      capacity: { total: 30, filled: 5 },
      price: 80,
      isPast: false
    }
  ]
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
