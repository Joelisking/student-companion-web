import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/task.service';

export class TaskController {
  /** GET /api/tasks — query validated by getTasksQuerySchema middleware */
  public getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { status, priority, sortBy, order } = req.query as any;
      const tasks = await taskService.getAllTasks(userId, { status, priority, sortBy, order });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  /** GET /api/tasks/:id — params validated by taskIdSchema middleware */
  public getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const userId = req.userId!;
      const result = await taskService.getTask(userId, id);

      if (!result) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if ('forbidden' in result) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  /** POST /api/tasks — body validated by createTaskSchema middleware */
  public createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { title, course, dueDate, priority, complexity, notes } = req.body;

      const newTask = await taskService.createTask(userId, {
        title,
        course,
        dueDate,
        priority,
        complexity,
        notes,
      });

      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  };

  /** PUT /api/tasks/:id — params/body validated by taskIdSchema + updateTaskSchema middleware */
  public updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const userId = req.userId!;
      const result = await taskService.updateTask(id, userId, req.body);

      if (result === null) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if ('forbidden' in result && result.forbidden) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  /** DELETE /api/tasks/:id — params validated by taskIdSchema middleware */
  public deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const userId = req.userId!;
      const result = await taskService.deleteTask(id, userId);

      if (result === null) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (typeof result === 'object' && 'forbidden' in result) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
