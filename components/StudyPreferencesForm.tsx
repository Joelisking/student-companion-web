'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAPI } from '../utils/api';
import { SelectDropdown, PrimaryButton, Banner } from 'student-companion-lib';

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

const TIME_OPTIONS = [
  {
    value: 'Morning' as const,
    label: 'Morning',
    sub: '6am – 12pm',
    symbol: '◐',
    activeBorder: '#d97706',
    activeBg: '#fffbeb',
    activeText: '#78350f',
    activeSymbolColor: '#f59e0b',
  },
  {
    value: 'Afternoon' as const,
    label: 'Afternoon',
    sub: '12 – 5pm',
    symbol: '○',
    activeBorder: '#2563eb',
    activeBg: '#eff6ff',
    activeText: '#1e3a8a',
    activeSymbolColor: '#3b82f6',
  },
  {
    value: 'Evening' as const,
    label: 'Evening',
    sub: '5 – 9pm',
    symbol: '◑',
    activeBorder: '#ea580c',
    activeBg: '#fff7ed',
    activeText: '#7c2d12',
    activeSymbolColor: '#f97316',
  },
  {
    value: 'Night' as const,
    label: 'Night',
    sub: '9pm – 1am',
    symbol: '●',
    activeBorder: '#4f46e5',
    activeBg: '#eef2ff',
    activeText: '#3730a3',
    activeSymbolColor: '#6366f1',
  },
];

const WEEKEND_OPTIONS = [
  {
    value: 'Heavy' as const,
    label: 'Heavy',
    desc: 'Catch-up mode',
    bars: 3,
    activeBorder: '#2563eb',
    activeBg: '#eff6ff',
    activeText: '#1e3a8a',
    activeBarColor: '#3b82f6',
  },
  {
    value: 'Light' as const,
    label: 'Light',
    desc: 'Maintenance',
    bars: 2,
    activeBorder: '#16a34a',
    activeBg: '#f0fdf4',
    activeText: '#14532d',
    activeBarColor: '#22c55e',
  },
  {
    value: 'Free' as const,
    label: 'Free',
    desc: 'Full rest',
    bars: 0,
    activeBorder: '#94a3b8',
    activeBg: '#f8fafc',
    activeText: '#475569',
    activeBarColor: '#cbd5e1',
  },
];

