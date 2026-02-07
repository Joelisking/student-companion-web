import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.use(requireAuth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
