import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/task.service';

export class TaskController {
  public getTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId!;
      const tasks = await taskService.getAllTasks(userId);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  public getTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const result = await taskService.getTask(userId, id as string);

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

  public createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId!;
      const { title, course, dueDate, priority, complexity, notes } =
        req.body;

      if (!title || !course || !dueDate) {
        res
          .status(400)
          .json({
            message:
              'Missing required fields: title, course, dueDate',
          });
        return;
      }

      const newTask = await taskService.createTask(userId, {
        title,
        course,
        dueDate,
        priority: priority || 'Medium',
        complexity: complexity || 'Moderate',
        notes,
      });

      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  };

  public updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const body = req.body as Record<string, unknown>;
      if (
        body.title !== undefined &&
        (typeof body.title !== 'string' || !body.title.trim())
      ) {
        res
          .status(400)
          .json({ message: 'title must be a non-empty string' });
        return;
      }
      if (
        body.course !== undefined &&
        (typeof body.course !== 'string' || !body.course.trim())
      ) {
        res
          .status(400)
          .json({ message: 'course must be a non-empty string' });
        return;
      }
      if (
        body.dueDate !== undefined &&
        (typeof body.dueDate !== 'string' || !body.dueDate.trim())
      ) {
        res
          .status(400)
          .json({ message: 'dueDate must be a non-empty string' });
        return;
      }
      const result = await taskService.updateTask(
        id as string,
        userId,
        body
      );

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

  public deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const result = await taskService.deleteTask(
        id as string,
        userId
      );

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
