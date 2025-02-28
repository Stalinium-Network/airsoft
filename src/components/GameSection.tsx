import { fetchGames } from "@/services/gameService";
import GameList from "./GameList";

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
  // Fetch games from the API
  const gamesData = await fetchGames();

  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">
        OUR <span className="text-green-500">EVENTS</span>
      </h2>

      {/* Pass the fetched data to the client component for interactive filtering */}
      <GameList pastGames={gamesData.past} upcomingGames={gamesData.upcoming} />
    </section>
  );
}
