'use client';

import { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import StudyPreferencesForm from './StudyPreferencesForm';

export default function TasksSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
