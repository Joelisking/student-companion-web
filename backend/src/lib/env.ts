/**
 * Validates required environment variables at startup.
 * Call this before importing anything that reads process.env.
 * The process exits immediately if any required variable is missing.
 */

const REQUIRED_VARS = ['DATABASE_URL', 'INTERNAL_API_SECRET', 'FRONTEND_URL'] as const;

function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('Set the missing variables and restart the server.');
    process.exit(1);
  }
}

validateEnv();

export const env = {
  PORT: parseInt(process.env.PORT ?? '5001', 10),
  DATABASE_URL: process.env.DATABASE_URL as string,
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
