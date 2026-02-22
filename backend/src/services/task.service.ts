import prisma from '../lib/prisma';
import {
  Task as PrismaTask,
  TaskComplexity,
  TaskPriority,
  TaskStatus,
} from '../generated/prisma/client';

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

function serializeTask(
  task: PrismaTask & { userId?: string }
): SerializedTask & { userId?: string } {
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

export interface TaskQueryOptions {
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function getAllTasks(
  userId: string,
  options: TaskQueryOptions = {}
): Promise<SerializedTask[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  let results = tasks.map(
    (
      t: {
        id: string;
        userId: string;
        title: string;
        course: string;
        dueDate: Date;
        priority: TaskPriority;
        complexity: TaskComplexity;
        status: TaskStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      } & { userId?: string }
    ) => {
      const s = serializeTask(t);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _u, ...rest } = s;
      return rest as SerializedTask;
    }
  );

  // Apply status filter
  if (options.status) {
    results = results.filter(
      (t: { status: string | undefined }) =>
        t.status === options.status
    );
  }

  // Apply priority filter
  if (options.priority) {
    results = results.filter(
      (t: { priority: string | undefined }) =>
        t.priority === options.priority
    );
  }

  // Apply sorting
  if (options.sortBy) {
    const field = options.sortBy as keyof SerializedTask;
    const direction = options.order === 'asc' ? 1 : -1;
    results.sort(
      (a: SerializedTask, b: SerializedTask) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        if (valA < valB) return -1 * direction;
        if (valA > valB) return 1 * direction;
        return 0;
      }
    );
  }

  return results;
}

// Internal use only - strictly for fallback checks
export async function getTaskUnscoped(
  id: string
): Promise<(SerializedTask & { userId: string }) | null> {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return null;
  const s = serializeTask(task);
  return { ...s, userId: task.userId } as SerializedTask & {
    userId: string;
  };
}

export async function getTask(
  userId: string,
  id: string
): Promise<SerializedTask | null | { forbidden: true }> {
  // Primary: Scoped query
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (task) {
    const s = serializeTask(task);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _u, ...rest } = s;
    return rest as SerializedTask;
  }

  // Secondary: Check if exists for 403 vs 404
  const exists = await prisma.task.findUnique({ where: { id } });
  if (exists) {
    return { forbidden: true };
  }

  return null;
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
      ...(data.priority && {
        priority: data.priority as PrismaTask['priority'],
      }),
      ...(data.complexity && {
        complexity: data.complexity as PrismaTask['complexity'],
      }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  const s = serializeTask(task);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId: _u, ...rest } = s;
  return rest as SerializedTask;
}

export type UpdateTaskResult =
  | SerializedTask
  | null
  | { forbidden: true };

export async function updateTask(
  id: string,
  userId: string,
  updates: Record<string, unknown>
): Promise<UpdateTaskResult> {
  const data: Record<string, unknown> = { ...updates };
  if (typeof data.status === 'string' && data.status in statusToDb) {
    data.status = statusToDb[data.status];
  }
  if (typeof data.dueDate === 'string') {
    data.dueDate = new Date(data.dueDate as string);
  }
  delete data.id;
  delete data.userId;

  // Primary: Scoped update
  // Since 'id' + 'userId' is not a unique constraint, we must use updateMany.
  const result = await prisma.task.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count > 0) {
    // Fetch and return the updated task
    const updated = await prisma.task.findFirst({
      where: { id, userId },
    });
    // This should ideally never be null if updateMany succeeded
    if (updated) {
      const s = serializeTask(updated);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _u, ...rest } = s;
      return rest as SerializedTask;
    }
  }

  // Secondary: Check if exists for 403 vs 404
  const exists = await prisma.task.findUnique({ where: { id } });
  if (exists) {
    return { forbidden: true };
  }

  return null;
}

export async function deleteTask(
  id: string,
  userId: string
): Promise<null | true | { forbidden: true }> {
  // Primary: Scoped delete
  const result = await prisma.task.deleteMany({
    where: { id, userId },
  });

  if (result.count > 0) {
    return true;
  }

  // Secondary: Check if exists for 403 vs 404
  const exists = await prisma.task.findUnique({ where: { id } });
  if (exists) {
    return { forbidden: true };
  }

  return null;
}
