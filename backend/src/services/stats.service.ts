import prisma from '../lib/prisma';

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionPercentage: number;
}

export async function getTaskStats(userId: string): Promise<TaskStats> {
  const groups = await prisma.task.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true },
  });

  const countByStatus: Record<string, number> = {};
  for (const g of groups) {
    countByStatus[g.status] = g._count.id;
  }

  const completed = countByStatus['Completed'] ?? 0;
  const inProgress = countByStatus['InProgress'] ?? 0;
  const pending = countByStatus['Pending'] ?? 0;
  const total = completed + inProgress + pending;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, inProgress, pending, completionPercentage };
}
