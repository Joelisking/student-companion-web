export class HealthService {
  public getHealthStatus() {
    return {
      status: 'OK',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
