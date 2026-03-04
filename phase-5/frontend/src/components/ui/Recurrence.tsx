// Recurring task badge and selector components

'use client';

import React from 'react';
import { RecurrenceRule, RecurrencePattern } from '@/types/tasks';
import {
  formatRecurrencePattern,
  getRecurrenceDescription,
} from '@/lib/utils/recurring';

interface RecurrenceBadgeProps {
  rule: RecurrenceRule | null;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Display recurring task badge
 */
export function RecurrenceBadge({
  rule,
  size = 'sm',
  className = '',
}: RecurrenceBadgeProps) {
  if (!rule || !rule.pattern) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 ${sizeClasses} ${className}`}
      title={getRecurrenceDescription(rule)}
    >
      <span>🔄</span>
      <span>{formatRecurrencePattern(rule.pattern)}</span>
    </span>
  );
}

interface RecurrenceSelectorProps {
  value: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
  label?: string;
}

/**
 * Recurrence pattern selector component
 */
export function RecurrenceSelector({
  value,
  onChange,
  label = 'Recurrence',
}: RecurrenceSelectorProps) {
  const options: Array<{ value: RecurrencePattern; label: string; icon: string }> = [
    { value: null, label: 'No repeat', icon: '—' },
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '📆' },
    { value: 'monthly', label: 'Monthly', icon: '📈' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map(option => (
          <button
            key={option.value || 'none'}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-[#A78BFA] text-white border border-[#A78BFA]'
                : 'bg-[#1A1B2E] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
            }`}
          >
            <span className="block">{option.icon}</span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
