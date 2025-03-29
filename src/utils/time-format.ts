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