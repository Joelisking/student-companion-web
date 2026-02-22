import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type RequestTarget = 'body' | 'params' | 'query';

function formatZodError(error: ZodError) {
  return {
    message: 'Validation failed',
    errors: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

export function validate(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res.status(400).json(formatZodError(result.error));
      return;
    }
    // Replace target with parsed (coerced + defaulted) data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
}
