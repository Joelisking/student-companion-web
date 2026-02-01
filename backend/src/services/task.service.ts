import { Task } from '../models/task.model';

export class TaskService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public createTask(taskData: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  public deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length !== initialLength;
  }
}
