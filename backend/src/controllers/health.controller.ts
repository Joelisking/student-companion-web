import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

const healthService = new HealthService();

export class HealthController {
  public getHealth = (req: Request, res: Response) => {
    const healthStatus = healthService.getHealthStatus();
    res.json(healthStatus);
  };
}
