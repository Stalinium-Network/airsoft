import { adminApi, publicApi } from '@/utils/api';

export interface Location {
  _id: string;       // The location name (acts as ID)
  coordinates: string;
  images: string[];    // Array of filenames for saved images
  description?: string;
}

export async function fetchLocations(): Promise<Location[]> {
  try {
    const response = await publicApi.getLocations();
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export function createLocation(formData: FormData) {
  return adminApi.createLocation(formData);
}

export async function deleteLocation(locationId: string) {
  if (!locationId) {
    throw new Error('Location ID is required');
  }
  
  try {
    const response = await adminApi.deleteLocation(locationId);
    return response.data;
  } catch (error: any) {
    // Throw the error with a more specific message
    if (error.response?.status === 409) {
      throw new Error(`Location "${locationId}" cannot be deleted because it's in use by one or more games.`);
    }
    
    throw error;
  }
}