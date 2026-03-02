import apiClient from './client';
import {
  Task,
  TaskListResponse,
  TaskCreateRequest,
  TaskUpdateRequest,
} from '@/types/tasks';

export async function getTasks(
  userId: string,
  page: number = 1
): Promise<TaskListResponse> {
  const res = await apiClient.get(`/users/${userId}/tasks`, {
    params: { page },
  });
  return res.data;
}

export async function createTask(
  userId: string,
  task: TaskCreateRequest
): Promise<Task> {
  const res = await apiClient.post(`/users/${userId}/tasks`, task);
  return res.data;
}

export async function getTask(
  userId: string,
  taskId: string
): Promise<Task> {
  const res = await apiClient.get(`/users/${userId}/tasks/${taskId}`);
  return res.data;
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: TaskUpdateRequest
): Promise<Task> {
  const res = await apiClient.patch(
    `/users/${userId}/tasks/${taskId}`,
    data
  );
  return res.data;
}

export async function deleteTask(
  userId: string,
  taskId: string
): Promise<void> {
  await apiClient.delete(`/users/${userId}/tasks/${taskId}`);
}
