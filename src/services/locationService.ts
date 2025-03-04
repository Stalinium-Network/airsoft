import { adminApi, publicApi } from '@/utils/api';

export interface Location {
  _id: string;       // The location name (acts as ID)
  coordinates: string;
  image?: string;    // Filename of the saved image
  description?: string;
}

export async function fetchLocations(): Promise<Location[]> {
  console.log("locationService: Fetching locations...");
  try {
    const response = await publicApi.getLocations();
    console.log("locationService: Fetched locations successfully", response.data);
    return response.data;
  } catch (error) {
    console.error('locationService: Error fetching locations:', error);
    return [];
  }
}

export function getLocation(id: string) {
  console.log(`locationService: Getting location ${id}`);
  return adminApi.getLocation(id);
}

export function createLocation(formData: FormData) {
  console.log("locationService: Creating location");
  
  // Basic form data inspection
  console.log("locationService: Form data contains:", Array.from(formData.entries()).map(([key, value]) => {
    if (key === 'file') {
      const file = value as File;
      return `${key}: File (${file.name}, ${file.type}, ${Math.round(file.size / 1024)}KB)`;
    }
    return `${key}: ${value}`;
  }));
  
  return adminApi.createLocation(formData);
}

export function updateLocation(locationId: string, formData: FormData) {
  console.log(`locationService: Updating location ${locationId}`);
  
  // Basic form data inspection
  console.log("locationService: Update form data contains:", Array.from(formData.entries()).map(([key, value]) => {
    if (key === 'file') {
      const file = value as File;
      return `${key}: File (${file.name}, ${file.type}, ${Math.round(file.size / 1024)}KB)`;
    }
    return `${key}: ${value}`;
  }));
  
  return adminApi.updateLocation(locationId, formData);
}

export function deleteLocation(locationId: string) {
  console.log("locationService: Deleting location:", locationId);
  return adminApi.deleteLocation(locationId);
}

export function getLocationImageUrl(filename: string): string {
  if (!filename) return '';
  return `${process.env.NEXT_PUBLIC_API_URL}/locations/image/${filename}`;
}
