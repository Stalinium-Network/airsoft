// Helper function to format Date for display
export const formatDateTime = (date: Date | string): string => {
  try {
    // Convert to Date if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
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
};