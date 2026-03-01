// T037: TaskEmptyState component with message and CTA

import React from 'react';
import { Button } from '../ui/Button';

interface TaskEmptyStateProps {
  onCreateTask: () => void;
}

export function TaskEmptyState({ onCreateTask }: TaskEmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto shadow-2xl">
        {/* Animated icon container */}
        <div className="relative inline-flex">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
          
          {/* Icon container */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-4">
            <svg
              className="h-10 w-10 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>

        {/* Title with gradient */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
          No Tasks Yet
        </h3>

        {/* Description */}
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          Your task list is empty. Start your productivity journey by creating your first task. 
          Stay organized, track progress, and achieve more with TaskFlow.
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          {[
            { icon: '✓', label: 'Create' },
            { icon: '↻', label: 'Track' },
            { icon: '✓', label: 'Complete' },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-xl text-purple-400 mb-1">{feature.icon}</div>
              <div className="text-xs text-gray-500">{feature.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button with gradient */}
        <Button
          variant="primary"
          size="lg"
          onClick={onCreateTask}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25 px-8 py-4 text-lg group"
        >
          <span className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Your First Task
          </span>
        </Button>

        {/* Quick tip */}
        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
          <svg
            className="w-4 h-4 mr-1 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Tip: Start with small, achievable tasks to build momentum</span>
        </div>
      </div>
    </div>
  );
}