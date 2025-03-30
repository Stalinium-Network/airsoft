// Server component to fetch fractions data
import { Suspense } from "react";
import { Fraction } from "@/services/gameService";
import FractionsSectionClient from "./FractionsSectionClient";

// Function to fetch fractions from the server
async function getFractions(): Promise<Fraction[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fractions`, {
      next: { revalidate: 3600 }, // Revalidate once per hour (3600 seconds)
    });

    if (!res.ok) {
      console.error(
        "Failed to fetch fractions data:",
        res.status,
        res.statusText
      );
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching fractions data:", error);
    return [];
  }
}

// Component for loading placeholder
function FractionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl animate-pulse flex flex-col md:flex-row"
        >
          <div className="h-64 md:w-1/3 bg-gray-700"></div>
          <div className="p-6 md:w-2/3">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main server component
export default async function FractionsSection() {
  // Fetch fractions data
  const fractions = await getFractions();

  // Process data - ensure consistent image URLs
  const processedFractions = fractions.map((fraction) => ({
    ...fraction,
    // Format image URL based on source
    imageUrl: fraction.image?.startsWith("/")
      ? fraction.image
      : `${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`,
  }));

  return (
    <section id="fractions" className="py-20 px-4 w-screen bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            ZONE <span className="text-green-500">FRACTIONS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the various factions competing for power, resources, and
            artifacts in the Zone.
          </p>
        </div>
        <Suspense fallback={<FractionsSkeleton />} >
          <FractionsSectionClient fractions={processedFractions} />
        </Suspense>
      </div>
    </section>
  );
}
