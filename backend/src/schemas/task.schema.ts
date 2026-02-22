import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be 255 characters or fewer'),
  course: z
    .string()
    .min(1, 'Course cannot be empty')
    .max(100, 'Course must be 100 characters or fewer'),
  dueDate: z
    .string()
    .datetime({ offset: true, message: 'dueDate must be a valid ISO 8601 date-time string' }),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  complexity: z.enum(['Simple', 'Moderate', 'Complex']).default('Moderate'),
  notes: z.string().max(1000, 'Notes must be 1000 characters or fewer').optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be 255 characters or fewer')
    .optional(),
  course: z
    .string()
    .min(1, 'Course cannot be empty')
    .max(100, 'Course must be 100 characters or fewer')
    .optional(),
  dueDate: z
    .string()
    .datetime({ offset: true, message: 'dueDate must be a valid ISO 8601 date-time string' })
    .optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  complexity: z.enum(['Simple', 'Moderate', 'Complex']).optional(),
  status: z.enum(['Pending', 'InProgress', 'Completed']).optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or fewer').optional(),
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Task ID must be a valid UUID'),
});

export const getTasksQuerySchema = z.object({
  status: z.enum(['Pending', 'InProgress', 'Completed']).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
