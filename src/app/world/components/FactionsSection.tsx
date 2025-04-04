// components/FactionsSection.tsx
import Image from "next/image";
import React from "react";
// Assuming Faction type has _id, name, image, and description
import { Faction } from "@/services/gameService"; // Keep your import path

interface FactionsSectionProps {
  factions: Faction[];
}

export default function FactionsSection({ factions }: FactionsSectionProps) {
  const splitLastLetter = (text: string) => {
    if (!text || text.length === 0) {
      return { base: "", last: "" };
    }
    return {
      base: text.slice(0, -1),
      last: text.slice(-1),
    };
  };

  return (
    <div className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16 lg:mb-20 bg-gradient-to-r from-70% from-white to-zone-gold-lite bg-clip-text text-transparent">
        Factions
      </h2>

      <div className="space-y-12 md:space-y-16">
        {factions &&
          factions.map((faction) => (
            <div
              key={faction._id}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-10"
            >
              {/* Faction Logo */}
              {faction.image && (
                <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                    alt={`${faction._id} Logo`}
                    fill // Makes image fill the relative container
                    className="object-contain" // Use 'contain' to ensure the whole logo fits without cropping
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px" // Helps Next.js optimize image loading
                  />
                </div>
              )}

              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold uppercase text-white mb-3 md:mb-4">
                  {faction._id}
                </h3>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {faction.shortDescription}
                </p>
              </div>
            </div>
          ))}
        {!factions ||
          (factions.length === 0 && (
            <p className="text-gray-400 text-center md:text-left">
              No factions to display.
            </p>
          ))}
      </div>
    </div>
  );
}
