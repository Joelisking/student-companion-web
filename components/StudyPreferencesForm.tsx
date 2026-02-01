'use client';

import { useState } from 'react';
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

export default function StudyPreferencesForm() {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredTime: 'Morning',
      sessionLength: 45,
      breakLength: 10,
      weekendPreference: 'Light',
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    setStatus('submitting');
    setSubmissionMessage('');

    try {
      await fetchAPI('/api/preferences', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setStatus('success');
      setSubmissionMessage('Preferences saved successfully!');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to save preferences';
      setStatus('error');
      setSubmissionMessage(
        errorMessage + ' (Backend not yet implemented)'
      );
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Study Preferences
      </h2>

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
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
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
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
            <option value="Heavy">Heavy (Catch-up)</option>
            <option value="Light">Light (Maintenance)</option>
            <option value="Free">Free (No study)</option>
          </select>
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
