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
    // Write parsed (coerced + defaulted) data back onto the request.
    // req.query is a getter-only property in Express 5, so mutate in-place instead of replacing.
    if (target === 'query') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = req.query as Record<string, any>;
      Object.keys(q).forEach((k) => delete q[k]);
      Object.assign(q, result.data);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[target] = result.data;
    }
    next();
  };
}
