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

function serializeTask(task: PrismaTask & { userId?: string }): SerializedTask & { userId?: string } {
  return {
    id: task.id,
    userId: task.userId,
    title: task.title,
    course: task.course,
    dueDate: task.dueDate.toISOString(),
    priority: task.priority,
    complexity: task.complexity,
    status: statusToApi[task.status] ?? task.status,
    notes: task.notes,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function getAllTasks(userId: string): Promise<SerializedTask[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return tasks.map((t) => {
    const s = serializeTask(t);
    const { userId: _u, ...rest } = s;
    return rest as SerializedTask;
  });
}

export async function getTaskById(id: string): Promise<(SerializedTask & { userId: string }) | null> {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  const s = serializeTask(task);
  return { ...s, userId: task.userId } as SerializedTask & { userId: string };
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    course: string;
    dueDate: string;
    priority?: string;
    complexity?: string;
    notes?: string;
  }
): Promise<SerializedTask> {
  const task = await prisma.task.create({
    data: {
      userId,
      title: data.title,
      course: data.course,
      dueDate: new Date(data.dueDate),
      ...(data.priority && { priority: data.priority as PrismaTask['priority'] }),
      ...(data.complexity && { complexity: data.complexity as PrismaTask['complexity'] }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  const s = serializeTask(task);
  const { userId: _u, ...rest } = s;
  return rest as SerializedTask;
}

export type UpdateTaskResult = SerializedTask | null | { forbidden: true };

export async function updateTask(
  id: string,
  userId: string,
  updates: Record<string, unknown>
): Promise<UpdateTaskResult> {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  if (task.userId !== userId) return { forbidden: true };

  const data: Record<string, unknown> = { ...updates };
  if (typeof data.status === 'string' && data.status in statusToDb) {
    data.status = statusToDb[data.status];
  }
  if (typeof data.dueDate === 'string') {
    data.dueDate = new Date(data.dueDate as string);
  }
  delete data.id;
  delete data.userId;

  try {
    const updated = await prisma.task.update({ where: { id }, data });
    const s = serializeTask(updated);
    const { userId: _u, ...rest } = s;
    return rest as SerializedTask;
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

export async function deleteTask(id: string, userId: string): Promise<null | true | { forbidden: true }> {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  if (task.userId !== userId) return { forbidden: true };
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
      return null;
    }
    throw err;
  }
}
