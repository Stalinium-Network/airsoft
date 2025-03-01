import { Game } from './gameService';

// Function to get the admin token from localStorage
export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

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
    'http://localhost:3113/admin/create-game',
    'POST',
    gameData
  );
};

export const updateGame = async (gameId: string | number, gameData: Partial<Game>): Promise<Game> => {
  return await adminFetch<Game>(
    `http://localhost:3113/admin/update-game/${gameId}`,
    'PUT',
    gameData
  );
};

export const deleteGame = async (gameId: string | number): Promise<void> => {
  return await adminFetch<void>(
    `http://localhost:3113/admin/delete-game/${gameId}`,
    'DELETE'
  );
};

export const verifyToken = async (): Promise<{email: string; isAdmin: boolean}> => {
  return await adminFetch<{email: string; isAdmin: boolean}>(
    'http://localhost:3113/admin/verify-token',
    'GET'
  );
};

// Enhanced date handling functions
export const isPastGame = (dateStr: string): boolean => {
  // Handle various date formats
  let gameDate: Date;
  
  if (!dateStr) return false;
  
  try {
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // YYYY-MM-DD format
      gameDate = new Date(dateStr);
    } else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // MM/DD/YYYY format
      const [month, day, year] = dateStr.split('/').map(Number);
      gameDate = new Date(year, month - 1, day);
    } else {
      // Try to parse month name format (e.g., "December 15, 2023")
      gameDate = new Date(dateStr);
    }
  
    // If date is invalid, default to future date
    if (isNaN(gameDate.getTime())) {
      return false;
    }
    
    // Set game date to end of day to consider it as past only after the day is over
    gameDate.setHours(23, 59, 59);
    
    return gameDate < new Date();
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
};

export const formatDateForInput = (dateStr: string): string => {
  // Handle empty or null input
  if (!dateStr) return '';
  
  try {
    // Try to parse the date
    let date: Date;
    
    // Check if already in YYYY-MM-DD format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // Parse other formats
    date = new Date(dateStr);
    
    // If the date is invalid, return empty string
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateStr);
      return '';
    }
    
    // Format as YYYY-MM-DD for input type="date"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return '';
  }
};

export const formatDateForDisplay = (dateStr: string): string => {
  // Handle empty or null input
  if (!dateStr) return '';
  
  try {
    // If already looks like a display format (contains text month), return as is
    if (dateStr.match(/[a-zA-Z]+ \d{1,2}, \d{4}/)) {
      return dateStr;
    }
    
    // Try to parse the date
    const date = new Date(dateStr);
    
    // If the date is invalid, return original string
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateStr);
      return dateStr;
    }
    
    // Format as Month Day, Year (e.g. "December 15, 2023")
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return dateStr;
  }
};