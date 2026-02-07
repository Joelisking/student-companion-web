import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Requires authentication. Accepts:
 * - From Next.js proxy (session verified): X-Internal-Secret + X-User-Id
 * - Direct: Authorization: Bearer <userId> or X-User-Id (dev)
 * Returns 401 if unauthenticated.
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const internalSecret = process.env.INTERNAL_API_SECRET;
  const forwardedSecret = req.headers['x-internal-secret'];
  const forwardedUserId = req.headers['x-user-id'];

  if (
    internalSecret &&
    typeof forwardedSecret === 'string' &&
    forwardedSecret === internalSecret &&
    typeof forwardedUserId === 'string' &&
    forwardedUserId.trim()
  ) {
    req.userId = forwardedUserId.trim();
    return next();
  }

  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'];
  const userId =
    (authHeader?.startsWith('Bearer ') && authHeader.slice(7).trim()) ||
    (typeof userIdHeader === 'string' && userIdHeader.trim()) ||
    null;

  if (!userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  req.userId = userId;
  next();
}
