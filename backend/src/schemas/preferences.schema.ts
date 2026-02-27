import { z } from 'zod';

export const preferencesSchema = z.object({
  preferredTime: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
  sessionLength: z
    .number()
    .int('sessionLength must be an integer')
    .min(5, 'sessionLength must be at least 5 minutes')
    .max(180, 'sessionLength must be at most 180 minutes'),
  breakLength: z
    .number()
    .int('breakLength must be an integer')
    .min(1, 'breakLength must be at least 1 minute')
    .max(60, 'breakLength must be at most 60 minutes'),
  weekendPreference: z.enum(['Heavy', 'Light', 'Free']),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
