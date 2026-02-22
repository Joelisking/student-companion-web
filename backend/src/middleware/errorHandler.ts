import { Request, Response, NextFunction } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const error = err as { stack?: string; statusCode?: number; message?: string };
  console.error(error.stack);
  const status = error.statusCode || 500;

  if (isProd && status === 500) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(status).json({ message: error.message || 'Internal Server Error' });
};
