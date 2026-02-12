const PREFERRED_TIMES = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;
const WEEKEND_PREFERENCES = ['Heavy', 'Light', 'Free'] as const;

export interface ValidatedPreferences {
  preferredTime: string;
  sessionLength: number;
  breakLength: number;
  weekendPreference: string;
}

export function validatePreferencesBody(body: unknown): { ok: true; data: ValidatedPreferences } | { ok: false; message: string } {
  if (body == null || typeof body !== 'object') {
    return { ok: false, message: 'Request body must be an object' };
  }
  const b = body as Record<string, unknown>;
  const { preferredTime, sessionLength, breakLength, weekendPreference } = b;

  if (preferredTime == null || typeof preferredTime !== 'string') {
    return { ok: false, message: 'preferredTime is required and must be a string' };
  }
  if (!PREFERRED_TIMES.includes(preferredTime as (typeof PREFERRED_TIMES)[number])) {
    return { ok: false, message: `preferredTime must be one of: ${PREFERRED_TIMES.join(', ')}` };
  }

  if (sessionLength == null) {
    return { ok: false, message: 'sessionLength is required' };
  }
  const sLen = Number(sessionLength);
  if (Number.isNaN(sLen) || sLen < 5 || sLen > 180) {
    return { ok: false, message: 'sessionLength must be a number between 5 and 180' };
  }

  if (breakLength == null) {
    return { ok: false, message: 'breakLength is required' };
  }
  const bLen = Number(breakLength);
  if (Number.isNaN(bLen) || bLen < 1 || bLen > 60) {
    return { ok: false, message: 'breakLength must be a number between 1 and 60' };
  }

  if (weekendPreference == null || typeof weekendPreference !== 'string') {
    return { ok: false, message: 'weekendPreference is required and must be a string' };
  }
  if (!WEEKEND_PREFERENCES.includes(weekendPreference as (typeof WEEKEND_PREFERENCES)[number])) {
    return { ok: false, message: `weekendPreference must be one of: ${WEEKEND_PREFERENCES.join(', ')}` };
  }

  return {
    ok: true,
    data: {
      preferredTime,
      sessionLength: sLen,
      breakLength: bLen,
      weekendPreference,
    },
  };
}
