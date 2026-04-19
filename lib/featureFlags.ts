import { z } from 'zod';

const featureFlagSchema = z.object({
  NEXT_PUBLIC_FEATURE_TASK_SEARCH: z
    .enum(['true', 'false'])
    .default('false')
    .transform(v => v === 'true'),
  NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET: z
    .enum(['true', 'false'])
    .default('false')
    .transform(v => v === 'true'),
  NEXT_PUBLIC_FEATURE_USER_PROFILE: z
    .enum(['true', 'false'])
    .default('false')
    .transform(v => v === 'true'),
});

const parsed = featureFlagSchema.safeParse({
  NEXT_PUBLIC_FEATURE_TASK_SEARCH: process.env.NEXT_PUBLIC_FEATURE_TASK_SEARCH,
  NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET: process.env.NEXT_PUBLIC_FEATURE_PROGRESS_WIDGET,
  NEXT_PUBLIC_FEATURE_USER_PROFILE: process.env.NEXT_PUBLIC_FEATURE_USER_PROFILE,
});

if (!parsed.success) {
  throw new Error(
    `Invalid feature flag configuration:\n${parsed.error.toString()}`
  );
}

export const featureFlags = parsed.data;
