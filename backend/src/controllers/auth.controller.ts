import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export class AuthController {
  /** POST /api/auth/login — body validated by loginSchema middleware */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      res.status(200).json({ userId: result.userId, email: result.email });
    } catch (err) {
      next(err);
    }
  };

  /** POST /api/auth/register — body validated by registerSchema middleware */
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { userId } = await authService.register(email, password);
      res.status(201).json({ userId });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Email already exists') {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }
      next(err);
    }
  };
}
