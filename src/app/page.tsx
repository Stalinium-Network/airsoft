import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import EventsSection from "@/components/home/EventsSection";
import { publicApi } from "@/utils/api";

export const metadata: Metadata = {
  title: "Zone 37 | Immersive Airsoft Experience",
  description:
    "Join the ultimate 40-hour continuous immersion role-playing airsoft game.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch games from the server
  const games = await publicApi.getGames();

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Upcoming Events Section */}
      <EventsSection games={games.upcoming || []} />
    </div>
  );
}
