// Utility functions for date handling and due date operations

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

/**
 * Check if a date is overdue (before today)
 */
export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr < getTodayISO();
}

/**
 * Check if a date is in the future
 */
export function isUpcoming(dateStr: string): boolean {
  return dateStr > getTodayISO();
}

/**
 * Get the number of days until a date (negative if overdue)
 */
export function getDaysUntil(dateStr: string): number {
  const today = new Date(getTodayISO());
  const targetDate = new Date(dateStr + 'T00:00:00Z');
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Format a date for display
 * @example '2024-03-15' -> 'Mar 15, 2024'
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with relative description
 * @example '2024-03-04' -> 'Today'
 * @example '2024-03-05' -> 'Tomorrow'
 * @example '2024-03-03' -> 'Yesterday'
 * @example '2024-03-15' -> 'Mar 15'
 */
export function formatDateWithRelative(dateStr: string): string {
  const today = getTodayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrowISO) return 'Tomorrow';
  if (dateStr === yesterdayISO) return 'Yesterday';

  return formatDateForDisplay(dateStr);
}

/**
 * Get CSS class modifier for due date status
 * Used to conditionally style overdue/today tasks
 */
export function getDueDateStatusClass(dateStr: string | null): 'overdue' | 'today' | 'upcoming' | 'no-date' {
  if (!dateStr) return 'no-date';
  if (isOverdue(dateStr)) return 'overdue';
  if (isToday(dateStr)) return 'today';
  return 'upcoming';
}

/**
 * Get human-readable due date status
 */
export function getDueDateLabel(dateStr: string | null): string {
  if (!dateStr) return '';
  
  const status = getDueDateStatusClass(dateStr);
  const daysUntil = getDaysUntil(dateStr);

  switch (status) {
    case 'overdue':
      return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
    case 'today':
      return 'Due today';
    case 'upcoming':
      return daysUntil === 1 ? 'Due tomorrow' : `Due in ${daysUntil} days`;
    default:
      return '';
  }
}

/**
 * Parse time from a date string and return HH:MM format
 * Use for reminder time display
 */
export function formatTimeForReminder(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
