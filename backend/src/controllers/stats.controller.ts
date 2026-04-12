import { Request, Response, NextFunction } from 'express';
import { getTaskStats } from '../services/stats.service';

export class StatsController {
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const stats = await getTaskStats(userId);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  };
}
