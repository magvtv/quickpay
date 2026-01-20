import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS Classname Merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Currency Formatting
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};


// Date Formatting
export const formatDate = (
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return getRelativeTime(dateObj);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};



// Invoice Number Generator
export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};



// Status Helpers
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export const getStatusColor = (status: InvoiceStatus): string => {
  const colors: Record<InvoiceStatus, string> = {
    draft: 'bg-gray-100 text-gray-600',
    sent: 'bg-blue-100 text-blue-600',
    paid: 'bg-green-100 text-green-600',
    overdue: 'bg-red-100 text-red-600',
    cancelled: 'bg-gray-100 text-gray-400',
  };
  return colors[status] || colors.draft;
};

export const getStatusDotColor = (status: InvoiceStatus): string => {
  const colors: Record<InvoiceStatus, string> = {
    draft: 'bg-orange-500',
    sent: 'bg-blue-500',
    paid: 'bg-green-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-400',
  };
  return colors[status] || colors.draft;
};



// Invoice Status Checker
export const checkInvoiceStatus = (
  currentStatus: InvoiceStatus,
  dueDate: Date,
  isPaid: boolean
): InvoiceStatus => {
  if (isPaid) return 'paid';
  if (currentStatus === 'cancelled') return 'cancelled';
  if (currentStatus === 'draft') return 'draft';
  
  const now = new Date();
  if (new Date(dueDate) < now) return 'overdue';
  
  return 'sent';
};


// String Utilities
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};


// Copy to Clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};


// Debounce Function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}



// Download File Helper
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};


// Percentage Change Calculator
export const calculatePercentageChange = (
  current: number,
  previous: number
): { value: number; label: string } => {
  if (previous === 0) return { value: 0, label: '0%' };
  
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  
  return {
    value: change,
    label: `${sign}${change.toFixed(1)}%`,
  };
};


// Validation Helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


// Sort Helpers
export const sortByDate = <T extends { created_at: Date | string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

// Local Storage Helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};
