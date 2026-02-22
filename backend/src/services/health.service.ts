import prisma from '../lib/prisma';

export class HealthService {
  public async getHealthStatus() {
    let dbStatus: 'ok' | 'error' = 'ok';
    let dbError: string | undefined;

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      dbStatus = 'error';
      dbError = err instanceof Error ? err.message : 'Unknown database error';
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'error',
      database: { status: dbStatus, ...(dbError ? { error: dbError } : {}) },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
