// Advanced filter and sort controls

'use client';

import React, { useState } from 'react';
import { TaskPriority, FilterState, SortOption } from '@/types/tasks';
import { Button } from './Button';

interface FilterSortControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortOptions: SortOption[];
  onSortChange: (sorts: SortOption[]) => void;
  availableTags: string[];
}

/**
 * Advanced filter and sort controls component
 */
export function FilterSortControls({
  filters,
  onFiltersChange,
  sortOptions,
  onSortChange,
  availableTags,
}: FilterSortControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handlePriorityChange = (priority: TaskPriority | 'all') => {
    onFiltersChange({ ...filters, priority });
  };

  const handleCompletionChange = (status: 'all' | 'completed' | 'incomplete') => {
    onFiltersChange({ ...filters, completionStatus: status });
  };

  const handleDueDateFilterChange = (
    filter: 'all' | 'overdue' | 'today' | 'upcoming' | 'no-date'
  ) => {
    onFiltersChange({ ...filters, dueDateFilter: filter });
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(t => t !== tagId)
      : [...filters.tags, tagId];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleSortChange = (field: SortOption['field']) => {
    const existingSort = sortOptions.find(s => s.field === field);
    const newSort: SortOption = existingSort
      ? {
          field,
          direction: existingSort.direction === 'asc' ? 'desc' : 'asc',
        }
      : { field, direction: 'desc' };

    // Replace existing sort for same field or append
    const newSorts = sortOptions.filter(s => s.field !== field);
    newSorts.push(newSort);
    onSortChange(newSorts);
  };

  const activeFilterCount =
    (filters.completionStatus !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.dueDateFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Control buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showFilters || activeFilterCount > 0
              ? 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/50'
              : 'bg-[#1A1B2E] text-gray-300 border border-[#A78BFA]/30 hover:bg-[#A78BFA]/10'
          }`}
        >
          <span>🔍</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#A78BFA] text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowSort(!showSort)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showSort || sortOptions.length > 0
              ? 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/50'
              : 'bg-[#1A1B2E] text-gray-300 border border-[#A78BFA]/30 hover:bg-[#A78BFA]/10'
          }`}
        >
          <span>↕️</span>
          Sort
          {sortOptions.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#A78BFA] text-white text-xs font-bold">
              {sortOptions.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1A1B2E] border border-[#A78BFA]/30 rounded-lg p-4 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Status
            </label>
            <div className="flex gap-2 mt-2">
              {(['all', 'completed', 'incomplete'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => handleCompletionChange(status)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    filters.completionStatus === status
                      ? 'bg-[#A78BFA] text-white font-medium'
                      : 'bg-[#0F1020] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'completed' ? '✓ Done' : '○ Pending'}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Priority
            </label>
            <div className="flex gap-2 mt-2">
              {(['all', 'high', 'medium', 'low'] as const).map(priority => (
                <button
                  key={priority}
                  onClick={() => handlePriorityChange(priority)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    filters.priority === priority
                      ? 'bg-[#A78BFA] text-white font-medium'
                      : 'bg-[#0F1020] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
                  }`}
                >
                  {priority === 'all'
                    ? 'Any'
                    : `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Due Date
            </label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(['all', 'overdue', 'today', 'upcoming', 'no-date'] as const).map(
                dateFilter => (
                  <button
                    key={dateFilter}
                    onClick={() => handleDueDateFilterChange(dateFilter)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      filters.dueDateFilter === dateFilter
                        ? 'bg-[#A78BFA] text-white font-medium'
                        : 'bg-[#0F1020] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
                    }`}
                  >
                    {dateFilter === 'all'
                      ? 'Any'
                      : dateFilter === 'no-date'
                      ? 'No Date'
                      : `${dateFilter.charAt(0).toUpperCase()}${dateFilter.slice(1)}`}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Tags
              </label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-[#A78BFA] text-white font-medium'
                        : 'bg-[#0F1020] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sort Panel */}
      {showSort && (
        <div className="bg-[#1A1B2E] border border-[#A78BFA]/30 rounded-lg p-4 space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">
            Sort By
          </label>
          <div className="space-y-2">
            {(['due_date', 'priority', 'created_at', 'title'] as const).map(
              field => {
                const fieldNames = {
                  due_date: 'Due Date',
                  priority: 'Priority',
                  created_at: 'Created Date',
                  title: 'Title',
                };

                const currentSort = sortOptions.find(s => s.field === field);
                const isActive = !!currentSort;

                return (
                  <button
                    key={field}
                    onClick={() => handleSortChange(field)}
                    className={`w-full px-3 py-2 text-sm rounded-lg text-left transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#A78BFA] text-white font-medium'
                        : 'bg-[#0F1020] text-gray-300 border border-[#A78BFA]/30 hover:border-[#A78BFA]/50'
                    }`}
                  >
                    <span>{fieldNames[field]}</span>
                    {isActive && (
                      <span className="text-xs">
                        {currentSort?.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
