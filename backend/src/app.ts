import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import preferencesRoutes from './routes/preferences.routes';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

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
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/preferences', preferencesRoutes);

// Error Handling
app.use(errorHandler);

export default app;
