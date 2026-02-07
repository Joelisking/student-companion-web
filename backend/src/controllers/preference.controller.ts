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

  public savePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { preferredTime, sessionLength, breakLength, weekendPreference } = req.body;

      if (
        preferredTime == null ||
        sessionLength == null ||
        breakLength == null ||
        weekendPreference == null
      ) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const saved = await preferenceService.savePreferencesForUser(userId, {
        preferredTime,
        sessionLength,
        breakLength,
        weekendPreference,
      });
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  };

  public updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const updated = await preferenceService.updatePreferencesForUser(userId, req.body);
      if (!updated) {
        res.status(404).json({ message: 'Preferences not found' });
        return;
      }
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
