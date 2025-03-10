'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaSpinner, FaCalendarAlt, FaImage, FaFileAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageDetailsModalProps {
  filename: string;
  onClose: () => void;
}

interface ImageDetails {
  filename: string;
  description: string;
  game: any; // Using 'any' for now to inspect what we get
}

export default function ImageDetailsModal({ filename, onClose }: ImageDetailsModalProps) {
  const [details, setDetails] = useState<ImageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/details/${filename}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image details (${response.status})`);
        }
        
        const data = await response.json();
        console.log('Image details received:', data); // Logging the entire response
        console.log('Game data:', data.game); // Specifically logging the game data
        
        setDetails(data);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError('Failed to load image details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [filename]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-lg max-w-4xl w-full overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-900 bg-opacity-70 rounded-full text-white hover:bg-gray-700 transition-colors z-10"
          >
            <FaTimes size={20} />
          </button>
          
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <FaSpinner className="animate-spin text-green-500 text-4xl" />
              <p className="text-gray-300">Loading image details...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : details ? (
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative h-96 md:w-2/3">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${details.filename}`} 
                  alt={details.description || "Gallery image"}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Details */}
              <div className="p-6 md:w-1/3 bg-gray-800 border-l border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-green-500 flex items-center">
                  <FaImage className="mr-2" /> Image Details
                </h3>
                
                {details.description && (
                  <div className="mb-6">
                    <h4 className="text-gray-400 text-sm uppercase tracking-wider flex items-center mb-2">
                      <FaFileAlt className="mr-2" /> Description
                    </h4>
                    <p className="text-white">{details.description}</p>
                  </div>
                )}
                
                {details.game && (
                  <div className="mb-6">
                    <h4 className="text-gray-400 text-sm uppercase tracking-wider flex items-center mb-2">
                      <FaCalendarAlt className="mr-2" /> Associated Event
                    </h4>
                    <p className="text-white">
                      {/* Display game title if available, otherwise just show that it's linked to an event */}
                      {typeof details.game === 'object' && details.game?.title ? 
                        details.game.title : 
                        typeof details.game === 'string' ? 
                          details.game : 'Linked to an event'}
                    </p>
                    
                    {/* If game has a date, display it */}
                    {details.game?.date && (
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(details.game.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-700">
                  File: {details.filename}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              No details available
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
