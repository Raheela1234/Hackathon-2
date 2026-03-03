// T036: TaskCard component with task display and actions - Updated with Purple Theme

'use client';

import React from 'react';
import { Task } from '@/types/tasks';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-[#0F1020] border border-[#A78BFA]/30 rounded-xl p-5 hover:bg-[#1A1B2E] hover:border-[#A78BFA]/50 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="pt-0.5">
          <Checkbox
            checked={task.is_completed}
            onChange={onToggleComplete}
            aria-label={`Mark "${task.title}" as ${task.is_completed ? 'incomplete' : 'complete'}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-lg font-semibold ${
                task.is_completed ? 'line-through text-[#A78BFA]' : 'text-white'
              }`}
            >
              {task.title}
            </h3>
            {task.is_completed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30">
                ✓ Done
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{task.description}</p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#A78BFA] hover:bg-[#A78BFA]/10"
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
