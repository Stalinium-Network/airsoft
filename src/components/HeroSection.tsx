'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden w-screen">
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden w-screen">
        <video 
          autoPlay 
          muted 
          loop 
          className="absolute w-screen min-h-full object-cover"
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{ 
            filter: 'brightness(0.5)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            WELCOME TO <span className="text-green-500">ZONE 37</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Survive, explore, and conquer in our STALKER-inspired airsoft events.
            Enter the Zone at your own risk, stalker.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors"
          >
            JOIN THE NEXT RAID
          </motion.button>
        </motion.div>
      </div>

      {/* Scrolldown indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
