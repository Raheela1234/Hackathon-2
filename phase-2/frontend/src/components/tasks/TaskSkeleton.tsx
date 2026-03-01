// T039: Task skeleton loader for nicer loading state

'use client';

import React from 'react';

export function TaskSkeleton() {
  return (
    <div className="bg-background-card border border-gray-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-6 w-6 rounded bg-gray-800" />
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-800 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-800 rounded w-1/2 mb-4" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-gray-800 rounded" />
            <div className="h-3 w-10 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
