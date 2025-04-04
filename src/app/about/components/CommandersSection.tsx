// components/CommandersSection.tsx
import React from "react";
import Image from "next/image";
import { Commander } from "@/services/gameService";

interface CommandersSectionProps {
  commanders: Commander[]; // Array of commander objects
}

export default function CommandersSection({
  commanders,
}: CommandersSectionProps) {
  // Basic validation
  if (!Array.isArray(commanders)) {
    console.error(
      "CommandersSection expects 'commanders' prop to be an array."
    );
    return (
      <div className="text-red-500 p-8">
        Error: Invalid commander data provided.
      </div>
    );
  }

  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-white">
      <h2 className="text-4xl mx-auto sm:text-5xl md:text-6xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-white from-70% to bg-zone-gold-lite-2 bg-clip-text text-transparent w-fit">
        Our Commanders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
        {commanders.map((commander) => (
          <div
            key={commander._id}
            className="bg-zone-dark-light rounded-xl p-6 md:p-8 flex flex-col items-center text-center"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
              {commander._id}
            </h3>

            <p className="text-base text-gray-400 uppercase tracking-wider mb-5">
              {commander.name}
            </p>

            <div className="relative w-48 h-48 md:w-52 md:h-52 mb-6 rounded-md overflow-hidden bg-gray-700">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/team/image/${commander.image}`} // Adjust path if necessary
                alt={`Portrait of ${commander.name}`}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-base text-gray-300 leading-relaxed">
              {commander.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
