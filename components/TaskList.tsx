'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAPI } from '../utils/api';
import { useSession } from 'next-auth/react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  course: z.string().min(1, 'Course/Subject is required'),
  dueDate: z.string().min(1, 'Due Date is required'),
  priority: z.enum(['High', 'Medium', 'Low']),
  complexity: z.enum(['Simple', 'Moderate', 'Complex']),
  status: z.enum(['Pending', 'InProgress', 'Completed']),
  notes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  complexity: 'Simple' | 'Moderate' | 'Complex';
  status: 'Pending' | 'InProgress' | 'Completed';
  notes?: string | null;
}

interface TaskListProps {
  refreshTrigger?: number;
  onTaskMutated?: () => void;
}

export default function TaskList({
  refreshTrigger = 0,
  onTaskMutated,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const clearFeedback = () => {
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  };

  const { data: session } = useSession();

  const loadTasks = async () => {
    if (!session?.user?.id) return;
    try {
      // Backend expects X-User-Id or Authorization header.
      // Since we are proxying or calling directly, let's include X-User-Id from session.
      const data = await fetchAPI<Task[]>('/api/tasks', {
        headers: {
          'X-User-Id': session.user.id,
        },
      });
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      );
      setTasks(sorted);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load tasks'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadTasks();
    }
  }, [refreshTrigger, session?.user?.id]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setFeedback(null);
    try {
      await fetchAPI(`/api/tasks/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', text: 'Task deleted.' });
      onTaskMutated?.();
      setTasks((prev) => prev.filter((t) => t.id !== id));
      clearFeedback();
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to delete task',
      });
      clearFeedback();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && tasks.length === 0) {
    return <div className="text-center p-4">Loading tasks...</div>;
  }
  if (error && tasks.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Upcoming Tasks
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
          Create Task
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            feedback.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
          {feedback.text}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No upcoming tasks. Add one above!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDelete(task.id)}
              isDeleting={deletingId === task.id}
            />
          ))}
        </div>
      )}

      {(editingTask || isCreating) && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setEditingTask(null);
            setIsCreating(false);
          }}
          onSuccess={() => {
            setFeedback({
              type: 'success',
              text: editingTask ? 'Task updated.' : 'Task created.',
            });
            setEditingTask(null);
            setIsCreating(false);
            onTaskMutated?.();
            loadTasks();
          }}
          onError={(message) => {
            setFeedback({ type: 'error', text: message });
          }}
        />
      )}
    </div>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  isDeleting,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              task.priority === 'High'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : task.priority === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            }`}>
            {task.priority}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              task.status === 'Completed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : task.status === 'InProgress'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }`}>
            {task.status === 'InProgress'
              ? 'In Progress'
              : task.status}
          </span>
        </div>
        <h3
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate"
          title={task.title}>
          {task.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          {task.course}
        </p>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
          <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
          <p>Complexity: {task.complexity}</p>
        </div>
        {task.notes && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
            {task.notes}
          </p>
        )}
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 text-sm py-1.5 px-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600">
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 text-sm py-1.5 px-2 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onSuccess,
  onError,
}: {
  task?: Task | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = !!task;
  const initialDate = new Date();
  initialDate.setMinutes(
    initialDate.getMinutes() - initialDate.getTimezoneOffset()
  );
  const defaultDueDate = initialDate.toISOString().slice(0, 16);

  const dueDateLocal = task?.dueDate
    ? task.dueDate.slice(0, 16)
    : defaultDueDate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      course: task?.course ?? '',
      dueDate: dueDateLocal,
      priority: task?.priority ?? 'Medium',
      complexity: task?.complexity ?? 'Moderate',
      status: task?.status ?? 'Pending',
      notes: task?.notes ?? '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setSubmitError(null);
    try {
      const url = isEditing ? `/api/tasks/${task.id}` : '/api/tasks';
      const method = isEditing ? 'PUT' : 'POST';

      await fetchAPI(url, {
        method,
        body: JSON.stringify(data),
      });
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${isEditing ? 'update' : 'create'} task`;
      setSubmitError(msg);
      onError(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h3>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
              {submitError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
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
                Status
              </label>
              <select
                {...register('status')}
                className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
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

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50">
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Save'
                    : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
