import dotenv from 'dotenv';
dotenv.config();

import './lib/env'; // validate required env vars — exits immediately if any are missing

import app from './app';
import prisma from './lib/prisma';
import { env } from './lib/env';

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  async function shutdown(signal: string) {
    console.log(`${signal} received. Shutting down gracefully...`);

    server.close(async (err) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
        process.exit(1);
      }

      try {
        await prisma.$disconnect();
        console.log('Database disconnected');
        process.exit(0);
      } catch (disconnectErr) {
        console.error('Error disconnecting from database:', disconnectErr);
        process.exit(1);
      }
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      console.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
