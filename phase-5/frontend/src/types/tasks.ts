// T012: Task type definitions with advanced features

// Priority levels for tasks
export type TaskPriority = 'low' | 'medium' | 'high';

// Recurrence patterns
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | null;

export interface RecurrenceRule {
  pattern: RecurrencePattern;
  lastRecurredAt?: string;  // ISO 8601 timestamp of last recurrence
}

export interface Task {
  id: string;                     // UUID
  user_id: string;                // User UUID
  title: string;                  // Task title (required, 1-255 chars)
  description: string | null;     // Task description (optional, plain text)
  is_completed: boolean;          // Completion status
  priority: TaskPriority;         // Priority level (low, medium, high)
  due_date: string | null;        // ISO 8601 date (YYYY-MM-DD format)
  tags: string[];                 // Array of tag IDs
  recurrence_rule: RecurrenceRule | null;  // Recurrence pattern if recurring
  created_at: string;             // ISO 8601 timestamp
  updated_at: string;             // ISO 8601 timestamp
}

export interface TaskListResponse {
  items: Task[];              // Array of tasks (paginated)
  total: number;              // Total number of tasks (across all pages)
  page: number;               // Current page number (1-based)
  page_size: number;          // Items per page (default 20)
  total_pages: number;        // Total number of pages
}

export interface TaskCreateRequest {
  title: string;
  description?: string;       // Optional
  priority?: TaskPriority;    // Defaults to 'medium'
  due_date?: string | null;   // Optional due date (YYYY-MM-DD)
  tags?: string[];            // Optional tag IDs
  recurrence_rule?: RecurrenceRule | null;  // Optional recurrence
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
  priority?: TaskPriority;
  due_date?: string | null;
  tags?: string[];
  recurrence_rule?: RecurrenceRule | null;
}

// Tag management
export interface Tag {
  id: string;                 // UUID
  user_id: string;            // User UUID
  name: string;               // Tag name (unique per user)
  color?: string;             // Optional color hex code
  created_at: string;         // ISO 8601 timestamp
}

export interface TagCreateRequest {
  name: string;
  color?: string;
}

export interface TagUpdateRequest {
  name?: string;
  color?: string;
}

export interface TaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;          // YYYY-MM-DD format, or empty string
  tags: string[];            // Array of selected tag IDs
  recurrence_pattern: RecurrencePattern;  // Recurrence pattern selection
  errors: {
    title?: string;
    description?: string;
    priority?: string;
    due_date?: string;
    general?: string;
  };
  touched: {
    title: boolean;
    description: boolean;
    priority: boolean;
    due_date: boolean;
    tags: boolean;
  };
  isSubmitting: boolean;
}

export interface FilterState {
  searchQuery: string;        // Search in title and tags
  completionStatus?: 'all' | 'completed' | 'incomplete';
  priority?: TaskPriority | 'all';
  tags: string[];             // Filter by selected tags (OR logic)
  dueDateFilter?: 'all' | 'overdue' | 'today' | 'upcoming' | 'no-date';
}

export interface SortOption {
  field: 'due_date' | 'priority' | 'created_at' | 'title';
  direction: 'asc' | 'desc';
}
