import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import preferencesRoutes from './routes/preferences.routes';
import statsRoutes from './routes/stats.routes';
import usersRoutes from './routes/users.routes';

const app = express();

app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', usersRoutes);

// Error Handling
app.use(errorHandler);

export default app;
