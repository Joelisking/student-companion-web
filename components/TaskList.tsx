'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  complexity: 'Simple' | 'Moderate' | 'Complex';
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const data = await fetchAPI<Task[]>('/api/tasks');
      // Sort by due date ascending
      const sorted = data.sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      );
      setTasks(sorted);
      setError(null);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // Poll every 5 seconds to keep list updated (simple "real-time" for now)
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && tasks.length === 0)
    return <div className="text-center p-4">Loading tasks...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 p-4">{error}</div>
    );
  if (tasks.length === 0)
    return (
      <div className="text-center text-gray-500 p-4">
        No upcoming tasks. Add one above!
      </div>
    );

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Upcoming Tasks
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
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
                      : task.status === 'In Progress'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {task.status}
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
          </div>
        ))}
      </div>
    </div>
  );
}
