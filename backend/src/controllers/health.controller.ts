import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

const healthService = new HealthService();

export class HealthController {
  public getHealth = async (req: Request, res: Response) => {
    const healthStatus = await healthService.getHealthStatus();
    const httpStatus = healthStatus.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(healthStatus);
  };
}
