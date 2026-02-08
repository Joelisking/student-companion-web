import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export class AuthController {
  /** POST /api/auth/login - body: { email, password }. Returns { userId } on success. */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Email is required' });
        return;
      }

      if (!password || typeof password !== 'string') {
        res.status(400).json({ message: 'Password is required' });
        return;
      }

      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      res.status(200).json({ userId: result.userId });
    } catch (err) {
      next(err);
    }
  };
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Email is required' });
        return;
      }

      if (
        !password ||
        typeof password !== 'string' ||
        password.length < 8
      ) {
        res.status(400).json({
          message: 'Password must be at least 8 characters long',
        });
        return;
      }

      const { userId } = await authService.register(email, password);
      res.status(201).json({ userId });
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message === 'Email already exists'
      ) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }
      next(err);
    }
  };
}
