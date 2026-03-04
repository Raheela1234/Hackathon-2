// Advanced task management context for state management with filters and sorting

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, FilterState, SortOption } from '@/types/tasks';
import {
  filterAndSortTasks,
  getDefaultFilterState,
  hasActiveFilters,
} from '@/lib/utils/filtering';

interface TasksContextType {
  // Filters
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;

  // Sort
  sortOptions: SortOption[];
  setSortOptions: (options: SortOption[]) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Processing
  filteredTasks: Task[];
  hasActiveFilters: boolean;
  applyFiltersAndSort: (tasks: Task[]) => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilterState());
  const [sortOptions, setSortOptions] = useState<SortOption[]>([
    { field: 'due_date', direction: 'asc' }, // Default: sort by due date
  ]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const resetFilters = useCallback(() => {
    setFilters(getDefaultFilterState());
  }, []);

  const applyFiltersAndSort = useCallback(
    (tasks: Task[]): Task[] => {
      const result = filterAndSortTasks(tasks, filters, sortOptions);
      setFilteredTasks(result);
      return result;
    },
    [filters, sortOptions]
  );

  const value: TasksContextType = {
    filters,
    setFilters,
    resetFilters,
    sortOptions,
    setSortOptions,
    filteredTasks,
    hasActiveFilters: hasActiveFilters(filters),
    applyFiltersAndSort,
    searchQuery: filters.searchQuery,
    setSearchQuery: (query) =>
      setFilters(prev => ({ ...prev, searchQuery: query })),
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

/**
 * Hook to use the tasks context
 */
export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within TasksProvider');
  }
  return context;
}
