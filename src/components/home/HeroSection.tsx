import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative h-screen">
      <video
        src="/video.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Полупрозрачный верхний слой */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Градиентный переход для плавного перехода к контенту страницы */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zone-dark to-transparent z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <Image
          src="/logo-z37.svg"
          alt="Zone 37 Logo"
          width={200}
          height={200}
          className="mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          WELCOME TO ZONE 37
        </h1>
        <p className="text-lg md:text-2xl mb-10">
          40 hour continuous immersion role-playing airsoft game
        </p>
        <a
          href="#upcoming-events"
          className="px-8 py-4 bg-zone-gold text-zone-dark-brown font-bold rounded-lg hover:bg-zone-gold/80 transition-all transform hover:scale-105 shadow-lg"
        >
          EXPLORE OUR WORLD
        </a>
      </div>
    </div>
  );
}