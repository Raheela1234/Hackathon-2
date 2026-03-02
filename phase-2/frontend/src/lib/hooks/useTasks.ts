import { useState, useEffect, useCallback } from 'react';
import {
  Task,
  TaskListResponse,
  TaskCreateRequest,
  TaskUpdateRequest,
} from '@/types/tasks';
import { PaginationState } from '@/types/ui';
import * as tasksApi from '@/lib/api/tasks';
import { useAuth } from '@/lib/hooks/useAuth';

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

  const fetchTasks = useCallback(
    async (page: number = 1) => {
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
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const goToPage = useCallback(
    (page: number) => {
      fetchTasks(page);
    },
    [fetchTasks]
  );

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

  const toggleComplete = useCallback(
    async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !user) return;
      await updateTask(taskId, { is_completed: !task.is_completed });
    },
    [tasks, updateTask, user]
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
  };
}
