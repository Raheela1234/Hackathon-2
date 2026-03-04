// Priority badge component for displaying task priority

'use client';

import { TaskPriority } from '@/types/tasks';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
  className?: string;
}

export function PriorityBadge({ priority, size = 'sm', className = '' }: PriorityBadgeProps) {
  const priorityConfig = {
    high: {
      label: 'High',
      icon: '🔴',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
    },
    medium: {
      label: 'Medium',
      icon: '🟡',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
    },
    low: {
      label: 'Low',
      icon: '🟢',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
  };

  const config = priorityConfig[priority];
  const sizClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${config.bgColor} ${config.borderColor} ${config.textColor} ${sizClasses} ${className}`}
      title={`Priority: ${config.label}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Get priority color value (for sorting, filtering UI)
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colors = {
    high: '#ef4444',    // red
    medium: '#eab308',  // yellow
    low: '#22c55e',     // green
  };
  return colors[priority];
}

/**
 * Get priority numeric value for sorting
 * (high = 0, medium = 1, low = 2)
 */
export function getPriorityValue(priority: TaskPriority): number {
  const values = { high: 0, medium: 1, low: 2 };
  return values[priority];
}
