import React from "react";
import Image from "next/image";

const IntroSection = () => {
  return (
    <div className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-6">
          <span className="bg-gradient-to-r from-white from-70% to-zone-gold-lite bg-clip-text text-transparent">
            For players, by players
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-6xl mx-auto leading-relaxed">
          We're a passionate team of seasoned airsoft players from California
          who've grown tired of the same force-on-force and session games. Now,
          we're on a mission to elevate your airsoft experience with
          adrenaline-pumping, immersive gameplay that takes you beyond the
          ordinary.
        </p>
        <p className="text-base text-gray-300">Ready to level up your game?</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src="/about-hero.jpg"
            alt="Team of airsoft players posing outdoors"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
