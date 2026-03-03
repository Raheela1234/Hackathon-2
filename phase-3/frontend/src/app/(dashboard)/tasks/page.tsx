// T041: Tasks page with TaskList and create button

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/lib/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/Button';

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

      {/* Task list */}
      <TaskList
        tasks={tasks}
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