'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Fraction } from '@/services/gameService';
import { useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface FractionWithImageUrl extends Fraction {
  imageUrl: string;
}

interface FractionsSectionClientProps {
  fractions: FractionWithImageUrl[];
}

export default function FractionsSectionClient({ fractions }: FractionsSectionClientProps) {
  const [expandedFraction, setExpandedFraction] = useState<string | null>(null);

  const toggleFraction = (id: string) => {
    if (expandedFraction === id) {
      setExpandedFraction(null);
    } else {
      setExpandedFraction(id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10">
      {fractions.map((fraction, index) => (
        <motion.div 
          key={fraction._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`bg-gray-800/90 rounded-xl overflow-hidden shadow-2xl ${
            expandedFraction === fraction._id 
              ? 'border-l-4 border-green-400 shadow-green-400/20' 
              : 'border-l-4 border-green-600 hover:border-green-500'
          } transition-all duration-300 relative`}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" 
          }}
        >
          {/* Decorative angle in corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/20 to-transparent z-10"></div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left image section */}
            <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
              {fraction.image && (
                <Image
                  src={fraction.imageUrl}
                  alt={fraction._id}
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent"></div>
            </div>
            
            {/* Right content section */}
            <div className="p-6 md:w-2/3 flex flex-col">
              <div className="mb-4">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">
                  {fraction._id}
                </h3>
              </div>
              
              {fraction.shortDescription && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {fraction.shortDescription}
                </p>
              )}
              
              <div className="mt-auto ml-auto">
                <motion.button 
                  onClick={() => toggleFraction(fraction._id)}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 focus:outline-none transition-colors px-4 py-2 rounded-full bg-gray-800/80 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium cursor-pointer">{expandedFraction === fraction._id ? 'Hide Details' : 'Show Details'}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${expandedFraction === fraction._id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Expanded content */}
          {expandedFraction === fraction._id && fraction.description && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="px-6 pb-8"
            >
              <div className="pt-4 border-t border-gray-700/50">
                <div className="markdown-content prose prose-invert prose-lg max-w-none prose-headings:text-green-400 prose-a:text-green-400 prose-strong:text-green-300">
                  <MarkdownRenderer content={fraction.description} />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Bottom decoration */}
          <div className="h-1 w-full bg-gradient-to-r from-green-600/20 via-green-500/40 to-green-600/20"></div>
        </motion.div>
      ))}
    </div>
  );
}