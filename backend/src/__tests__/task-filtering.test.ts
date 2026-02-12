import { mockPrisma } from './helpers/prisma.mock';
import {
  authenticatedRequest,
} from './helpers/auth.helper';
import { taskRecord, resetIdCounter } from './helpers/test-data';

beforeEach(() => {
  resetIdCounter();
  jest.clearAllMocks();
});

describe('GET /api/tasks — Filtering', () => {
  describe('status filter', () => {
    it('returns only tasks matching ?status=Pending', async () => {
      const pending = taskRecord({ status: 'Pending' });
      const completed = taskRecord({ status: 'Completed' });
      mockPrisma.task.findMany.mockResolvedValue([pending, completed]);

      const response = await authenticatedRequest().get(
        '/api/tasks?status=Pending'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('Pending');
    });

    it('returns only tasks matching ?status=In Progress', async () => {
      const inProgress = taskRecord({ status: 'InProgress' });
      const pending = taskRecord({ status: 'Pending' });
      mockPrisma.task.findMany.mockResolvedValue([inProgress, pending]);

      const response = await authenticatedRequest().get(
        '/api/tasks?status=In%20Progress'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('In Progress');
    });

    it('returns 400 if status is invalid', async () => {
      const response = await authenticatedRequest().get(
        '/api/tasks?status=InvalidStatus'
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('priority filter', () => {
    it('returns only tasks matching ?priority=High', async () => {
      const high = taskRecord({ priority: 'High' });
      const low = taskRecord({ priority: 'Low' });
      mockPrisma.task.findMany.mockResolvedValue([high, low]);

      const response = await authenticatedRequest().get(
        '/api/tasks?priority=High'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].priority).toBe('High');
    });

    it('returns 400 if priority is invalid', async () => {
      const response = await authenticatedRequest().get(
        '/api/tasks?priority=Urgent'
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('combined filters', () => {
    it('returns tasks matching both ?status=Pending&priority=High', async () => {
      const match = taskRecord({ status: 'Pending', priority: 'High' });
      const noMatch1 = taskRecord({ status: 'Completed', priority: 'High' });
      const noMatch2 = taskRecord({ status: 'Pending', priority: 'Low' });
      mockPrisma.task.findMany.mockResolvedValue([match, noMatch1, noMatch2]);

      const response = await authenticatedRequest().get(
        '/api/tasks?status=Pending&priority=High'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('Pending');
      expect(response.body[0].priority).toBe('High');
    });
  });
});

describe('GET /api/tasks — Sorting', () => {
  describe('sortBy and order params', () => {
    it('returns tasks sorted by dueDate ascending', async () => {
      const earlier = taskRecord({
        title: 'Earlier',
        dueDate: new Date('2026-02-01'),
      });
      const later = taskRecord({
        title: 'Later',
        dueDate: new Date('2026-04-01'),
      });
      mockPrisma.task.findMany.mockResolvedValue([later, earlier]);

      const response = await authenticatedRequest().get(
        '/api/tasks?sortBy=dueDate&order=asc'
      );

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Earlier');
      expect(response.body[1].title).toBe('Later');
    });

    it('returns tasks sorted by dueDate descending', async () => {
      const earlier = taskRecord({
        title: 'Earlier',
        dueDate: new Date('2026-02-01'),
      });
      const later = taskRecord({
        title: 'Later',
        dueDate: new Date('2026-04-01'),
      });
      mockPrisma.task.findMany.mockResolvedValue([earlier, later]);

      const response = await authenticatedRequest().get(
        '/api/tasks?sortBy=dueDate&order=desc'
      );

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Later');
      expect(response.body[1].title).toBe('Earlier');
    });

    it('returns 400 if sortBy is invalid', async () => {
      const response = await authenticatedRequest().get(
        '/api/tasks?sortBy=title'
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('returns 400 if order is invalid', async () => {
      const response = await authenticatedRequest().get(
        '/api/tasks?sortBy=dueDate&order=sideways'
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
