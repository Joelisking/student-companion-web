'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAPI } from '../utils/api';

const preferencesSchema = z.object({
  preferredTime: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
  sessionLength: z
    .number()
    .min(5, 'Minimum 5 minutes')
    .max(180, 'Maximum 180 minutes'),
  breakLength: z
    .number()
    .min(1, 'Minimum 1 minute')
    .max(60, 'Maximum 60 minutes'),
  weekendPreference: z.enum(['Heavy', 'Light', 'Free']),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesResponse {
  id?: string;
  preferredTime: string;
  sessionLength: number;
  breakLength: number;
  weekendPreference: string;
}

const defaultFormValues: PreferencesFormData = {
  preferredTime: 'Morning',
  sessionLength: 45,
  breakLength: 10,
  weekendPreference: 'Light',
};

export default function StudyPreferencesForm() {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'empty' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchAPI<PreferencesResponse>('/api/preferences');
        if (cancelled) return;
        reset({
          preferredTime: data.preferredTime as PreferencesFormData['preferredTime'],
          sessionLength: data.sessionLength,
          breakLength: data.breakLength,
          weekendPreference: data.weekendPreference as PreferencesFormData['weekendPreference'],
        });
        setLoadState(data.id ? 'loaded' : 'empty');
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load preferences');
        setLoadState('error');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const onSubmit = async (data: PreferencesFormData) => {
    setStatus('submitting');
    setSubmissionMessage('');

    const isEdit = loadState === 'loaded';
    try {
      await fetchAPI('/api/preferences', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      });
      setStatus('success');
      setSubmissionMessage(
        isEdit ? 'Preferences updated successfully!' : 'Preferences saved successfully!'
      );
      setLoadState('loaded');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save preferences';
      setStatus('error');
      setSubmissionMessage(errorMessage);
    }
  };

  if (loadState === 'loading') {
    return (
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Study Preferences
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">Loading preferences...</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Study Preferences
        </h2>
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
          {loadError}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          You can try refreshing the page. If the problem continues, check your connection or sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Study Preferences
      </h2>

      {loadState === 'empty' && (
        <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 rounded text-sm">
          No preferences saved yet. Set your preferences below and save.
        </div>
      )}

      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
          {submissionMessage}
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
          {submissionMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Preferred Study Time
          </label>
          <select
            {...register('preferredTime')}
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.preferredTime ? 'border-red-500' : 'dark:border-zinc-700'}`}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
          {errors.preferredTime && (
            <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Session Length (minutes)
          </label>
          <input
            {...register('sessionLength', { valueAsNumber: true })}
            type="number"
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.sessionLength ? 'border-red-500' : 'dark:border-zinc-700'}`}
          />
          {errors.sessionLength && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sessionLength.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Break Length (minutes)
          </label>
          <input
            {...register('breakLength', { valueAsNumber: true })}
            type="number"
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.breakLength ? 'border-red-500' : 'dark:border-zinc-700'}`}
          />
          {errors.breakLength && (
            <p className="text-red-500 text-xs mt-1">
              {errors.breakLength.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
            Weekends Preference
          </label>
          <select
            {...register('weekendPreference')}
            className={`w-full p-2 border rounded dark:bg-zinc-900 dark:text-white ${errors.weekendPreference ? 'border-red-500' : 'dark:border-zinc-700'}`}>
            <option value="Heavy">Heavy (Catch-up)</option>
            <option value="Light">Light (Maintenance)</option>
            <option value="Free">Free (No study)</option>
          </select>
          {errors.weekendPreference && (
            <p className="text-red-500 text-xs mt-1">{errors.weekendPreference.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50">
          {status === 'submitting' ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}
