'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fetchAPI } from '../../../utils/api';
import TaskForm from '../../../components/TaskForm';
import { StatCard } from '@joel_ak/student-companion-lib';
import { featureFlags } from '../../../lib/featureFlags';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionPercentage: number;
}

function formatDueDate(iso: string): string {
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueDateColor(iso: string): string {
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return '#dc2626';
  if (diffDays <= 1) return '#ea580c';
  if (diffDays <= 3) return '#d97706';
  return '#64748b';
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadTasks = useCallback(() => {
    setLoading(true);
    fetchAPI<Task[]>('/api/tasks?status=Pending&sortBy=dueDate&order=asc')
      .then(all => setTasks((all ?? []).slice(0, 5)))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const loadStats = useCallback(() => {
    if (!featureFlags.NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET) return;
    setStatsLoading(true);
    fetchAPI<TaskStats>('/api/stats')
      .then(data => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleTaskCreated = () => {
    setModalOpen(false);
    loadTasks();
  };

  const name = session?.user?.name ?? 'there';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <style>{`
        @keyframes pref-pulse { 0%,100%{opacity:1}50%{opacity:0.45} }
        @keyframes modal-fade-in { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Greeting */}
      <h1
        className="auth-layout-display"
        style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}
      >
        Hey, {name} 👋
      </h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
        Here's what's coming up for you.
      </p>

      {/* Progress Widget — gated by NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET */}
      {featureFlags.NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
            Study Progress
          </h2>
          {statsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: 80,
                    background: '#f8fafc',
                    borderRadius: 8,
                    animation: 'pref-pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Tasks" value={stats?.total ?? 0} />
              <StatCard label="Completed" value={stats?.completed ?? 0} trend={stats && stats.completed > 0 ? 'up' : 'neutral'} />
              <StatCard label="In Progress" value={stats?.inProgress ?? 0} />
              <StatCard label="Completion" value={`${stats?.completionPercentage ?? 0}%`} trend={stats && stats.completionPercentage >= 50 ? 'up' : 'neutral'} />
            </div>
          )}
        </div>
      )}

      {/* Upcoming Tasks widget */}
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Widget header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>
            Upcoming Tasks
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: '6px 14px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              + Add Task
            </button>
            <Link
              href="/tasks"
              style={{ fontSize: 13, color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
            >
              View all →
            </Link>
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div style={{ padding: '20px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  height: 52,
                  background: '#f8fafc',
                  borderRadius: 10,
                  marginBottom: 8,
                  animation: 'pref-pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            <p style={{ marginBottom: 12 }}>No upcoming tasks.</p>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Add a task
            </button>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
            {tasks.map((task, i) => (
              <li key={task.id}>
                <Link
                  href="/tasks"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    textDecoration: 'none',
                    borderBottom: i < tasks.length - 1 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: '#1e293b',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '65%',
                    }}
                  >
                    {task.title}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: dueDateColor(task.dueDate), flexShrink: 0 }}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick-add modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modal-fade-in 0.18s ease', width: '100%', maxWidth: 480 }}
          >
            <TaskForm onSuccess={handleTaskCreated} />
          </div>
        </div>
      )}
    </div>
  );
}
