import { Metadata } from "next";
import { publicApi } from "@/utils/api";
import IntroSection from "./components/IntroSection";
import FactionDetails from "./components/FactionDetails";
import { Faction } from "@/services/gameService";

// Metadata for the page
export const metadata: Metadata = {
  title: "Zone 37 | Checklist",
  description: "Explore the factions and lore of Zone 37 airsoft community",
  openGraph: {
    images: [{ url: "/open-graph.jpg" }],
  },
};

export default async function WorldPage() {
  let factions: Faction[] = [];
  try {
    factions = await publicApi.getFactions({revalidate: 3600});
  } catch (err) {
    console.error("Ошибка загрузки фракций:", err);
  }

  return (
    <div className="min-h-screen text-white">
      <IntroSection />
      <FactionDetails factions={factions} />
    </div>
  );
}
