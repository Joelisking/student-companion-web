import prisma from '../lib/prisma';
import { Task as PrismaTask, TaskStatus } from '../generated/prisma/client';

// Map DB enum values to API-friendly values
const statusToApi: Record<TaskStatus, string> = {
  Pending: 'Pending',
  InProgress: 'In Progress',
  Completed: 'Completed',
};

// Map API-friendly values to DB enum values
const statusToDb: Record<string, TaskStatus> = {
  Pending: 'Pending',
  'In Progress': 'InProgress',
  Completed: 'Completed',
};

export interface SerializedTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: string;
  complexity: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

function serializeTask(task: PrismaTask): SerializedTask {
  return {
    ...task,
    status: statusToApi[task.status] ?? task.status,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function getAllTasks(): Promise<SerializedTask[]> {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return tasks.map(serializeTask);
}

export async function getTaskById(id: string): Promise<SerializedTask | null> {
  const task = await prisma.task.findUnique({ where: { id } });
  return task ? serializeTask(task) : null;
}

export async function createTask(data: {
  title: string;
  course: string;
  dueDate: string;
  priority?: string;
  complexity?: string;
  notes?: string;
}): Promise<SerializedTask> {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      course: data.course,
      dueDate: new Date(data.dueDate),
      ...(data.priority && { priority: data.priority as PrismaTask['priority'] }),
      ...(data.complexity && { complexity: data.complexity as PrismaTask['complexity'] }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  return serializeTask(task);
}

export async function updateTask(
  id: string,
  updates: Record<string, unknown>,
): Promise<SerializedTask | null> {
  const data: Record<string, unknown> = { ...updates };

  // Map status from API format to DB enum
  if (typeof data.status === 'string' && data.status in statusToDb) {
    data.status = statusToDb[data.status];
  }

  // Convert dueDate string to Date
  if (typeof data.dueDate === 'string') {
    data.dueDate = new Date(data.dueDate as string);
  }

  // Don't allow updating id
  delete data.id;

  try {
    const task = await prisma.task.update({ where: { id }, data });
    return serializeTask(task);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      return null;
    }
    throw err;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      return false;
    }
    throw err;
  }
}
