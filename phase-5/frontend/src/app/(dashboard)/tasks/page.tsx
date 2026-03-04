// T041: Enhanced Tasks page with search, filter, sort, and advanced features

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/lib/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterSortControls } from '@/components/ui/FilterSortControls';
import { FilterState, SortOption } from '@/types/tasks';
import {
  filterAndSortTasks,
  getDefaultFilterState,
  hasActiveFilters,
} from '@/lib/utils/filtering';
import { searchTasks } from '@/lib/utils/search';

export default function TasksPage() {
  const router = useRouter();
  const {
    tasks,
    loading,
    error,
    pagination,
    toggleComplete,
    deleteTask: handleDeleteTask,
    goToPage,
  } = useTasks();

  // Advanced filtering and sorting state
  const [filters, setFilters] = useState<FilterState>(getDefaultFilterState());
  const [sortOptions, setSortOptions] = useState<SortOption[]>([
    { field: 'due_date', direction: 'asc' },
  ]);

  // Get unique tags from all tasks for the filter
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      (task.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    // First apply search
    const searchFiltered = searchTasks(tasks, filters.searchQuery);
    // Then apply other filters and sort
    return filterAndSortTasks(
      searchFiltered,
      { ...filters, searchQuery: '' }, // Search already applied
      sortOptions
    );
  }, [tasks, filters, sortOptions]);

  const activeFilterCount = hasActiveFilters(filters) ? 1 : 0;

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await handleDeleteTask(taskId);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Failed to delete task:', err.message);
        } else {
          console.error('Failed to delete task');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">My Tasks</h2>
          <p className="text-white/90 text-sm mt-1">Manage and organize your tasks</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push('/tasks/create')}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
        >
          ➕ Create Task
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search tasks by title, description, or tags..."
          onSearch={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
          debounceDelay={300}
          autoFocus={false}
        />
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6">
        <FilterSortControls
          filters={filters}
          onFiltersChange={setFilters}
          sortOptions={sortOptions}
          onSortChange={setSortOptions}
          availableTags={availableTags}
        />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters(filters) && (
        <div className="mb-4 p-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() => setFilters(getDefaultFilterState())}
              className="text-xs text-[#A78BFA] hover:text-[#A78BFA]/80 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={goToPage}
        onToggleComplete={toggleComplete}
        onEdit={(taskId) => router.push(`/tasks/${taskId}`)}
        onDelete={handleDelete}
        onCreateTask={() => router.push('/tasks/create')}
      />
    </div>
  );
}