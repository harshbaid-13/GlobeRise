import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '-';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '-';
  }
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return '-';
  }
};

/**
 * Format date with time and relative time
 */
export const formatDateWithRelative = (date) => {
  if (!date) return { dateTime: '-', relative: '-' };
  try {
    const dateTime = format(new Date(date), 'yyyy-MM-dd hh:mm A');
    const relative = formatRelativeTime(date);
    return { dateTime, relative };
  } catch (error) {
    return { dateTime: '-', relative: '-' };
  }
};

