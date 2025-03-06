'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface GalleryImage {
  filename: string;
  description: string;
}

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
  images: GalleryImage[];
}

export default function ImageModal({ image, onClose, images }: ImageModalProps) {
  const [currentImage, setCurrentImage] = useState(image);
  const currentIndex = images.findIndex(img => img.filename === currentImage.filename);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);
  
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImage(images[nextIndex]);
  };
  
  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentImage(images[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-50 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
      >
        <FaTimes size={24} />
      </button>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage.filename}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
        >
          <div className="relative w-full h-[80vh]">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${currentImage.filename}`}
              alt={currentImage.description || "Gallery image"}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {currentImage.description && (
        <div className="absolute bottom-0 left-0 w-full text-center p-4 bg-gradient-to-t from-black to-transparent">
          <p className="text-white text-lg">{currentImage.description}</p>
          <p className="text-gray-400 text-sm mt-1">Image {currentIndex + 1} of {images.length}</p>
        </div>
      )}
      
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
}
