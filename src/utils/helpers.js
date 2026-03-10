import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFullDate = (date) => {
  return format(new Date(date), 'PPP p');
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};