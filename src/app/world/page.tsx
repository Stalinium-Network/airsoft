import { Metadata } from "next";
import { Faction } from "@/services/gameService";
import IntroSection from "./components/IntroSection";
import FactionsSection from "./components/FactionsSection";
import GameFeaturesSection from "./components/GameFeaturesSection";
import GameItemsSection from "./components/GameItemsSection";
import EventsSection from "@/components/home/EventsSection";
import { publicApi } from "@/utils/api";

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

// Metadata for the page
export const metadata: Metadata = {
  title: "Zone 37 | World",
  description: "Explore the factions and lore of Zone 37 airsoft community",
  openGraph: {
    images: [{ url: "/open-graph.jpg" }],
  },
};

export default async function WorldPage() {
  const factions = await publicApi.getFactions();
  const games = await publicApi.getGames();

  return (
    <div className="min-h-screen text-white">
      <IntroSection />
      <FactionsSection factions={factions} />
      <GameFeaturesSection />
      <GameItemsSection />
      <EventsSection games={games.upcoming} />
    </div>
  );
}
