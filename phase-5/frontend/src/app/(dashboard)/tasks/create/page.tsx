// T052: Create task page with TaskForm supporting advanced features

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/lib/hooks/useTasks';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskCreateRequest } from '@/types/tasks';

export default function CreateTaskPage() {
  const router = useRouter();
  const { createTask, tasks } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unique tags from existing tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      (task.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  const handleSubmit = async (data: TaskCreateRequest) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
      setIsSubmitting(false);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-100">Create New Task</h2>
        <p className="mt-2 text-sm text-gray-400">
          Create a new task with all advanced features. Set priority, due date, tags, and configure recurring tasks.
        </p>
      </div>

      <div className="bg-[#0F1020] border border-[#A78BFA]/30 shadow-lg rounded-2xl p-8">
        <TaskForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          availableTags={availableTags}
        />
      </div>
    </div>
  );
}
