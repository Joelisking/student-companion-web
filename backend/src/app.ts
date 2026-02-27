import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import preferencesRoutes from './routes/preferences.routes';

const app = express();

// Trust the Next.js proxy (one hop). Required so express-rate-limit can
// correctly identify client IPs when X-Forwarded-For is set by the proxy.
app.set('trust proxy', 1);

// FRONTEND_URL is validated as required by src/lib/env.ts
const allowedOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);

// Routes (auth login is public; tasks and preferences require auth)
app.use('/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', generalLimiter, tasksRoutes);
app.use('/api/preferences', generalLimiter, preferencesRoutes);

// Error Handling
app.use(errorHandler);

export default app;
