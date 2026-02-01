import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import tasksRoutes from './routes/tasks.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRoutes);
app.use('/api/tasks', tasksRoutes);

// Error Handling
app.use(errorHandler);

export default app;
