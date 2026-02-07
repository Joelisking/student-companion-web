import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export class TaskController {
  public getTasks = (req: Request, res: Response) => {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  };

  public createTask = (req: Request, res: Response) => {
    const { title, course, dueDate, priority, complexity, notes } =
      req.body;

    if (!title || !course || !dueDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newTask = taskService.createTask({
      title,
      course,
      dueDate,
      priority: priority || 'Medium',
      complexity: complexity || 'Moderate',
      notes,
    });

    res.status(201).json(newTask);
  };

  public updateTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedTask = taskService.updateTask(
      id as string,
      req.body
    );

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(updatedTask);
  };

  public deleteTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const success = taskService.deleteTask(id as string);

    if (!success) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(204).send();
  };
}
