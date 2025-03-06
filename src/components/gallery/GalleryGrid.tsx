'use client'
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ImageModal from './ImageModal';

interface GalleryImage {
  filename: string;
  description: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Calculate appropriate grid columns based on image count
  const getGridColumnClass = () => {
    const count = images.length;
    if (count <= 3) return "md:grid-cols-3";
    if (count <= 4) return "md:grid-cols-4";
    return "md:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${getGridColumnClass()} gap-5 auto-rows-max`}>
        {images.map((image, index) => (
          <motion.div 
            key={image.filename}
            className={`relative cursor-pointer overflow-hidden rounded-lg shadow-md 
              ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
              ${index % 5 === 4 ? 'md:col-span-2' : ''}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={() => setSelectedImage(image)}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`relative ${index === 0 ? 'h-[500px]' : 'h-64 md:h-80'} w-full`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${image.filename}`}
                alt={image.description || "Gallery image"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 transition-opacity hover:opacity-40" />
              
              {image.description && (
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="text-white text-lg font-medium drop-shadow-lg">
                    {image.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
          images={images}
        />
      )}
    </>
  );
}
