'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';

interface HealthResponse {
  status: string;
  message?: string;
  timestamp: string;
}

export default function HealthCheck() {
  const [status, setStatus] = useState<
    'loading' | 'connected' | 'disconnected'
  >('loading');
  const [data, setData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await fetchAPI<HealthResponse>('/health');
        setData(result);
        setStatus('connected');
      } catch {
        // forceful disconnect state
        setStatus('disconnected');
      }
    };

    checkHealth();
  }, []);

  if (status === 'loading') {
    return (
      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Checking connection...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        status === 'connected'
          ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20'
          : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'
      }`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <div className="flex flex-col">
          <span
            className={`text-sm font-bold ${
              status === 'connected'
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            }`}>
            {status === 'connected'
              ? 'Backend Connected'
              : 'Backend Disconnected'}
          </span>
          {status === 'connected' && data && (
            <span className="text-xs text-green-600 dark:text-green-500/80">
              {data.message || 'Service is healthy'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
