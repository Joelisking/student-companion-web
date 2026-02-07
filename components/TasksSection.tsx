'use client';

import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import StudyPreferencesForm from './StudyPreferencesForm';

function ensureUserId(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('userId')) return;
  const id = crypto.randomUUID();
  localStorage.setItem('userId', id);
}

export default function TasksSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    ensureUserId();
  }, []);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <TaskForm onSuccess={() => setRefreshTrigger((r) => r + 1)} />
        <StudyPreferencesForm />
      </div>
      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-8" />
      <TaskList
        refreshTrigger={refreshTrigger}
        onTaskMutated={() => setRefreshTrigger((r) => r + 1)}
      />
    </>
  );
}
