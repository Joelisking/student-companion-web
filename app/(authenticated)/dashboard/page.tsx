'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fetchAPI } from '../../../utils/api';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

function formatDueDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  useEffect(() => {
    fetchAPI<Task[]>('/api/tasks?status=Pending&sortBy=dueDate&order=asc')
      .then(all => setTasks((all ?? []).slice(0, 5)))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const name = session?.user?.name ?? 'there';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
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
          <Link
            href="/tasks"
            style={{ fontSize: 13, color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
          >
            View all →
          </Link>
        </div>

        {/* Content */}
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
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 14,
            }}
          >
            <p style={{ marginBottom: 12 }}>No upcoming tasks.</p>
            <Link
              href="/tasks"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Add a task
            </Link>
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
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: dueDateColor(task.dueDate),
                      flexShrink: 0,
                    }}
                  >
                    {formatDueDate(task.dueDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>{`@keyframes pref-pulse { 0%,100%{opacity:1}50%{opacity:0.45} }`}</style>
    </div>
  );
}
