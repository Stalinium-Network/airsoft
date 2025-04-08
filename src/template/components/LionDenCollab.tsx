import React from "react";
import Image from "next/image";

export default function LionDenCollab() {
  return (
    <div className="bg-black/80 flex flex-col items-center justify-center p-4 py-10 font-sans rounded-xl">
      <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 mb-8 md:mb-12 overflow-hidden">
        <div className="flex-shrink max-w-[160px] md:max-w-[200px] w-full">
          <Image
            src="/logo-z37.svg"
            alt="Zone 37 Logo"
            width={200}
            height={160}
            className="object-contain h-24 lg:h-32"
            priority
          />
        </div>
        <div className="flex-shrink max-w-[160px] md:max-w-[200px] w-full">
          <Image
            src="/collab/lions-den.png"
            alt="The Lion's Den Corporation Logo"
            width={200}
            height={160}
            className="object-contain h-24 lg:h-32"
            priority
          />
        </div>
      </div>
      <p className="text-white text-center text-xl md:text-2xl lg:text-3xl max-w-4xl px-4">
        Zone 37 is making its debut in collaboration with the Lion's Den
        Corporation and is excited to introduce our first major game!
      </p>
    </div>
  );
}