import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as preferenceService from '../services/preference.service';

export class PreferenceController {
  public getPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const preferences = await preferenceService.getPreferencesForUser(userId);
      res.status(200).json(preferences);
    } catch (err) {
      next(err);
    }
  };

  /** POST /api/preferences — body validated by preferencesSchema middleware */
  public savePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const saved = await preferenceService.savePreferencesForUser(userId, req.body);
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  };

  /** PUT /api/preferences — body validated by preferencesSchema middleware */
  public updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const updated = await preferenceService.savePreferencesForUser(userId, req.body);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  public deletePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const success = await preferenceService.deletePreferencesForUser(userId);
      if (!success) {
        res.status(404).json({ message: 'Preferences not found' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
