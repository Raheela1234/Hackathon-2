// Due date picker and display components

'use client';

import React, { useState } from 'react';
import {
  formatDateForDisplay,
  formatDateWithRelative,
  getDueDateStatusClass,
  getDueDateLabel,
  getTodayISO,
  isOverdue,
  isToday,
} from '@/lib/utils/dates';

interface DueDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Date picker input component for selecting due dates
 */
export function DueDatePicker({
  value,
  onChange,
  placeholder = 'Select due date',
  disabled = false,
  className = '',
}: DueDatePickerProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={getTodayISO()}
        className="w-full px-3 py-2 rounded-lg bg-[#1A1B2E] border border-[#A78BFA]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface DueDateDisplayProps {
  date: string | null;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Display due date with status highlighting
 */
export function DueDateDisplay({
  date,
  size = 'sm',
  showLabel = true,
  compact = false,
  className = '',
}: DueDateDisplayProps) {
  if (!date) {
    return (
      <span className={`text-gray-500 text-xs ${className}`}>
        {compact ? '—' : 'No due date'}
      </span>
    );
  }

  const status = getDueDateStatusClass(date);
  const label = getDueDateLabel(date);
  const displayDate = compact
    ? formatDateWithRelative(date)
    : formatDateForDisplay(date);

  const statusStyles = {
    overdue: 'text-red-400 bg-red-500/10 border-red-500/30',
    today: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    upcoming: 'text-green-400 bg-green-500/10 border-green-500/30',
    'no-date': 'text-gray-500 bg-gray-500/10 border-gray-500/30',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-1 text-xs'
      : 'px-3 py-1.5 text-sm';

  return (
    <div
      className={`inline-flex flex-col items-start gap-0.5 ${className}`}
      title={label}
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium border ${statusStyles[status]} ${sizeClasses}`}
      >
        <span>📅</span>
        <span>{displayDate}</span>
      </span>
      {showLabel && label && (
        <span className={`text-xs ${statusStyles[status].split(' ')[0]}`}>
          {label}
        </span>
      )}
    </div>
  );
}

interface QuickDateButtonsProps {
  onDateSelect: (date: string) => void;
}

/**
 * Quick selection buttons for common due dates
 */
export function QuickDateButtons({ onDateSelect }: QuickDateButtonsProps) {
  const today = getTodayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekISO = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthISO = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(nextMonth.getDate()).padStart(2, '0')}`;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onDateSelect(today)}
        className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors"
      >
        Today
      </button>
      <button
        onClick={() => onDateSelect(tomorrowISO)}
        className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
      >
        Tomorrow
      </button>
      <button
        onClick={() => onDateSelect(nextWeekISO)}
        className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
      >
        Next Week
      </button>
      <button
        onClick={() => onDateSelect(nextMonthISO)}
        className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
      >
        Next Month
      </button>
    </div>
  );
}
