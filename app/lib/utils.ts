import { format } from 'date-fns';

export const formatCurrentDate = () => {
  try {
    const currentDate = new Date();
    return format(currentDate, 'PPp'); // Format: "Dec 28, 2023, 3:56 PM"
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}; 