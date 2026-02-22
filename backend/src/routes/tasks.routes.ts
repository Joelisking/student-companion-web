import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { TaskController } from '../controllers/task.controller';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  getTasksQuerySchema,
} from '../schemas/task.schema';

const router = Router();
const taskController = new TaskController();

router.use(requireAuth);

router.get('/', validate(getTasksQuerySchema, 'query'), taskController.getTasks);
router.get('/:id', validate(taskIdSchema, 'params'), taskController.getTask);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(taskIdSchema, 'params'), validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', validate(taskIdSchema, 'params'), taskController.deleteTask);

export default router;
