import { Request, Response } from 'express';
import { PreferenceService } from '../services/preference.service';

const preferenceService = new PreferenceService();

export class PreferenceController {
  public getPreferences = (req: Request, res: Response) => {
    const preferences = preferenceService.getPreferences();
    if (!preferences) {
      // Return 404 cleanly so frontend knows to show default/empty state
      res.status(404).json({ message: 'No preferences set' });
      return;
    }
    res.json(preferences);
  };

  public savePreferences = (req: Request, res: Response) => {
    const {
      preferredTime,
      sessionLength,
      breakLength,
      weekendPreference,
    } = req.body;

    if (
      !preferredTime ||
      !sessionLength ||
      !breakLength ||
      !weekendPreference
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const saved = preferenceService.savePreferences({
      preferredTime,
      sessionLength,
      breakLength,
      weekendPreference,
    });

    res.status(201).json(saved);
  };

  public updatePreferences = (req: Request, res: Response) => {
    const updated = preferenceService.updatePreferences(req.body);
    if (!updated) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }
    res.json(updated);
  };

  public deletePreferences = (req: Request, res: Response) => {
    const success = preferenceService.deletePreferences();
    if (!success) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }
    res.status(204).send();
  };
}
