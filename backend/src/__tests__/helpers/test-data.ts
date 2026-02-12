import { TEST_USER_ID, OTHER_USER_ID } from './auth.helper';

/**
 * Factory functions for creating test data objects.
 * These return plain objects matching what Prisma would return from the DB.
 */

let counter = 0;

function nextId(): string {
  counter++;
  return `test-task-${counter}`;
}

/** Reset the counter between test suites if needed */
function resetIdCounter(): void {
  counter = 0;
}

/** A valid task creation request body with all required fields */
function validTaskBody(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Complete homework',
    course: 'CS 101',
    dueDate: '2026-03-01T00:00:00.000Z',
    ...overrides,
  };
}

/** A task record as it would be returned from the database */
function taskRecord(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  const now = new Date();
  return {
    id,
    userId: TEST_USER_ID,
    title: 'Complete homework',
    course: 'CS 101',
    dueDate: now,
    priority: 'Medium',
    complexity: 'Moderate',
    status: 'Pending',
    notes: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/** A task record belonging to a different user */
function otherUserTaskRecord(overrides: Record<string, unknown> = {}) {
  return taskRecord({ userId: OTHER_USER_ID, ...overrides });
}

export { validTaskBody, taskRecord, otherUserTaskRecord, resetIdCounter };
