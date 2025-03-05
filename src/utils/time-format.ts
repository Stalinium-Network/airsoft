/**
 * Format a date string or Date object into a human-readable format
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Ensure the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  // Format options
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return dateObj.toLocaleString('en-US', options);
}

/**
 * Get relative time string (e.g. "2 days ago" or "in 3 hours")
 */
export function getRelativeTimeString(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Ensure the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  const absDiffInSeconds = Math.abs(diffInSeconds);
  
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  // Convert to appropriate unit
  if (absDiffInSeconds < 60) {
    return formatter.format(Math.sign(diffInSeconds) * absDiffInSeconds, 'second');
  } else if (absDiffInSeconds < 3600) {
    return formatter.format(Math.sign(diffInSeconds) * Math.floor(absDiffInSeconds / 60), 'minute');
  } else if (absDiffInSeconds < 86400) {
    return formatter.format(Math.sign(diffInSeconds) * Math.floor(absDiffInSeconds / 3600), 'hour');
  } else if (absDiffInSeconds < 2592000) {
    return formatter.format(Math.sign(diffInSeconds) * Math.floor(absDiffInSeconds / 86400), 'day');
  } else if (absDiffInSeconds < 31536000) {
    return formatter.format(Math.sign(diffInSeconds) * Math.floor(absDiffInSeconds / 2592000), 'month');
  } else {
    return formatter.format(Math.sign(diffInSeconds) * Math.floor(absDiffInSeconds / 31536000), 'year');
  }
}

/**
 * Format a date for HTML datetime-local input
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    // Format as YYYY-MM-DDThh:mm for datetime-local input
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  } catch (err) {
    console.error("Date formatting error:", err);
    return '';
  }
}

/**
 * Calculate and format the end time based on start date and duration
 */
export function calculateEndTime(date: Date | string, durationHours: number): string {
  if (!date) return 'Set start date first';
  
  try {
    const start = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(start.getTime())) {
      return 'Invalid start date';
    }
    
    const end = new Date(start.getTime() + (durationHours || 0) * 60 * 60 * 1000);
    
    return end.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch (err) {
    console.error("End time calculation error:", err);
    return 'Calculation error';
  }
}