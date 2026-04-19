import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as userService from '../services/user.service';

export class UserController {
  public getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await userService.getProfile(req.userId!);
      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const profile = await userService.updateProfile(req.userId!, name);
      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  };

  public changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.userId!, currentPassword, newPassword);
      res.status(204).send();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Current password is incorrect') {
        res.status(400).json({ message: err.message });
        return;
      }
      next(err);
    }
  };
}
