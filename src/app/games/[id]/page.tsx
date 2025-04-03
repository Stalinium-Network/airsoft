import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Game, GameFaction, RegistrationInfo, isPreviewUrl } from "@/services/gameService";
import HeroSection from "./components/HeroSection";
import LocationSection from "./components/LocationSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import RegistrationSection from "./components/RegistrationSection";
import { Location } from "@/services/locationService";
import OldHeroSection from "./components/OldHeroSection";

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;


// Fetch game data from API
async function getGameById(id: string): Promise<Game> {
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
    
    // Generate image URL based on preview type (file or YouTube URL)
    const imageUrl = isPreviewUrl(game.preview) 
      ? game.preview // If it's already a URL, use it directly
      : `${process.env.NEXT_PUBLIC_IMAGES_URL}${game.preview}`; // Otherwise, construct URL for image file

    return {
      title: `${game.name} | Airsoft Event`,
      description: game.description,
      openGraph: {
        images: [{ url: imageUrl }],
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
  let game: Game;

  try {
    game = await getGameById(params.id);
  } catch (error) {
    return notFound();
  }

  return (
    <div className="min-h-screen text-white">
      {/* Hero section */}
      {/* <HeroSection game={game} /> */}

      {/* Location section */}

      <div className="max-w-7xl text-base mx-auto p-6 md:p-8 mt-24">
        <OldHeroSection game={game}/>
        <LocationSection location={game.location as Location} />
        <MarkdownRenderer content={game.detailedDescription} />
        {/* Registration section */}
        <RegistrationSection
          regInfo={game.regInfo}
          factions={game.factions}
        />
      </div>
    </div>
  );
}
