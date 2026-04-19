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
}
