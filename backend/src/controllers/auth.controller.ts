import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export class AuthController {
  /** POST /api/auth/login - body: { email }. Returns { userId } for use with NextAuth. */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body?.email;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      const { userId } = await authService.findOrCreateUserByEmail(email);
      res.status(200).json({ userId });
    } catch (err) {
      next(err);
    }
  };
}
