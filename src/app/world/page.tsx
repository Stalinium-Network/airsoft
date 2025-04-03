import { Metadata } from 'next';
import { Faction } from '@/services/gameService';
import IntroSection from './components/IntroSection';

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

// Metadata for the page
export const metadata: Metadata = {
  title: 'World | Zone 37',
  description: 'Explore the factions and lore of Zone 37 airsoft community',
  openGraph: {
    images: [{ url: '/open-graph.jpg' }],
  },
};

// Fetch factions data from the API
async function getFactions(): Promise<Faction[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/factions`, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch factions: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching factions:", error);
    return []; // Return empty array as fallback
  }
}

export default async function WorldPage() {
  // Fetch factions data
  const factions = await getFactions();
  
  return (
    <div className="min-h-screen text-white">
      <IntroSection />
    </div>
  );
}
