'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GalleryHero() {
  return (
    <section className="relative h-[50vh] overflow-hidden flex items-center justify-center w-screen">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 w-full">
        <Image
          src="/gallery-hero.jpg"
          alt="STALKER Airsoft Gallery"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            THE <span className="text-green-500">ARCHIVES</span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-6 text-gray-300">
            Memories captured from the heart of the Zone
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#111827" 
            fillOpacity="1" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,170.7C960,139,1056,85,1152,80C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
          </path>
        </svg>
      </div>
    </section>
  );
}
