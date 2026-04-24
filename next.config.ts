import type { NextConfig } from 'next';

const REQUIRED_VARS = ['BACKEND_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'INTERNAL_API_SECRET'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error('Set the missing variables in .env.local and restart.');
  process.exit(1);
}

const nextConfig: NextConfig = {};

export default nextConfig;
