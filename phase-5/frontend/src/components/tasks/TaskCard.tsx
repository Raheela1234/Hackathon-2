// T036: Enhanced TaskCard with all advanced features display

'use client';

import { Task } from '@/types/tasks';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { PriorityBadge } from '../ui/PriorityBadge';
import { DueDateDisplay } from '../ui/DueDate';
import { TagsDisplay } from '../ui/Tags';
import { RecurrenceBadge } from '../ui/Recurrence';
import { getDueDateStatusClass } from '@/lib/utils/dates';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  // Determine if task is overdue or due today for visual highlighting
  const dueStatus = task.due_date ? getDueDateStatusClass(task.due_date) : 'no-date';
  const isHighlighted = dueStatus === 'overdue' || dueStatus === 'today';

  return (
    <div
      className={`bg-[#0F1020] border rounded-xl p-5 hover:bg-[#1A1B2E] transition-all duration-200 ${
        isHighlighted
          ? dueStatus === 'overdue'
            ? 'border-red-500/50 shadow-lg shadow-red-500/10'
            : 'border-yellow-500/50 shadow-lg shadow-yellow-500/10'
          : 'border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="pt-0.5">
          <Checkbox
            checked={task.is_completed}
            onChange={onToggleComplete}
            aria-label={`Mark "${task.title}" as ${
              task.is_completed ? 'incomplete' : 'complete'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title and status badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className={`text-lg font-semibold ${
                task.is_completed ? 'line-through text-[#A78BFA]' : 'text-white'
              }`}
            >
              {task.title}
            </h3>
            {task.is_completed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#A78BFA]/10 text-white border border-[#A78BFA]/30 whitespace-nowrap">
                ✓ Done
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-300 line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          {/* Badges row: Priority, Due Date, Recurrence */}
          <div className="flex flex-wrap gap-2 mb-3">
            {task.priority && <PriorityBadge priority={task.priority} size="sm" />}
            {task.due_date && (
              <DueDateDisplay date={task.due_date} size="sm" showLabel={false} compact={true} />
            )}
            {task.recurrence_rule && task.recurrence_rule.pattern && (
              <RecurrenceBadge rule={task.recurrence_rule} size="sm" />
            )}
          </div>

          {/* Tags */}
          {(task.tags || []).length > 0 && (
            <div className="mb-3">
              <TagsDisplay tags={task.tags || []} variant="small" />
            </div>
          )}

          {/* Meta information */}
          <div className="text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-[#A78BFA]/10"
              onClick={onEdit}
            >
              ✏️ Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="hover:bg-red-500/20 border border-red-500/30"
              onClick={onDelete}
            >
              🗑️ Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

