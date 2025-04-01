import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GameFaction } from "@/services/gameService";
import HeroSection from "./components/HeroSection";
import GameDetailsSection from "./components/GameDetailsSection";
import RegistrationSection from "./components/RegistrationSection";
import LocationSection from "./components/LocationSection";

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

interface GameDetails {
  _id: string;
  name: string;
  date: string | Date;
  image: string;
  description: string;
  price: number;
  isPast: boolean;
  capacity?: {
    total: number;
    filled: number;
  };
  factions?: GameFaction[];
  location: {
    _id: string;
    coordinates: string;
    image?: string;
    description?: string;
  };
  detailedDescription: string;
  duration: number;
  registrationLink?: string;
}

// Fetch game data from API
async function getGameById(id: string): Promise<GameDetails> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch game: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
}

// Fix the metadata function signature
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const game = await getGameById(params.id);
    return {
      title: `${game.name} | Airsoft Event`,
      description: game.description,
      openGraph: {
        images: [{ url: process.env.NEXT_PUBLIC_IMAGES_URL + game.image }],
      },
    };
  } catch (error) {
    return {
      title: "Game Details | Airsoft",
      description: "Detailed information about an airsoft game event.",
    };
  }
}

// Main component
export default async function GameDetailPage({ params }: any) {
  let game: GameDetails;

  try {
    game = await getGameById(params.id);
  } catch (error) {
    return notFound();
  }

  // Calculate total capacity based on available data
  const getTotalCapacity = () => {
    // If using new factions structure
    if (game.factions && game.factions.length > 0) {
      const total = game.factions.reduce((sum, faction) => sum + faction.capacity, 0);
      const filled = game.factions.reduce((sum, faction) => sum + faction.filled, 0);
      return {
        total,
        filled,
        percentFilled: Math.round((filled / total) * 100),
        spotsLeft: total - filled,
        isFull: total <= filled
      };
    }
    
    // Fallback
    return { total: 0, filled: 0, percentFilled: 0, spotsLeft: 0, isFull: true };
  };
  
  const capacity = getTotalCapacity();
  
  // Определяем, заполнена ли игра полностью
  const isFull = capacity.isFull || capacity.spotsLeft <= 0;

  console.log(game)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section */}
      <HeroSection game={game} />

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <GameDetailsSection game={game} />
          </div>

          {/* Sidebar */}
          <div>
            <RegistrationSection 
              game={game} 
              capacity={capacity}
              isFull={isFull}
            />
            <LocationSection location={game.location} />
          </div>
        </div>
      </div>
    </div>
  );
}
