// Mock the Prisma client module before any imports use it.
// Each model gets its own set of jest.fn() mocks that tests can configure.

/* eslint-disable @typescript-eslint/no-explicit-any */
const mockPrisma = {
  user: {
    findUnique: jest.fn() as jest.Mock<any, any>,
    findMany: jest.fn() as jest.Mock<any, any>,
    create: jest.fn() as jest.Mock<any, any>,
    update: jest.fn() as jest.Mock<any, any>,
    delete: jest.fn() as jest.Mock<any, any>,
  },
  task: {
    findUnique: jest.fn() as jest.Mock<any, any>,
    findFirst: jest.fn() as jest.Mock<any, any>,
    findMany: jest.fn() as jest.Mock<any, any>,
    create: jest.fn() as jest.Mock<any, any>,
    update: jest.fn() as jest.Mock<any, any>,
    updateMany: jest.fn() as jest.Mock<any, any>,
    delete: jest.fn() as jest.Mock<any, any>,
    deleteMany: jest.fn() as jest.Mock<any, any>,
  },
  studyPreference: {
    findUnique: jest.fn() as jest.Mock<any, any>,
    findMany: jest.fn() as jest.Mock<any, any>,
    create: jest.fn() as jest.Mock<any, any>,
    update: jest.fn() as jest.Mock<any, any>,
    upsert: jest.fn() as jest.Mock<any, any>,
    delete: jest.fn() as jest.Mock<any, any>,
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

export { mockPrisma };
