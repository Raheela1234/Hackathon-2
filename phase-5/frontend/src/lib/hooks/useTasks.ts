import { useState, useEffect, useCallback } from 'react';
import { Task, TaskListResponse, TaskCreateRequest, TaskUpdateRequest } from '@/types/tasks';
import { PaginationState } from '@/types/ui';
import * as tasksApi from '@/lib/api/tasks';
import { useAuth } from '@/lib/hooks/useAuth';
import { calculateNextRecurrence, formatDateToISO } from '@/lib/utils/recurring';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  toggleComplete: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createTask: (task: TaskCreateRequest) => Promise<Task>;
  updateTask: (taskId: string, data: TaskUpdateRequest) => Promise<Task>;
  goToPage: (page: number) => void;
  refetchTasks: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    canGoBack: false,
    canGoForward: false,
  });

  const fetchTasks = useCallback(async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const data: TaskListResponse = await tasksApi.getTasks(user.id, page);
      setTasks(data.items);
      setPagination({
        currentPage: data.page,
        pageSize: data.page_size,
        totalItems: data.total,
        totalPages: data.total_pages,
        canGoBack: data.page > 1,
        canGoForward: data.page < data.total_pages,
      });
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const goToPage = useCallback((page: number) => {
    fetchTasks(page);
  }, [fetchTasks]);

  const refetchTasks = useCallback(async () => {
    await fetchTasks(1);
  }, [fetchTasks]);

  const createTask = useCallback(
    async (taskData: TaskCreateRequest) => {
      if (!user) throw new Error('Not authenticated');
      const newTask = await tasksApi.createTask(user.id, taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    },
    [user]
  );

  const updateTask = useCallback(
    async (taskId: string, data: TaskUpdateRequest) => {
      if (!user) throw new Error('Not authenticated');
      const updated = await tasksApi.updateTask(user.id, taskId, data);
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      return updated;
    },
    [user]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) throw new Error('Not authenticated');
      await tasksApi.deleteTask(user.id, taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    },
    [user]
  );

  /**
   * Toggle task completion and handle recurring tasks
   * When a recurring task is completed, automatically create the next instance
   */
  const toggleComplete = useCallback(
    async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !user) return;

      // Mark current task as complete
      const isCompleting = !task.is_completed;
      await updateTask(taskId, { is_completed: !task.is_completed });

      // If completing a recurring task, create the next instance
      if (isCompleting && task.recurrence_rule?.pattern && task.due_date) {
        try {
          const nextDueDate = calculateNextRecurrence(
            task.due_date,
            task.recurrence_rule.pattern
          );

          if (nextDueDate) {
            // Create a new task for the next occurrence
            const nextTask: TaskCreateRequest = {
              title: task.title,
              description: task.description || undefined,
              priority: task.priority,
              due_date: nextDueDate,
              tags: task.tags,
              recurrence_rule: task.recurrence_rule,
            };

            await createTask(nextTask);

            // Show a subtle notification (optional - you can implement a toast)
            console.log(
              `✓ Next occurrence created for "${task.title}" on ${nextDueDate}`
            );
          }
        } catch (err) {
          console.error('Failed to create next recurring task:', err);
          // Don't throw - the main task completion already succeeded
        }
      }
    },
    [tasks, updateTask, createTask, user]
  );

  return {
    tasks,
    loading,
    error,
    pagination,
    toggleComplete,
    deleteTask,
    createTask,
    updateTask,
    goToPage,
    refetchTasks,
  };
}
