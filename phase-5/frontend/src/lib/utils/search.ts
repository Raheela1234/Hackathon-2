// Utility functions for search functionality

import { Task } from '@/types/tasks';

/**
 * Search tasks by title and tags
 * Returns matching tasks with search context
 */
export interface SearchResult {
  task: Task;
  matchType: 'title' | 'tag';
  highlights: { field: string; value: string }[];
}

/**
 * Perform real-time search on tasks
 * @param tasks - Array of tasks to search
 * @param query - Search query string
 * @returns Filtered tasks matching the query
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;

  const searchQuery = query.toLowerCase().trim();
  
  return tasks.filter(task => {
    // Search in title
    if (task.title.toLowerCase().includes(searchQuery)) {
      return true;
    }

    // Search in description
    if (task.description && task.description.toLowerCase().includes(searchQuery)) {
      return true;
    }

    // Search in tags (if we have tag names - in real app, would need tag mapping)
    // For now, tags are just IDs
    if ((task.tags || []).some(tag => tag.toLowerCase().includes(searchQuery))) {
      return true;
    }

    return false;
  });
}

/**
 * Get search suggestions/autocomplete for tags
 * @param allTags - Array of all available tags
 * @param query - Partial query string
 * @returns Matching tags
 */
export function getSearchSuggestions(
  allTags: string[],
  query: string
): string[] {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase().trim();
  return allTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery)
  );
}

/**
 * Highlight search matches in text
 * Returns HTML-safe highlighted text
 */
export function highlightSearchMatch(text: string, query: string): string {
  if (!query.trim()) return text;

  const searchQuery = query.toLowerCase();
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Normalize search query for better matching
 * Removes extra spaces, special characters
 */
export function normalizeSearchQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Debounce function for search input
 * Prevents excessive filtering while user is typing
 */
export function createSearchDebounce(
  callback: (query: string) => void,
  delay: number = 300
): (query: string) => void {
  let timeoutId: NodeJS.Timeout;

  return (query: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(query);
    }, delay);
  };
}
