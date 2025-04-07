import React from "react";
import Image from "next/image";

export default function LionDenCollab() {
  return (
    <div className="bg-black/80 flex flex-col items-center justify-center p-4 font-sans rounded-xl">
      <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20 mb-8 md:mb-12">
        {/* --- Replace src with your actual logo paths --- */}
        <div className="flex-shrink-0">
          <Image
            src="/logo-z37.svg" // Replace with actual path to Zone 37 logo
            alt="Zone 37 Logo"
            width={160} // Adjust width as needed
            height={160} // Adjust height as needed
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/collab/lions-den.png" 
            alt="The Lion's Den Corporation Logo"
            width={200} // Adjust width as needed
            height={160} // Adjust height as needed
            className="object-contain"
            priority
          />
        </div>
        {/* --- End of logo replacement section --- */}
      </div>
      <p className="text-white text-center text-xl md:text-2xl lg:text-3xl max-w-4xl px-4">
        Zone 37 is making its debut in collaboration with the Lion's Den
        Corporation and is excited to introduce our first major game!
      </p>
    </div>
  );
}
