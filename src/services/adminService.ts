import { getAdminToken } from '@/utils/authUtils';
import { Game } from './gameService';

// Helper for authenticated API calls
export const adminFetch = async <T>(
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('Authentication token is required');
  }
  
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const options: RequestInit = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  
  if (response.status === 204) {
    // No content response
    return {} as T;
  }
  
  return await response.json() as T;
};

// Admin API functions
export const createGame = async (gameData: Omit<Game, '_id'>): Promise<Game> => {
  return await adminFetch<Game>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/create-game`,
    'POST',
    gameData
  );
};

export const updateGame = async (gameId: string | number, gameData: Partial<Game>): Promise<Game> => {
  return await adminFetch<Game>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/update-game/${gameId}`,
    'PUT',
    gameData
  );
};

export const deleteGame = async (gameId: string | number): Promise<void> => {
  return await adminFetch<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/delete-game/${gameId}`,
    'DELETE'
  );
};

export const verifyToken = async (): Promise<{email: string; isAdmin: boolean}> => {
  return await adminFetch<{email: string; isAdmin: boolean}>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/verify-token`,
    'GET'
  );
};

// Update isPastGame to work with date as Date object
export const isPastGame = (date: Date | string): boolean => {
  if (!date) return false;
  
  try {
    // Convert to Date object if it's a string
    const gameDate = typeof date === 'string' ? new Date(date) : date;
  
    // If date is invalid, default to future date
    if (isNaN(gameDate.getTime())) {
      return false;
    }
    
    return gameDate < new Date();
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
};

// Format date for input (handles both string and Date)
export const formatDateForInput = (date: Date | string): string => {
  if (!date) return '';
  
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // If the date is invalid, return empty string
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date format:", date);
      return '';
    }
    
    // Format as YYYY-MM-DDThh:mm for datetime-local input
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return '';
  }
};