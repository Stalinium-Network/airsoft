import { Metadata } from "next";
import { Faction } from "@/services/gameService";
import IntroSection from "./components/IntroSection";
import FactionsSection from "./components/FactionsSection";
import GameFeaturesSection from "./components/GameFeaturesSection";
import GameItemsSection from "./components/GameItemsSection";
import EventsSection from "@/components/home/EventsSection";
import { publicApi } from "@/utils/api";


// Metadata for the page
export const metadata: Metadata = {
  title: "Zone 37 | World",
  description: "Explore the factions and lore of Zone 37 airsoft community",
  openGraph: {
    images: [{ url: "/open-graph.jpg" }],
  },
};

export default async function WorldPage() {
  let factions: Faction[] = [];
  let games: any = { upcoming: [] };

  try {
    factions = await publicApi.getFactions({revalidate: 3600});
  } catch (err) {
    console.error("Ошибка загрузки фракций:", err);
  }

  try {
    games = await publicApi.getGames({revalidate: 3600});
  } catch (err) {
    console.error("Ошибка загрузки игр:", err);
  }

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
