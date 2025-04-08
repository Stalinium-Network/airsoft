import { Metadata } from "next";
import { publicApi } from "@/utils/api";
import IntroSection from "./components/IntroSection";
import CommandersSection from "./components/CommandersSection";
import { Commander } from "@/services/gameService";

// Metadata for the page
export const metadata: Metadata = {
  title: "Zone 37 | World",
  description: "Explore the factions and lore of Zone 37 airsoft community",
  openGraph: {
    images: [{ url: "/open-graph.jpg" }],
  },
};

export default async function WorldPage() {
  let commanders: Commander[] = [];
  
  try {
    commanders = await publicApi.getTeam({revalidate: 3600});
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen text-white">
      <IntroSection />
      <CommandersSection commanders={commanders} />
    </div>
  );
}
