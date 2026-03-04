// T051: TaskForm component with advanced features (priority, due date, tags, recurrence)

'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskCreateRequest, TaskFormState } from '@/types/tasks';
import { validateTaskTitle } from '@/lib/utils/validation';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { DueDatePicker, QuickDateButtons } from '../ui/DueDate';
import { PriorityBadge } from '../ui/PriorityBadge';
import { TagsInput } from '../ui/Tags';
import { RecurrenceSelector } from '../ui/Recurrence';

interface TaskFormProps {
  initialData?: Partial<Task>;
  mode: 'create' | 'edit';
  onSubmit: (data: TaskCreateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  availableTags?: string[];
}

export function TaskForm({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isSubmitting,
  availableTags = [],
}: TaskFormProps) {
  const [formState, setFormState] = useState<TaskFormState>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date || '',
    tags: initialData?.tags || [],
    recurrence_pattern: initialData?.recurrence_rule?.pattern || null,
    errors: {},
    touched: {
      title: false,
      description: false,
      priority: false,
      due_date: false,
      tags: false,
    },
    isSubmitting: false,
  });

  useEffect(() => {
    setFormState((prev) => ({ ...prev, isSubmitting }));
  }, [isSubmitting]);

  const handleBlur = (field: keyof TaskFormState['touched']) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));
    if (field === 'title' || field === 'description') {
      validateField(field, String(formState[field]));
    }
  };

  const validateField = (
    field: 'title' | 'description',
    value: string
  ) => {
    const errors = { ...formState.errors };

    if (field === 'title') {
      if (!value.trim()) {
        errors.title = 'Title is required';
      } else if (!validateTaskTitle(value)) {
        errors.title = 'Title must be between 1 and 255 characters';
      } else {
        delete errors.title;
      }
    }

    setFormState((prev) => ({ ...prev, errors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFormState((prev) => ({
      ...prev,
      touched: {
        title: true,
        description: true,
        priority: true,
        due_date: true,
        tags: true,
      },
    }));

    // Validate all fields
    const errors: typeof formState.errors = {};

    if (!formState.title.trim()) {
      errors.title = 'Title is required';
    } else if (!validateTaskTitle(formState.title)) {
      errors.title = 'Title must be between 1 and 255 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      await onSubmit({
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        priority: formState.priority,
        due_date: formState.due_date || null,
        tags: formState.tags,
        recurrence_rule: formState.recurrence_pattern
          ? {
              pattern: formState.recurrence_pattern,
              lastRecurredAt: undefined,
            }
          : null,
      });
    } catch (error: any) {
      setFormState((prev) => ({
        ...prev,
        errors: { general: error.message || 'Failed to save task' },
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.errors.general && (
        <div
          className="bg-red-500/10 text-red-400 border border-red-500/30 p-3 rounded-lg text-sm"
          role="alert"
        >
          {formState.errors.general}
        </div>
      )}

      {/* Title */}
      <Input
        type="text"
        label="Title"
        value={formState.title}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, title: e.target.value }))
        }
        onBlur={() => handleBlur('title')}
        error={formState.errors.title}
        touched={formState.touched.title}
        required
        disabled={formState.isSubmitting}
        placeholder="Enter task title"
      />

      {/* Description */}
      <TextArea
        label="Description (optional)"
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
        onBlur={() => handleBlur('description')}
        error={formState.errors.description}
        touched={formState.touched.description}
        disabled={formState.isSubmitting}
        placeholder="Enter task description"
        rows={4}
      />

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Priority</label>
        <div className="flex gap-3">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFormState((prev) => ({ ...prev, priority: p }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                formState.priority === p
                  ? 'ring-2 ring-[#A78BFA]'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <PriorityBadge priority={p} />
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">
          Due Date (optional)
        </label>
        <DueDatePicker
          value={formState.due_date}
          onChange={(date) =>
            setFormState((prev) => ({ ...prev, due_date: date }))
          }
        />
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <QuickDateButtons
            onDateSelect={(date) =>
              setFormState((prev) => ({ ...prev, due_date: date }))
            }
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Tags</label>
        <TagsInput
          selectedTags={formState.tags}
          onTagsChange={(tags) =>
            setFormState((prev) => ({ ...prev, tags }))
          }
          availableTags={availableTags}
          placeholder="Add tags or create new ones..."
          maxTags={10}
        />
      </div>

      {/* Recurrence */}
      <RecurrenceSelector
        value={formState.recurrence_pattern}
        onChange={(pattern) =>
          setFormState((prev) => ({ ...prev, recurrence_pattern: pattern }))
        }
        label="Recurring Task"
      />

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#A78BFA]/20">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="text-white"
          isLoading={formState.isSubmitting}
          disabled={formState.isSubmitting}
        >
          {mode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          className="text-white"
          onClick={onCancel}
          disabled={formState.isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
