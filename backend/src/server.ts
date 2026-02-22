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
}

startServer();
