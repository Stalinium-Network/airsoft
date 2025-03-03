export const dynamic = "force-dynamic";

import GameList from "./GameList";
import { publicApi } from '@/utils/api';

interface Game {
  id: number;
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

export default async function GameSection() {
  // Fetch games from the API using axios
  const response = await publicApi.getGames()
    .catch(error => {
      console.error('Error fetching games:', error);
      return { data: { past: [], upcoming: [] } };
    });

  const gamesData = response.data;

  return (
    <section className="py-20 px-4 w-screen">
      <h2 className="text-4xl font-bold text-center mb-12">
        OUR <span className="text-green-500">EVENTS</span>
      </h2>

      {/* Pass the fetched data to the client component for interactive filtering */}
      <GameList pastGames={gamesData.past} upcomingGames={gamesData.upcoming} />
    </section>
  );
}
