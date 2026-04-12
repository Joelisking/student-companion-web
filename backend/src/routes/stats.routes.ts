import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { StatsController } from '../controllers/stats.controller';

const router = Router();
const statsController = new StatsController();

router.use(requireAuth);
router.get('/', statsController.getStats);

export default router;
