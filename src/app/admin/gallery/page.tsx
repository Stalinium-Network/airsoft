'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrash, FaSpinner } from 'react-icons/fa';

import useAdminAuth from '@/hooks/useAdminAuth';
import AuthRequired from '@/components/admin/AuthRequired';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploadForm from '@/components/gallery/ImageUploadForm';

interface GalleryImage {
  filename: string;
  description: string;
}

export default function AdminGallery() {
  const { token, isLoading: authLoading, message, isError, setMessage, setIsError } = useAdminAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // Fetch gallery images
  const fetchImages = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // Changed from /gallery/preview to /gallery/list to get all images for admin
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/list`);
      
      if (!response.ok) {
        throw new Error(`Error fetching gallery: ${response.status}`);
      }
      
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setIsError(true);
      setMessage('Failed to load gallery images. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    setDeletingImage(filename);
    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.status}`);
      }
      
      setSuccessMessage('Image deleted successfully');
      // Remove the image from the state
      setImages(prevImages => prevImages.filter(img => img.filename !== filename));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setIsError(true);
      setMessage('Failed to delete image. Please check your authorization.');
      console.error(err);
    } finally {
      setDeletingImage(null);
    }
  };

  // Handle successful image upload
  const handleImageUploaded = () => {
    setSuccessMessage('Image uploaded successfully');
    fetchImages(); // Refresh the images list
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Fetch images when token is available
  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  // If authentication is still loading, show loading indicator
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If no token, show login required
  if (!token) {
    return <AuthRequired />;
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>
        
        {/* Display success message or error */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500 text-gray-900 p-4 rounded-md mb-6"
          >
            {successMessage}
          </motion.div>
        )}
        
        {isError && message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-gray-100 p-4 rounded-md mb-6"
          >
            {message}
          </motion.div>
        )}

        {/* Upload section */}
        <section className="mb-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>
          <ImageUploadForm onImageUploaded={handleImageUploaded} token={token} />
        </section>
        
        {/* Gallery management section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Gallery Images</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-green-500 text-4xl" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-xl text-gray-400">No images in gallery</p>
              <p className="text-gray-500 mt-2">Upload your first image above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map(image => (
                <motion.div 
                  key={image.filename}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden relative group"
                >
                  <div className="relative h-64 w-full">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/gallery/image/${image.filename}`}
                      alt={image.description || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400 truncate max-w-[70%]">
                        {image.filename}
                      </p>
                      <button
                        onClick={() => handleDeleteImage(image.filename)}
                        disabled={deletingImage === image.filename}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                        title="Delete image"
                      >
                        {deletingImage === image.filename ? 
                          <FaSpinner className="animate-spin" /> : 
                          <FaTrash />
                        }
                      </button>
                    </div>
                    {image.description && (
                      <p className="mt-2 text-gray-300">{image.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
