import imageCompression from 'browser-image-compression';

/**
 * Compresses an image and converts it to WebP format
 * @param imageFile Original image file from input
 * @param maxSizeMB Maximum size in MB for the compressed image
 * @returns Promise containing the compressed WebP image as File object
 */
export async function compressImageToWebP(
  imageFile: File,
  maxSizeMB: number = 1
): Promise<File> {
  try {
    // Options for compression
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920, // Limit maximum dimension to 1920px
      useWebWorker: true,
      fileType: 'image/webp',
    };

    // Compress the image
    const compressedFile = await imageCompression(imageFile, options);
    
    // Create a new filename with .webp extension
    const fileName = imageFile.name.replace(/\.[^/.]+$/, "") + '.webp';
    
    // Return as a new File with webp mime type
    return new File([compressedFile], fileName, { 
      type: 'image/webp' 
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

/**
 * Creates a data URL from a file for preview purposes
 * @param file File to preview
 * @returns Promise containing data URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
