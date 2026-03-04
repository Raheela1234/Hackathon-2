// Utility functions for filtering and sorting tasks

import { Task, FilterState, SortOption } from '@/types/tasks';
import { isOverdue, isToday, isUpcoming } from './dates';

/**
 * Apply filters to a list of tasks
 */
export function filterTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter(task => {
    // Search filter (title and tags)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesTags = (task.tags || []).some(tagId =>
        tagId.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesTags) return false;
    }

    // Completion status filter
    if (filters.completionStatus && filters.completionStatus !== 'all') {
      const isCompleted = task.is_completed;
      if (filters.completionStatus === 'completed' && !isCompleted) return false;
      if (filters.completionStatus === 'incomplete' && isCompleted) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if ((task.priority || 'medium') !== filters.priority) return false;
    }

    // Tags filter (OR logic - task must have at least one of the selected tags)
    if (filters.tags.length > 0) {
      const hasSelectedTag = (task.tags || []).some(tag => filters.tags.includes(tag));
      if (!hasSelectedTag) return false;
    }

    // Due date filter
    if (filters.dueDateFilter && filters.dueDateFilter !== 'all') {
      if (filters.dueDateFilter === 'overdue' && (!task.due_date || !isOverdue(task.due_date))) {
        return false;
      }
      if (filters.dueDateFilter === 'today' && (!task.due_date || !isToday(task.due_date))) {
        return false;
      }
      if (filters.dueDateFilter === 'upcoming' && (!task.due_date || !isUpcoming(task.due_date))) {
        return false;
      }
      if (filters.dueDateFilter === 'no-date' && task.due_date) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort tasks according to sort options
 */
export function sortTasks(tasks: Task[], sortOptions: SortOption[]): Task[] {
  const sorted = [...tasks];

  // Apply sorts in reverse order (last sort has highest priority)
  for (let i = sortOptions.length - 1; i >= 0; i--) {
    const { field, direction } = sortOptions[i];
    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (field) {
        case 'due_date':
          // Handle tasks without due dates (put them at end)
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          aVal = a.due_date;
          bVal = b.due_date;
          break;

        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          aVal = priorityOrder[a.priority] ?? 3;
          bVal = priorityOrder[b.priority] ?? 3;
          break;

        case 'created_at':
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;

        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;

        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return direction === 'asc'
        ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0)
        : (bVal < aVal ? -1 : bVal > aVal ? 1 : 0);
    });
  }

  return sorted;
}

/**
 * Apply both filtering and sorting to tasks
 */
export function filterAndSortTasks(
  tasks: Task[],
  filters: FilterState,
  sortOptions: SortOption[]
): Task[] {
  const filtered = filterTasks(tasks, filters);
  return sortTasks(filtered, sortOptions);
}

/**
 * Get default/empty filter state
 */
export function getDefaultFilterState(): FilterState {
  return {
    searchQuery: '',
    completionStatus: 'all',
    priority: 'all',
    tags: [],
    dueDateFilter: 'all',
  };
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.searchQuery !== '' ||
    filters.completionStatus !== 'all' ||
    filters.priority !== 'all' ||
    filters.tags.length > 0 ||
    filters.dueDateFilter !== 'all'
  );
}
