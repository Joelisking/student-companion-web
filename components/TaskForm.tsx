'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAPI } from '../utils/api';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  course: z.string().min(1, 'Course/Subject is required'),
  dueDate: z.string().min(1, 'Due Date is required'),
  priority: z.enum(['High', 'Medium', 'Low']),
  complexity: z.enum(['Simple', 'Moderate', 'Complex']),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSuccess?: () => void;
}

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      course: '',
      dueDate: '',
      priority: 'Medium',
      complexity: 'Moderate',
      notes: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setStatus('submitting');
    setSubmissionMessage('');

    try {
      await fetchAPI('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setStatus('success');
      setSubmissionMessage('Task created successfully!');
      reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create task';
      setStatus('error');
      setSubmissionMessage(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Add New Task
      </h2>

      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
          {submissionMessage}
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
          {submissionMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Title *
          </label>
          <input
            {...register('title')}
            type="text"
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.title ? 'border-red-500' : 'dark:border-zinc-700'}`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Course/Subject *
          </label>
          <input
            {...register('course')}
            type="text"
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.course ? 'border-red-500' : 'dark:border-zinc-700'}`}
          />
          {errors.course && (
            <p className="text-red-500 text-xs mt-1">
              {errors.course.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Due Date *
          </label>
          <input
            {...register('dueDate')}
            type="datetime-local"
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.dueDate ? 'border-red-500' : 'dark:border-zinc-700'}`}
          />
          {errors.dueDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
              Complexity
            </label>
            <select
              {...register('complexity')}
              className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
              <option value="Simple">Simple</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Notes
          </label>
          <textarea
            {...register('notes')}
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white h-24"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50">
          {status === 'submitting' ? 'Saving...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
