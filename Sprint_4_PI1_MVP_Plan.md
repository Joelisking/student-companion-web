# Sprint 4 -- PI1 MVP: Task CRUD

Below is the structure with Epics → Stories hierarchy.

---

# Sprint Goal

Deliver a working MVP where an authenticated user can:

- Create Tasks
- Read Tasks
- Update Tasks
- Delete Tasks

End-to-end flow:

UI → API Proxy → Express Backend → Prisma → PostgreSQL

This sprint satisfies **PI1: CRUD Operations Complete**.

---

# EPIC 1: Backend Task CRUD API

## Story SC-43 --- Backend Testing Infrastructure (5 pts)

> **STATUS: ALREADY DONE** (merged in PR #33, branch `feature/SC-43-tdd-set-up-backend-testing-infra`)
>
> Jest, Supertest, and test helpers are already configured. See commit `d39bdf8`.

- Configure Jest
- Configure Supertest
- Mock Prisma
- Setup test database environment
- Ensure CI compatibility

---

## Story SC-44 --- Create Task Endpoint (3 pts)

> **STATUS: ALREADY DONE** (implemented as part of SC-33, merged in PR #20, branch `feature/SC-33-tasks-write-create-update-delete`)
>
> `POST /api/tasks` is fully implemented in `backend/src/controllers/task.controller.ts` and `backend/src/services/task.service.ts`.
> Returns 201 on success, 400 on validation failure, 401 if unauthenticated.
>
> **Note:** The current route is `/api/tasks`, not `/api/v1/tasks`. There is no API versioning in the codebase.

Implement:

POST /api/v1/tasks

Acceptance Criteria: - 201 on success - 400 on validation failure - 401
if unauthenticated - Task persisted in database

CRUD: Create

---

## Story SC-45 --- Update Task Endpoint (5 pts)

> **STATUS: ALREADY DONE** (implemented as part of SC-33, merged in PR #20)
>
> `PUT /api/tasks/:id` is fully implemented with ownership validation (403 Forbidden vs 404 Not Found).
> Also enhanced with user-scoped access in SC-27 (PR #25).

Implement:

PUT /api/v1/tasks/:id

Acceptance Criteria: - 200 on success - 404 if not found - 401 if
unauthenticated - Ownership validation enforced

CRUD: Update

---

## Story SC-46 --- Delete Task Endpoint (3 pts)

> **STATUS: ALREADY DONE** (implemented as part of SC-33, merged in PR #20)
>
> `DELETE /api/tasks/:id` is fully implemented. Returns 204 on success, 404 if not found, 403 if owned by another user.

Implement:

DELETE /api/v1/tasks/:id

Acceptance Criteria: - 204 on success - 404 if not found - 401 if
unauthenticated - Ownership validation enforced

CRUD: Delete

---

# EPIC 2: Frontend Task Management UI

## Story SC-48 --- Display Task List (3 pts)

> **STATUS: ALREADY DONE** (merged in PR #36, branch `feature/SC-48-display-task-list-on-tasks-page`)
>
> `components/TaskList.tsx` displays tasks with loading, empty, and error states. Integrated with NextAuth for authentication. See commit `47eb517`.

Frontend Tasks page must: - Call GET /api/v1/tasks - Display tasks -
Show loading state - Show empty state - Show error state

CRUD: Read

---

## Story SC-49 --- Create Task from UI (5 pts)

> **STATUS: ALREADY DONE** (merged in PR #37, branch `feature/SC-49-create-task-from-tasks-page`)
>
> `TaskModal` component supports creation with Zod validation, react-hook-form, and immediate UI update. See commit `db0d4b6`.

Frontend must: - Provide modal/form - Submit to POST endpoint - Update
UI immediately - Show validation errors

CRUD: Create

---

## Story SC-50 --- Edit and Delete from UI (8 pts)

> **STATUS: ALREADY DONE** (merged in PR #38, branch `feature/SC-50-edit-and-delete-tasks-from-tasks-p`)
>
> Edit uses the same `TaskModal` with pre-filled data. Delete uses a `DeleteConfirmationModal`. Both refresh UI state without full page reload. See commit `39d1eb8`.

Frontend must: - Pre-fill edit modal - Submit PUT request - Show delete
confirmation - Submit DELETE request - Refresh UI state without reload

CRUD: Update + Delete

---

> ## REVIEW SUMMARY -- ALL DEVELOPMENT STORIES ARE ALREADY COMPLETE
>
> Every story in Epic 1 and Epic 2 has already been implemented and merged into `development`.
> Additionally, **SC-53 (Task Filtering & Sorting)** was completed as bonus work (PR #34).
>
> **The PI1 goal (CRUD Operations Complete) is already satisfied on the `development` branch.**
>
> The only remaining work from this plan is Epic 3 (Governance) -- merging `develop` to `main` and tagging.
>
> Since Sprint 4 needs meaningful new work, replacement stories are suggested below.

---

> ## SUGGESTED REPLACEMENT STORIES
>
> Since all planned development is done, the sprint should pivot to hardening, quality, and production readiness. Below are replacement stories organized into new epics, sourced from the codebase audit performed on 2026-02-17.
>
> ---
>
> ### REPLACEMENT EPIC A: Security Hardening
>
> #### Story: Configure CORS Properly (2 pts)
>
> **File:** `backend/src/app.ts:13`
>
> Currently `app.use(cors())` accepts requests from ANY origin. This is a critical security vulnerability.
>
> - Restrict CORS to frontend origin via environment variable
> - Add credentials, methods, and allowedHeaders configuration
> - Add `FRONTEND_URL` to `.env.example`
> - Verify preflight requests work correctly
>
> #### Story: Add Security Headers with Helmet (2 pts)
>
> **File:** `backend/src/app.ts`
>
> No security headers are set. Missing XSS protection, clickjacking prevention, MIME sniffing protection, and HSTS.
>
> - Install and configure `helmet`
> - Configure Content-Security-Policy
> - Add request body size limits (`express.json({ limit: '10kb' })`)
> - Verify headers present in responses
>
> #### Story: Add Rate Limiting (3 pts)
>
> **File:** `backend/src/app.ts`
>
> No rate limiting on any endpoint. Vulnerable to brute force and DoS.
>
> - Install `express-rate-limit`
> - General API limiter (100 req/15min)
> - Stricter auth limiter (5 req/15min)
> - Rate limit headers in responses
> - Proper 429 error messages
>
> #### Story: Backend Input Validation with Zod (5 pts)
>
> **Files:** `backend/src/controllers/task.controller.ts`, `backend/src/controllers/auth.controller.ts`
>
> Controllers only check for empty strings. No format validation, length limits, or type safety.
>
> - Install `zod` on backend
> - Create validation schemas for tasks, auth, and preferences
> - Create reusable validation middleware
> - Validate string lengths, email format, date format, UUID format
> - Add password strength requirements (min 8 chars, uppercase, lowercase, number)
> - Return detailed validation error messages
>
> ---
>
> ### REPLACEMENT EPIC B: Backend Robustness
>
> #### Story: Fix Port Mismatch and Environment Validation (2 pts)
>
> **Files:** `next.config.ts:9`, `backend/.env.example:2`, `backend/src/server.ts:7`, `.env.example:10`
>
> Port is hardcoded as `5000` in `next.config.ts` but `.env.example` says `5001`. Environment variables are not validated on startup.
>
> - Standardize on port 5001
> - Make `next.config.ts` read from `BACKEND_URL` env var instead of hardcoding
> - Add startup validation for required env vars (`DATABASE_URL`, `INTERNAL_API_SECRET`)
> - Fail fast with clear error messages if vars are missing
>
> #### Story: Graceful Shutdown and Error Handling (3 pts)
>
> **Files:** `backend/src/server.ts`, `backend/src/middleware/errorHandler.ts`
>
> Server doesn't handle SIGTERM/SIGINT. Error handler leaks internal messages in production.
>
> - Handle SIGTERM and SIGINT signals
> - Close database connection on shutdown
> - Allow in-flight requests to complete (with 30s timeout)
> - Add `uncaughtException` and `unhandledRejection` handlers
> - Make error handler environment-aware (generic messages in production)
> - Create custom error classes (`AppError`, `NotFoundError`, `ValidationError`)
>
> #### Story: Enhance Health Check (1 pt)
>
> **File:** `backend/src/controllers/health.controller.ts`
>
> Health check doesn't verify database connectivity.
>
> - Add `SELECT 1` database ping to health endpoint
> - Return 503 if database is down
> - Include uptime and timestamp in response
>
> ---
>
> ### REPLACEMENT EPIC C: Test Coverage (if capacity allows)
>
> #### Story: Backend Integration Tests for Task CRUD (5 pts)
>
> Testing infrastructure exists (SC-43) but coverage for the full CRUD lifecycle is incomplete.
>
> - Integration tests for all 5 task endpoints (GET list, GET single, POST, PUT, DELETE)
> - Test authentication (401 for missing auth)
> - Test authorization (403 for wrong user)
> - Test validation (400 for bad input)
> - Test not found (404)
> - Minimum 70% coverage for task service and controller
>
> #### Story: Backend Integration Tests for Auth Endpoints (3 pts)
>
> - Test registration (success, duplicate email, invalid input)
> - Test login (success, wrong password, non-existent user)
> - Test session flow
>
> ---
>
> ### SUGGESTED SPRINT 4 POINT TOTALS (with replacements)
>
> | Epic | Points |
> |------|--------|
> | Epic A: Security Hardening | 12 pts |
> | Epic B: Backend Robustness | 6 pts |
> | Epic C: Test Coverage | 8 pts |
> | Epic 3: Governance & Release | 4 pts |
> | **Total** | **30 pts** |
>
> This replaces the original 36 pts. Adjust by including or excluding Epic C stories based on team capacity.
>
> ---
>
> ### SUGGESTED SPRINT GOAL (revised)
>
> Harden the MVP for production readiness: lock down security (CORS, rate limiting, input validation, security headers), improve backend robustness (graceful shutdown, env validation, health checks), and expand test coverage. Merge and tag as Sprint-4-PI1.
>
> PI1 (CRUD Operations Complete) was already satisfied by prior work. Sprint 4 now satisfies **PI1 + Security & Quality Baseline**.

---

# EPIC 3: Sprint Governance & Release Management

## Story --- Update Confluence (2 pts)

- Roles & Responsibilities page updated
- Point Tracking updated
- Tag Tracking updated

---

## Story --- Release & Tag (2 pts)

- Merge develop → main
- Create Git tag: Sprint-4-PI1
- Record tag in Confluence

---

# Definition of Done (Sprint 4)

A story is Done when:

- Feature works end-to-end
- Correct HTTP status codes returned
- Error handling implemented
- Frontend reflects backend state
- No console errors
- Tests written where applicable
- PR merged into develop
- develop merged into main
- Git tag created

---

# Total Points

Backend Epic: 16 pts\
Frontend Epic: 16 pts\
Governance Epic: 4 pts

Total: 36 pts

> **REVISED TOTALS (see replacement stories above):**
>
> Security Hardening: 12 pts\
> Backend Robustness: 6 pts\
> Test Coverage: 8 pts\
> Governance: 4 pts
>
> Revised Total: 30 pts

---

# PI1 Validation Checklist

> **All items below are already passing on the `development` branch.**

Backend: - POST creates task (201) - GET returns task - PUT updates
task - DELETE removes task - Proper error handling

Frontend: - Tasks load correctly - Create works - Edit works - Delete
works - No manual refresh required

If all above are true, Sprint 4 satisfies:

PI1 -- CRUD Operations Complete.
