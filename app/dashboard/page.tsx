'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Check for authentication
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
    } else {
      if (!user || user.id !== userId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({ id: userId });
      }
    }
  }, [router, user]); // Added user to dependency for correctness of the check

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem('userId');
    // Redirect to login
    router.push('/login');
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Logout
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700">
            Welcome back! You are logged in with User ID:{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded">
              {user.id}
            </code>
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Future content: Tasks, Exams, preferences...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
