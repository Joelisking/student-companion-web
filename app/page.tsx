'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  course?: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDueDate(dateStr: string): { label: string; urgent: boolean } {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { label: 'Overdue', urgent: true };
  if (diff === 0) return { label: 'Due today', urgent: true };
  if (diff === 1) return { label: 'Tomorrow', urgent: false };
  if (diff <= 7) return { label: `${diff} days left`, urgent: false };
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    urgent: false,
  };
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/backend/api/tasks', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data) setTasks(Array.isArray(data) ? data : (data.tasks ?? []));
      })
      .catch(() => {})
      .finally(() => setTasksLoading(false));
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600"
          style={{ animation: 'spin 0.75s linear infinite' }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const name =
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    'Scholar';

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'InProgress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;

  const upcoming = tasks
    .filter(t => t.status !== 'Completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50" style={{ colorScheme: 'light' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600&display=swap');
        .page-font { font-family: 'DM Sans', system-ui, sans-serif; }
        .display-font { font-family: 'Fraunces', Georgia, serif; }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.45s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.45s 0.15s ease both; }
        .fade-up-4 { animation: fadeUp 0.45s 0.2s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .action-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10); transform: translateY(-2px); }
        .action-card { transition: box-shadow 0.18s, transform 0.18s; }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }
        .stat-card { transition: box-shadow 0.18s, transform 0.18s; }
        .deadline-row:hover { background: #F8FAFC; }
        .deadline-row { transition: background 0.12s; }
        .arrow { transition: transform 0.15s; }
        .action-card:hover .arrow { transform: translateX(4px); }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav
        className="page-font sticky top-0 z-50 flex items-center justify-between px-6 h-14 bg-white border-b border-slate-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <span className="display-font text-lg font-semibold text-slate-800 tracking-tight">
          Student<span className="text-blue-600">.</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-400">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Page Content ───────────────────────────────── */}
      <main className="page-font max-w-3xl mx-auto px-5 py-10 flex flex-col gap-8">

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="fade-up flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">
              {today}
            </p>
            <h1 className="display-font text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight mb-2">
              {getGreeting()},
              <br />
              <span className="italic text-blue-600">{name}.</span>
            </h1>
            <p className="text-slate-400 text-sm mt-3">
              {total === 0
                ? 'No tasks yet — add one to get started.'
                : `${completed} of ${total} tasks completed`}
            </p>
          </div>

          {/* Progress ring */}
          {total > 0 && (
            <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#2563EB" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center leading-none">
                <span className="display-font text-2xl font-semibold text-slate-800">
                  {tasksLoading ? '—' : `${progressPct}%`}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 font-medium">done</span>
              </div>
            </div>
          )}
        </section>

        {/* ── Stats ────────────────────────────────────── */}
        <section className="fade-up-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',       value: total,      border: '#CBD5E1', num: '#334155' },
            { label: 'Pending',     value: pending,    border: '#FCA5A5', num: '#DC2626' },
            { label: 'In Progress', value: inProgress, border: '#FCD34D', num: '#D97706' },
            { label: 'Completed',   value: completed,  border: '#6EE7B7', num: '#059669' },
          ].map(s => (
            <div
              key={s.label}
              className="stat-card bg-white rounded-2xl p-4 border border-slate-100"
              style={{ borderTop: `3px solid ${s.border}` }}
            >
              <span
                className="display-font text-3xl font-semibold block mb-1"
                style={{ color: s.num }}
              >
                {tasksLoading ? '—' : s.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </section>

        {/* ── Quick Actions ─────────────────────────────── */}
        <section className="fade-up-2 grid sm:grid-cols-2 gap-3">
          <Link
            href="/tasks"
            className="action-card bg-blue-600 rounded-2xl p-5 flex items-center gap-4 no-underline"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500 bg-opacity-50 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm mb-0.5">Tasks</p>
              <p className="text-blue-200 text-xs">Manage assignments & deadlines</p>
            </div>
            <span className="arrow text-blue-300 text-lg">→</span>
          </Link>

          <Link
            href="/preferences"
            className="action-card bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 no-underline"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 font-semibold text-sm mb-0.5">Study Preferences</p>
              <p className="text-slate-400 text-xs">Customise your study sessions</p>
            </div>
            <span className="arrow text-slate-300 text-lg">→</span>
          </Link>
        </section>

        {/* ── Upcoming Deadlines ───────────────────────── */}
        {!tasksLoading && upcoming.length > 0 && (
          <section className="fade-up-3 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="display-font text-lg font-semibold text-slate-800">
                Upcoming Deadlines
              </h2>
              <Link href="/tasks" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all →
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {upcoming.map(task => {
                const due = task.dueDate ? formatDueDate(task.dueDate) : null;
                const priorityStyle: Record<string, { bg: string; text: string }> = {
                  High:   { bg: '#FEF2F2', text: '#B91C1C' },
                  Medium: { bg: '#FFFBEB', text: '#92400E' },
                  Low:    { bg: '#F0FDF4', text: '#166534' },
                };
                const ps = priorityStyle[task.priority] ?? { bg: '#F1F5F9', text: '#475569' };
                return (
                  <li key={task.id} className="deadline-row px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      {task.course && (
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-0.5">
                          {task.course}
                        </p>
                      )}
                      <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: ps.bg, color: ps.text }}
                      >
                        {task.priority}
                      </span>
                      {due && (
                        <span
                          className="text-xs font-medium"
                          style={{ color: due.urgent ? '#DC2626' : '#94A3B8' }}
                        >
                          {due.label}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ── Empty State ───────────────────────────────── */}
        {!tasksLoading && tasks.length === 0 && (
          <section className="fade-up-4 bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p className="text-slate-800 font-semibold text-sm mb-1">No tasks yet</p>
            <p className="text-slate-400 text-sm mb-4">Add your first assignment to get started.</p>
            <Link
              href="/tasks"
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors no-underline"
            >
              Go to Tasks
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
