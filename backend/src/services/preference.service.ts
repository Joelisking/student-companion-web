import prisma from '../lib/prisma';

export interface PreferencesResponse {
  id?: string;
  preferredTime: string;
  sessionLength: number;
  breakLength: number;
  weekendPreference: string;
}

const DEFAULT_PREFERENCES: PreferencesResponse = {
  preferredTime: 'Morning',
  sessionLength: 45,
  breakLength: 10,
  weekendPreference: 'Light',
};

export async function getPreferencesForUser(userId: string): Promise<PreferencesResponse> {
  const row = await prisma.studyPreference.findUnique({
    where: { userId },
  });
  if (!row) {
    return { ...DEFAULT_PREFERENCES };
  }
  return {
    id: row.id,
    preferredTime: row.preferredTime,
    sessionLength: row.sessionLength,
    breakLength: row.breakLength,
    weekendPreference: row.weekendPreference,
  };
}

export async function savePreferencesForUser(
  userId: string,
  data: {
    preferredTime: string;
    sessionLength: number;
    breakLength: number;
    weekendPreference: string;
  }
): Promise<PreferencesResponse> {
  const row = await prisma.studyPreference.upsert({
    where: { userId },
    create: {
      userId,
      preferredTime: data.preferredTime as 'Morning' | 'Afternoon' | 'Evening' | 'Night',
      sessionLength: data.sessionLength,
      breakLength: data.breakLength,
      weekendPreference: data.weekendPreference as 'Heavy' | 'Light' | 'Free',
    },
    update: {
      preferredTime: data.preferredTime as 'Morning' | 'Afternoon' | 'Evening' | 'Night',
      sessionLength: data.sessionLength,
      breakLength: data.breakLength,
      weekendPreference: data.weekendPreference as 'Heavy' | 'Light' | 'Free',
    },
  });
  return {
    id: row.id,
    preferredTime: row.preferredTime,
    sessionLength: row.sessionLength,
    breakLength: row.breakLength,
    weekendPreference: row.weekendPreference,
  };
}

export async function updatePreferencesForUser(
  userId: string,
  updates: Partial<{
    preferredTime: string;
    sessionLength: number;
    breakLength: number;
    weekendPreference: string;
  }>
): Promise<PreferencesResponse | null> {
  const existing = await prisma.studyPreference.findUnique({ where: { userId } });
  if (!existing) return null;
  const row = await prisma.studyPreference.update({
    where: { userId },
    data: {
      ...(updates.preferredTime && {
        preferredTime: updates.preferredTime as 'Morning' | 'Afternoon' | 'Evening' | 'Night',
      }),
      ...(updates.sessionLength !== undefined && { sessionLength: updates.sessionLength }),
      ...(updates.breakLength !== undefined && { breakLength: updates.breakLength }),
      ...(updates.weekendPreference && {
        weekendPreference: updates.weekendPreference as 'Heavy' | 'Light' | 'Free',
      }),
    },
  });
  return {
    id: row.id,
    preferredTime: row.preferredTime,
    sessionLength: row.sessionLength,
    breakLength: row.breakLength,
    weekendPreference: row.weekendPreference,
  };
}

export async function deletePreferencesForUser(userId: string): Promise<boolean> {
  try {
    await prisma.studyPreference.delete({ where: { userId } });
    return true;
  } catch {
    return false;
  }
}
