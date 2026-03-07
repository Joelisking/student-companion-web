'use client';

import { useEffect, useState, useCallback } from 'react';
import { SaveCancelButtonGroup } from 'student-companion-lib';
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

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  High:   { bg: '#FEF2F2', text: '#B91C1C' },
  Medium: { bg: '#FFFBEB', text: '#92400E' },
  Low:    { bg: '#F0FDF4', text: '#166534' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Pending:    { bg: '#F1F5F9', text: '#475569', label: 'Pending' },
  InProgress: { bg: '#EFF6FF', text: '#1D4ED8', label: 'In Progress' },
  Completed:  { bg: '#F0FDF4', text: '#166534', label: 'Completed' },
};

export default function TaskList({ refreshTrigger = 0, onTaskMutated }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const clearFeedback = () => {
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  };

  const { data: session } = useSession();

  const loadTasks = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const data = await fetchAPI<Task[]>('/api/tasks', {
        headers: { 'X-User-Id': session.user.id },
      });
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setTasks(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) loadTasks();
  }, [refreshTrigger, session?.user?.id, loadTasks]);

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setFeedback(null);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setFeedback(null);
    try {
      await fetchAPI(`/api/tasks/${taskToDelete.id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', text: 'Task deleted.' });
      onTaskMutated?.();
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      clearFeedback();
      setTaskToDelete(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete task',
      });
      clearFeedback();
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading tasks…
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .task-card { transition: box-shadow 0.15s, transform 0.15s; }
        .task-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .tl-input:focus { outline: none; border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .tl-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .tl-select:focus { outline: none; border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .tl-select { transition: border-color 0.15s, box-shadow 0.15s; }
        .display-font { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="display-font text-3xl font-semibold text-slate-800">Tasks</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {tasks.length === 0 ? 'No tasks yet' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium border"
            style={
              feedback.type === 'success'
                ? { background: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }
                : { background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }
            }
          >
            {feedback.text}
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-14 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <p className="text-slate-800 font-semibold text-sm mb-1">No tasks yet</p>
            <p className="text-slate-400 text-sm mb-4">Add your first assignment to get started.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDeleteClick(task)}
                isDeleting={isDeleting && taskToDelete?.id === task.id}
              />
            ))}
          </div>
        )}
      </div>

      {(editingTask || isCreating) && (
        <TaskModal
          task={editingTask}
          onClose={() => { setEditingTask(null); setIsCreating(false); }}
          onSuccess={() => {
            setFeedback({ type: 'success', text: editingTask ? 'Task updated.' : 'Task created.' });
            setEditingTask(null);
            setIsCreating(false);
            onTaskMutated?.();
            loadTasks();
          }}
          onError={message => setFeedback({ type: 'error', text: message })}
        />
      )}

      {taskToDelete && (
        <DeleteConfirmationModal
          taskTitle={taskToDelete.title}
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

function TaskCard({ task, onEdit, onDelete, isDeleting }: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const p = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Medium;
  const s = STATUS_STYLES[task.status] ?? STATUS_STYLES.Pending;
  const due = new Date(task.dueDate);
  const isOverdue = due < new Date() && task.status !== 'Completed';

  return (
    <div className="task-card bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
      <div>
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: p.bg, color: p.text }}>
            {task.priority}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
            {s.label}
          </span>
        </div>

        {/* Title + course */}
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">{task.course}</p>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 leading-snug" title={task.title}>
          {task.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1 text-xs text-slate-400">
          <span style={{ color: isOverdue ? '#DC2626' : undefined, fontWeight: isOverdue ? 600 : undefined }}>
            {isOverdue ? 'Overdue · ' : 'Due · '}
            {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span>Complexity · {task.complexity}</span>
        </div>

        {task.notes && (
          <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed border-t border-slate-100 pt-3">
            {task.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
          style={{ background: '#FEF2F2', color: '#B91C1C' }}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass = 'tl-input w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white placeholder:text-slate-300';
const selectClass = 'tl-select w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white';
const errorInputClass = 'border-red-300';

function TaskModal({ task, onClose, onSuccess, onError }: {
  task?: Task | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!task;

  const initialDate = new Date();
  initialDate.setMinutes(initialDate.getMinutes() - initialDate.getTimezoneOffset());
  const defaultDueDate = initialDate.toISOString().slice(0, 16);
  const dueDateLocal = task?.dueDate ? task.dueDate.slice(0, 16) : defaultDueDate;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
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
      await fetchAPI(url, { method: isEditing ? 'PUT' : 'POST', body: JSON.stringify(data) });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} task`;
      setSubmitError(msg);
      onError(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="display-font text-xl font-semibold text-slate-800 mb-5">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h3>

          {submitError && (
            <div className="mb-4 px-3 py-2.5 rounded-xl text-sm border" style={{ background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Title *" error={errors.title?.message}>
              <input {...register('title')} type="text" className={`${inputClass} ${errors.title ? errorInputClass : ''}`} placeholder="e.g. Research paper outline" />
            </FormField>

            <FormField label="Course / Subject *" error={errors.course?.message}>
              <input {...register('course')} type="text" className={`${inputClass} ${errors.course ? errorInputClass : ''}`} placeholder="e.g. CS 301" />
            </FormField>

            <FormField label="Due Date *" error={errors.dueDate?.message}>
              <input {...register('dueDate')} type="datetime-local" className={`${inputClass} ${errors.dueDate ? errorInputClass : ''}`} />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Priority">
                <select {...register('priority')} className={selectClass}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </FormField>
              <FormField label="Complexity">
                <select {...register('complexity')} className={selectClass}>
                  <option value="Simple">Simple</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Complex">Complex</option>
                </select>
              </FormField>
            </div>

            <FormField label="Status">
              <select {...register('status')} className={selectClass}>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </FormField>

            <FormField label="Notes">
              <textarea {...register('notes')} className={`${inputClass} h-24 resize-none`} placeholder="Any additional notes…" />
            </FormField>

            <div className="pt-1">
              <SaveCancelButtonGroup
                onSave={handleSubmit(onSubmit)}
                onCancel={onClose}
                disabled={isSubmitting}
                saveLabel={isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Task'}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmationModal({ taskTitle, isOpen, onClose, onConfirm, isDeleting }: {
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="display-font text-xl font-semibold text-slate-800 mb-2">Delete Task</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-700">&quot;{taskTitle}&quot;</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ background: '#DC2626' }}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
