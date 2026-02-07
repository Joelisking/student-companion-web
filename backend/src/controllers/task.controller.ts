import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';

export class TaskController {
  public getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  public getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id as string);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, course, dueDate, priority, complexity, notes } = req.body;

      if (!title || !course || !dueDate) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const newTask = await taskService.createTask({
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

  public updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedTask = await taskService.updateTask(id as string, req.body);

      if (!updatedTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  };

  public deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const success = await taskService.deleteTask(id as string);

      if (!success) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
