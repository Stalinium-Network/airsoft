'use client'
import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import GameSection from '@/components/GameSection';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="container w-screen">

        <HeroSection />
        <div className='px-auto flex flex-col items-center justify-center w-screen'>
          <GameSection />
          <FeatureSection />
          <Footer />
        </  div>
      </motion.div>
    </div >
  );
}
