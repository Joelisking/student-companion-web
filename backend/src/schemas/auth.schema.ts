import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email must be 254 characters or fewer'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or fewer')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email must be 254 characters or fewer'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