function IntensityBars({
  filled,
  total = 3,
  color,
}: {
  filled: number;
  total?: number;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 3,
            borderRadius: 99,
            background: i < filled ? color : '#e2e8f0',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function DurationStepper({
  value,
  onChange,
  min,
  max,
  step,
  label,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  error?: string;
}) {
  const pct = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#64748b',
          marginBottom: 10,
        }}>
        {label}
      </p>
      <div
        style={{
          background: 'white',
          border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          borderRadius: 16,
          padding: '20px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}>
        {/* Value display */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <span
            className="auth-layout-display"
            style={{ fontSize: 42, fontWeight: 600, color: '#0f172a' }}>
            {value}
          </span>
          <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 4 }}>
            min
          </span>
        </div>
        {/* Progress track */}
        <div
          style={{
            width: '100%',
            height: 3,
            background: '#f1f5f9',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
              borderRadius: 99,
              transition: 'width 0.15s ease',
            }}
          />
        </div>
        {/* Stepper buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(
            [
              { label: '−', dir: -1 as const },
              { label: '+', dir: 1 as const },
            ] as const
          ).map(({ label: btnLabel, dir }) => {
            const next = value + dir * step;
            const enabled = dir < 0 ? value > min : value < max;
            const actual =
              dir < 0 ? Math.max(min, next) : Math.min(max, next);
            return (
              <button
                key={dir}
                type="button"
                onClick={() => onChange(actual)}
                disabled={!enabled}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: `1.5px solid ${enabled ? '#e2e8f0' : '#f1f5f9'}`,
                  background: enabled ? 'white' : '#f8fafc',
                  color: enabled ? '#334155' : '#cbd5e1',
                  fontSize: 18,
                  fontWeight: 500,
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.1s',
                  userSelect: 'none',
                }}>
                {btnLabel}
              </button>
            );
          })}
        </div>
      </div>
      {error && (
        <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ animation: 'pref-pulse 1.5s ease-in-out infinite' }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            height: 10,
            width: 110,
            background: '#e2e8f0',
            borderRadius: 6,
            marginBottom: 14,
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{ height: 72, background: '#f1f5f9', borderRadius: 14 }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          height: 1,
          background: '#f1f5f9',
          margin: '24px 0',
        }}
      />
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            height: 10,
            width: 160,
            background: '#e2e8f0',
            borderRadius: 6,
            marginBottom: 14,
          }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{ flex: 1, height: 130, background: '#f1f5f9', borderRadius: 14 }}
          />
          <div
            style={{ flex: 1, height: 130, background: '#f1f5f9', borderRadius: 14 }}
          />
        </div>
      </div>
      <div
        style={{
          height: 1,
          background: '#f1f5f9',
          margin: '24px 0',
        }}
      />
      <div>
        <div
          style={{
            height: 10,
            width: 130,
            background: '#e2e8f0',
            borderRadius: 6,
            marginBottom: 14,
          }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{ flex: 1, height: 88, background: '#f1f5f9', borderRadius: 14 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudyPreferencesForm() {
  const [loadState, setLoadState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: defaultFormValues,
  });

  const preferredTime = watch('preferredTime');
  const weekendPref = watch('weekendPreference');
  const sessionLength = watch('sessionLength');
  const breakLength = watch('breakLength');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchAPI<PreferencesResponse>('/api/preferences');
        if (cancelled) return;
        reset({
          preferredTime:
            data.preferredTime as PreferencesFormData['preferredTime'],
          sessionLength: data.sessionLength,
          breakLength: data.breakLength,
          weekendPreference:
            data.weekendPreference as PreferencesFormData['weekendPreference'],
        });
        setLoadState(data.id ? 'loaded' : 'empty');
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : 'Failed to load preferences',
        );
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
        isEdit ? 'Preferences updated.' : 'Preferences saved.',
      );
      setLoadState('loaded');
    } catch (err) {
      setStatus('error');
      setSubmissionMessage(
        err instanceof Error ? err.message : 'Failed to save preferences',
      );
    }
  };

  return (
    <div>
      <style>{`
        @keyframes pref-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes pref-spin {
          to { transform: rotate(360deg); }
        }
        .pref-time-tile {
          cursor: pointer;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          padding: 14px 16px;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          user-select: none;
          display: block;
        }
        .pref-time-tile:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .pref-time-tile.is-active {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
        }
        .pref-weekend-tile {
          cursor: pointer;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          padding: 14px 12px;
          flex: 1;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          user-select: none;
          display: block;
        }
        .pref-weekend-tile:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }
        .pref-weekend-tile.is-active {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
        }
        .pref-submit {
          width: 100%;
          border: none;
          border-radius: 12px;
          background: #1d4ed8;
          color: white;
          font-weight: 600;
          font-size: 14px;
          padding: 14px 24px;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.015em;
          font-family: inherit;
        }
        .pref-submit:hover:not(:disabled) {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.3);
        }
        .pref-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: none;
        }
        .pref-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .pref-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0 30%, #e2e8f0 70%, transparent);
          margin: 26px 0;
        }
        .pref-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: '#64748b';
          margin-bottom: 12px;
        }
      `}</style>

      {/* Loading */}
      {loadState === 'loading' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>
          <LoadingSkeleton />
        </div>
      )}

      {/* Error */}
      {loadState === 'error' && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            border: '1.5px solid #fee2e2',
            boxShadow: '0 2px 12px rgba(239,68,68,0.06)',
          }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '14px 16px',
              background: '#fef2f2',
              borderRadius: 10,
              marginBottom: 12,
            }}>
            <span style={{ fontSize: 15, marginTop: 1 }}>⚠</span>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#991b1b',
                  marginBottom: 2,
                }}>
                Failed to load preferences
              </p>
              <p style={{ fontSize: 13, color: '#b91c1c' }}>{loadError}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>
            Try refreshing the page or signing in again.
          </p>
        </div>
      )}

      {/* Form */}
      {(loadState === 'loaded' || loadState === 'empty') && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 28,
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>

          {/* Banners */}
          {loadState === 'empty' && status !== 'success' && (
            <div style={{ marginBottom: 24 }}>
              <Banner message="No preferences saved yet — set them below." type="info" />
            </div>
          )}
          {status === 'success' && (
            <div style={{ marginBottom: 24 }}>
              <Banner message={submissionMessage} type="success" />
            </div>
          )}
          {status === 'error' && (
            <div style={{ marginBottom: 24 }}>
              <Banner message={submissionMessage} type="error" />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Section 1: Preferred time */}
            <div>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    label="When do you study?"
                    id="preferredTime"
                    value={field.value}
                    onChange={field.onChange}
                    options={TIME_OPTIONS.map(opt => ({
                      value: opt.value,
                      label: `${opt.label} (${opt.sub})`,
                    }))}
                    error={errors.preferredTime?.message}
                    required
                  />
                )}
              />
            </div>

            <div className="pref-divider" />

            {/* Section 2: Durations */}
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  marginBottom: 12,
                }}>
                Session & break duration
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Controller
                  name="sessionLength"
                  control={control}
                  render={({ field }) => (
                    <DurationStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={5}
                      max={180}
                      step={5}
                      label="Focus session"
                      error={errors.sessionLength?.message}
                    />
                  )}
                />
                <Controller
                  name="breakLength"
                  control={control}
                  render={({ field }) => (
                    <DurationStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                      max={60}
                      step={5}
                      label="Break"
                      error={errors.breakLength?.message}
                    />
                  )}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                Total cycle:{' '}
                <strong style={{ color: '#64748b' }}>
                  {(sessionLength ?? 0) + (breakLength ?? 0)} min
                </strong>{' '}
                per round
              </p>
            </div>

            <div className="pref-divider" />

            {/* Section 3: Weekend preference */}
            <div>
              <Controller
                name="weekendPreference"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    label="Weekend intensity"
                    id="weekendPreference"
                    value={field.value}
                    onChange={field.onChange}
                    options={WEEKEND_OPTIONS.map(opt => ({
                      value: opt.value,
                      label: `${opt.label} — ${opt.desc}`,
                    }))}
                    error={errors.weekendPreference?.message}
                    required
                  />
                )}
              />
            </div>

            <div className="pref-divider" />

            {/* Submit */}
            <PrimaryButton
              type="submit"
              label={
                status === 'submitting'
                  ? 'Saving…'
                  : loadState === 'loaded'
                  ? 'Update Preferences'
                  : 'Save Preferences'
              }
              isLoading={status === 'submitting'}
            />
          </form>
        </div>
      )}
    </div>
  );
}
