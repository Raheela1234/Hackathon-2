// T037: TaskEmptyState component with message and CTA - Updated with Purple Theme

import React from 'react';
import { Button } from '../ui/Button';

interface TaskEmptyStateProps {
  onCreateTask: () => void;
}

export function TaskEmptyState({ onCreateTask }: TaskEmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-[#0F1020] border border-[#A78BFA]/30 rounded-xl p-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 mb-4">
          <svg
            className="h-8 w-8 text-[#A78BFA]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">No tasks yet</h3>
        <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
          Get started by creating your first task. Stay organized and productive!
        </p>
        <div className="mt-8">
          <Button 
            variant="primary" 
            size="lg" 
            className="bg-transparent text-[#A78BFA] border border-[#A78BFA] hover:bg-[#A78BFA]/10"
            onClick={onCreateTask}
          >
            ➕ Create Your First Task
          </Button>
        </div>
      </div>
    </div>
  );
}
