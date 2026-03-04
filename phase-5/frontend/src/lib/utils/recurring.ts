// Utility functions for handling recurring tasks

import { RecurrenceRule, RecurrencePattern } from '@/types/tasks';

/**
 * Calculate the next occurrence date for a recurring task
 * @param currentDate - Current date (ISO format or Date object)
 * @param pattern - Recurrence pattern (daily, weekly, monthly)
 * @returns Next occurrence date in ISO format (YYYY-MM-DD)
 */
export function calculateNextRecurrence(
  currentDate: string | Date,
  pattern: RecurrencePattern
): string | null {
  if (!pattern) return null;

  const date = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;
  
  switch (pattern) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return null;
  }

  return formatDateToISO(date);
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string is in valid ISO format (YYYY-MM-DD)
 */
export function isValidISODate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr + 'T00:00:00Z');
  return !isNaN(date.getTime());
}

/**
 * Format recurrence pattern for display
 * @example 'daily' -> 'Daily'
 * @example 'weekly' -> 'Weekly'
 */
export function formatRecurrencePattern(pattern: RecurrencePattern): string {
  if (!pattern) return '';
  return pattern.charAt(0).toUpperCase() + pattern.slice(1);
}

/**
 * Generate a human-readable description of recurrence
 * @example { pattern: 'daily' } -> 'Repeats every day'
 */
export function getRecurrenceDescription(rule: RecurrenceRule | null): string {
  if (!rule || !rule.pattern) return 'No repeat';

  const descriptions: Record<string, string> = {
    daily: 'Repeats daily',
    weekly: 'Repeats weekly',
    monthly: 'Repeats monthly',
  };

  return descriptions[rule.pattern] || 'No repeat';
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
