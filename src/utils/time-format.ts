/**
 * Format a date for display in the UI
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return 'TBD';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    // Format as "Month DD, YYYY - HH:MM AM/PM"
    return dateObj.toLocaleString('en-US', {
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch (err) {
    console.error("Date formatting error:", err);
    return 'Invalid date';
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