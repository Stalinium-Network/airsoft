import React from "react";
import Image from "next/image";
import { Faction } from "@/services/gameService";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function FactionDetails({ factions }: { factions: Faction[] }) {
  if (!Array.isArray(factions)) {
    console.error("FactionDetails expects 'factions' prop to be an array.");
    return (
      <div className="text-red-500 p-8">
        Error: Invalid faction data provided.
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24 py-16 px-4 sm:px-6 lg:px-8 text-white flex flex-col md:items-center">
      {factions.map((faction) => {
        return (
          <div
            key={faction._id}
            className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-12"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 xl:w-72 xl:h-72 flex-shrink-0 md:mx-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/factions/image/${faction.image}`}
                alt={`${faction._id} Logo`}
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full">
              <p className="text-xs font-semibold uppercase text-zone-gold-lite tracking-wider mb-1">
                Uniform & Gear
              </p>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {faction._id}
              </h3>

              <div className="mb-6  max-w-5xl">
                <div className="relative w-full aspect-[4/1] border border-gray-700 rounded-md overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/factions/camo-image/${faction.camoSample}`}
                    alt={`${faction._id} Camo Pattern`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="prose prose-base prose-invert max-w-5xl text-gray-300 prose-headings:text-white prose-strong:text-white">
                <MarkdownRenderer content={faction.description} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
