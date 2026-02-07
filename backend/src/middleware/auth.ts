import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Requires authentication. Expects either:
 * - Authorization: Bearer <userId>
 * - X-User-Id: <userId> (for development)
 * Returns 401 if no session/token is present.
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'];

  const userId =
    (authHeader?.startsWith('Bearer ') && authHeader.slice(7).trim()) ||
    (typeof userIdHeader === 'string' && userIdHeader.trim()) ||
    null;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  req.userId = userId;
  next();
}
