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
 * Подготавливает файл изображения для отправки на сервер
 * Сжимает файл и добавляет его в FormData
 */
export async function prepareImageForUpload(
  formData: FormData,
  originalFile: File | null,
  fieldName: string = 'image'
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
