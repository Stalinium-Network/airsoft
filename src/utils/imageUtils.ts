import imageCompression from 'browser-image-compression';

/**
 * Создает предварительный просмотр изображения
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to create image preview'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Сжимает изображение и конвертирует в формат WebP
 */
export async function compressImageToWebP(
  file: File, 
  maxWidth = 1200, 
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Определяем размеры с сохранением пропорций
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Создаем canvas для сжатия
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение на canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Получаем сжатое изображение в формате WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Original size: ${file.size}, Compressed size: ${blob.size}`);
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Iterative image processing
 * Allows for multiple cycles of processing with user confirmation between steps
 */
export async function iterativeImageProcessing(
  file: File | Blob,
  options = { 
    maxWidth: 1200,
    quality: 0.8,
    iterationQualityReduction: 0.05
  }
): Promise<{
  processedBlob: Blob,
  stats: { originalSize: number, newSize: number, compressionRatio: number }
}> {
  const originalSize = file.size;
  
  // First compression cycle
  const blob = await compressImageToWebP(
    file instanceof File ? file : new File([file], "image.webp", { type: 'image/webp' }),
    options.maxWidth,
    options.quality
  );
  
  // Calculate statistics
  const newSize = blob.size;
  const compressionRatio = originalSize > 0 ? (1 - (newSize / originalSize)) * 100 : 0;
  
  return {
    processedBlob: blob,
    stats: {
      originalSize,
      newSize,
      compressionRatio
    }
  };
}

/**
 * Continue iterating on an already processed image with reduced quality
 */
export async function continueIterating(
  previousBlob: Blob,
  options = {
    maxWidth: 1200,
    quality: 0.75,  // Lower quality for subsequent iterations
  }
): Promise<{
  processedBlob: Blob,
  stats: { originalSize: number, newSize: number, compressionRatio: number }
}> {
  const originalSize = previousBlob.size;
  
  // Create a File from the Blob for further processing
  const tempFile = new File([previousBlob], "iterating.webp", { type: 'image/webp' });
  
  // Apply another compression cycle
  const newBlob = await compressImageToWebP(
    tempFile,
    options.maxWidth,
    options.quality
  );
  
  // Calculate statistics
  const newSize = newBlob.size;
  const compressionRatio = originalSize > 0 ? (1 - (newSize / originalSize)) * 100 : 0;
  
  return {
    processedBlob: newBlob,
    stats: {
      originalSize,
      newSize,
      compressionRatio
    }
  };
}

/**
 * Подготавливает файл изображения для отправки на сервер
 * Сжимает файл и добавляет его в FormData
 */
export async function prepareImageForUpload(
  formData: FormData,
  originalFile: File | null,
  fieldName: string = 'file'  // Изменено с 'image' на 'file'
): Promise<void> {
  if (!originalFile) return;
  
  try {
    // Сжимаем изображение в формат WebP перед отправкой
    const compressedBlob = await compressImageToWebP(originalFile);
    
    // Создаем новый File из Blob
    const fileExt = 'webp';
    const fileName = originalFile.name.split('.').slice(0, -1).join('.') + '.' + fileExt;
    
    const compressedFile = new File(
      [compressedBlob], 
      fileName, 
      { type: 'image/webp' }
    );
    
    // Добавляем файл в FormData
    formData.append(fieldName, compressedFile);
    
    // Отладочная информация
    console.log("Original size:", originalFile.size, "Compressed size:", compressedFile.size);
  } catch (compressError) {
    console.error("Error compressing image:", compressError);
    // Если сжатие не удалось, используем оригинальный файл
    formData.append(fieldName, originalFile);
  }
}
