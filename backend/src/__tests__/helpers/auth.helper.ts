import request from 'supertest';
import app from '../../app';

const TEST_USER_ID = 'test-user-id-1';
const OTHER_USER_ID = 'test-user-id-2';

/**
 * Creates an authenticated supertest agent with the X-User-Id header set.
 */
function authenticatedRequest(userId: string = TEST_USER_ID) {
  return {
    get: (url: string) => request(app).get(url).set('X-User-Id', userId),
    post: (url: string) => request(app).post(url).set('X-User-Id', userId),
    put: (url: string) => request(app).put(url).set('X-User-Id', userId),
    delete: (url: string) => request(app).delete(url).set('X-User-Id', userId),
  };
}

/**
 * Creates an unauthenticated supertest agent (no auth headers).
 */
function unauthenticatedRequest() {
  return {
    get: (url: string) => request(app).get(url),
    post: (url: string) => request(app).post(url),
    put: (url: string) => request(app).put(url),
    delete: (url: string) => request(app).delete(url),
  };
}

export { authenticatedRequest, unauthenticatedRequest, TEST_USER_ID, OTHER_USER_ID };
