# Sprint 3 Plan

## Sprint Goal

Complete MVP CRUD operations with test coverage using TDD methodology, and deliver functional frontend pages for task management and study preferences.

## Point Reference

| Points | Complexity Example |
|--------|--------------------|
| 1 | Health check endpoint (GET /health) |
| 2 | API client setup, backend connection indicator |
| 3 | Express backend initialization, middleware setup, task & preferences forms |
| 5 | Tasks API, study preferences API, scheduling rules spike |
| 8 | End-to-end task creation flow (frontend form → backend → list view) |

---

## Epic 1: TDD — Backend Task Write Operations (SC-TDD)

Test-driven development for task create, update, and delete operations. Tests are written first (red), then implementation is verified/fixed to pass (green).

### SC-36: Set Up Backend Testing Infrastructure

**Points:** 2

**Description:**
As a developer, I want a testing framework configured for the backend so that I can write and run automated tests for all API endpoints.

**Acceptance Criteria:**

- Jest is installed and configured for TypeScript with CommonJS modules
- Supertest is installed for HTTP endpoint testing
- A test script is added to `backend/package.json` that runs all `*.test.ts` files
- Test environment is isolated from development and production databases
- A test utility/helper exists for creating authenticated requests (setting `X-User-Id` header)
- A test utility/helper exists for seeding and cleaning up test data
- Tests can be run with `npm test` from the `backend/` directory
- At least one smoke test passes to verify the setup works (e.g., health check returns 200)

---

### SC-37: TDD — Task Creation Endpoint (POST /api/tasks)

**Points:** 3

**Description:**
As a student, I want the system to validate my task data when I create a new task so that only complete and valid tasks are saved to my account.

**Acceptance Criteria:**

Authentication:
- Returns 401 Unauthorized if no authentication token or session is provided

Required field validation:
- Returns 400 Bad Request if `title` is missing from the request body
- Returns 400 Bad Request if `title` is an empty string
- Returns 400 Bad Request if `course` is missing from the request body
- Returns 400 Bad Request if `course` is an empty string
- Returns 400 Bad Request if `dueDate` is missing from the request body
- Returns 400 Bad Request if `dueDate` is an empty string
- Response body includes a descriptive error message indicating which field is invalid

Enum field validation:
- Returns 400 Bad Request if `priority` is provided but is not one of `High`, `Medium`, `Low`
- Returns 400 Bad Request if `complexity` is provided but is not one of `Simple`, `Moderate`, `Complex`

Successful creation:
- Returns 201 Created when all required fields (`title`, `course`, `dueDate`) are provided and valid
- Response body contains the full created task object as JSON
- Created task includes a server-generated `id` (UUID)
- Created task includes `createdAt` and `updatedAt` timestamps
- Created task `userId` matches the authenticated user's ID
- Default `priority` is `Medium` when not provided
- Default `complexity` is `Moderate` when not provided
- Default `status` is `Pending`

User scoping:
- Created task is only visible to the authenticated user who created it
- Creating a task does not affect other users' task lists

---

### SC-38: TDD — Task Update Endpoint (PUT /api/tasks/:id)

**Points:** 3

**Description:**
As a student, I want to update my existing tasks with partial changes so that I can correct details, change priority, or mark tasks as complete without resubmitting all fields.

**Acceptance Criteria:**

Authentication:
- Returns 401 Unauthorized if no authentication token or session is provided

Task lookup and ownership:
- Returns 404 Not Found if the task ID does not exist in the database
- Returns 403 Forbidden if the task exists but belongs to a different user
- Error response does not reveal whether the task exists when returning 403

Enum field validation:
- Returns 400 Bad Request if `priority` is provided but is not one of `High`, `Medium`, `Low`
- Returns 400 Bad Request if `complexity` is provided but is not one of `Simple`, `Moderate`, `Complex`
- Returns 400 Bad Request if `status` is provided but is not one of `Pending`, `In Progress`, `Completed`
- Response body includes a descriptive error message indicating the invalid field

Partial update behavior:
- Supports partial updates — only fields included in the request body are changed
- Fields not included in the request body retain their existing values
- Updating `title` alone does not change `course`, `dueDate`, or any other field
- Updating `status` to `Completed` does not alter any other field

Immutable fields:
- Cannot change the `id` field
- Cannot change the `userId` field
- Cannot change the `createdAt` field

Successful update:
- Returns 200 OK with the full updated task object as JSON
- `updatedAt` timestamp is refreshed to reflect the time of the update
- Updated values are persisted and returned on subsequent GET requests

---

### SC-39: TDD — Task Deletion Endpoint (DELETE /api/tasks/:id)

**Points:** 2

**Description:**
As a student, I want to delete tasks that I no longer need so that my task list stays clean and only shows relevant work.

**Acceptance Criteria:**

Authentication:
- Returns 401 Unauthorized if no authentication token or session is provided

Task lookup and ownership:
- Returns 404 Not Found if the task ID does not exist in the database
- Returns 403 Forbidden if the task exists but belongs to a different user
- Error response does not reveal whether the task exists when returning 403

Successful deletion:
- Returns 204 No Content on successful deletion
- Response body is empty
- Task is permanently removed from the database
- Deleted task no longer appears in GET /api/tasks for the owning user
- Subsequent GET /api/tasks/:id for the deleted task returns 404

Isolation:
- Deleting a task does not affect any other tasks belonging to the same user
- Deleting a task does not affect any tasks belonging to other users

---

## Epic 2: Frontend Task Management Page (SC-TASKS-UI)

Wire up existing task components into the authenticated `/tasks` page to deliver full end-to-end task CRUD from the browser.

### SC-40: Display Task List on Tasks Page

**Points:** 3

**Description:**
As a student, I want to see all my tasks on the tasks page so that I can review what I need to work on.

**Acceptance Criteria:**

Authentication and routing:
- Page is only accessible to authenticated users
- Unauthenticated users are redirected to `/login`

Data loading:
- On page load, tasks are fetched from GET /api/tasks via the API proxy
- A loading indicator is displayed while tasks are being fetched
- An error message is displayed if the API request fails
- If the user has no tasks, a friendly empty state message is shown (e.g., "No tasks yet")

Task display:
- Each task displays its title, course, due date, priority, and status
- Tasks are displayed in a list or card layout
- Priority is visually distinguishable (e.g., color-coded or labeled)
- Due dates are formatted in a human-readable format
- Task status (Pending, In Progress, Completed) is clearly visible

---

### SC-41: Create Task from Tasks Page

**Points:** 3

**Description:**
As a student, I want to create a new task from the tasks page so that I can add work items without leaving my task list.

**Acceptance Criteria:**

Form access:
- A clearly visible "Add Task" or "New Task" button is present on the tasks page
- Clicking the button reveals the task creation form (inline or modal)

Form validation (client-side):
- Title field is required — form cannot be submitted if empty
- Course field is required — form cannot be submitted if empty
- Due Date field is required — form cannot be submitted if empty
- Priority field defaults to `Medium` and accepts only `High`, `Medium`, `Low`
- Complexity field defaults to `Moderate` and accepts only `Simple`, `Moderate`, `Complex`
- Validation errors are displayed inline next to the relevant field

Successful submission:
- Form submits a POST request to /api/tasks via the API proxy
- On success, the task list refreshes to include the newly created task
- The form is cleared/closed after successful creation
- A success indicator is shown (e.g., the new task appears in the list)

Error handling:
- If the API returns an error, a user-friendly error message is displayed
- The form retains its values on error so the user does not lose input

---

### SC-42: Edit and Delete Tasks from Tasks Page

**Points:** 5

**Description:**
As a student, I want to edit and delete my tasks from the tasks page so that I can keep my task list accurate and up to date.

**Acceptance Criteria:**

Edit functionality:
- Each task card has an edit action (button or icon)
- Clicking edit opens a pre-populated edit form (modal or inline) with the task's current values
- All editable fields are available: title, course, due date, priority, complexity, status, notes
- Client-side validation matches creation rules (title, course, due date required)
- Submitting sends a PUT request to /api/tasks/:id via the API proxy
- On success, the task list refreshes to show the updated values
- The edit form closes after successful update
- If the API returns an error, the error is displayed and the form retains its values

Delete functionality:
- Each task card has a delete action (button or icon)
- Clicking delete shows a confirmation prompt before proceeding (e.g., "Are you sure?")
- Confirming sends a DELETE request to /api/tasks/:id via the API proxy
- On success, the task is removed from the displayed list without a full page reload
- If the API returns an error, a user-friendly error message is displayed

Status updates:
- A student can change a task's status to `Pending`, `In Progress`, or `Completed`
- Status change is persisted immediately via PUT /api/tasks/:id

---

## Epic 3: Frontend Study Preferences Page (SC-PREFS-UI)

Wire up the existing study preferences form into the authenticated `/preferences` page.

### SC-43: Load and Save Study Preferences

**Points:** 5

**Description:**
As a student, I want to view and manage my study preferences on the preferences page so that I can customize my study schedule settings.

**Acceptance Criteria:**

Authentication and routing:
- Page is only accessible to authenticated users
- Unauthenticated users are redirected to `/login`

Loading existing preferences:
- On page load, preferences are fetched from GET /api/preferences via the API proxy
- A loading indicator is displayed while preferences are being fetched
- If the user has no saved preferences, the form is pre-populated with defaults (Morning, 45 min session, 10 min break, Light weekend)
- If the user has saved preferences, the form is pre-populated with their saved values

Form fields and validation:
- Preferred Study Time is selectable with options: Morning, Afternoon, Evening, Night
- Session Length accepts a number between 5 and 180 (minutes)
- Break Length accepts a number between 1 and 60 (minutes)
- Weekend Preference is selectable with options: Heavy, Light, Free
- Validation errors are displayed inline if values are out of range

Saving preferences (first time):
- If no preferences exist, submitting sends a POST request to /api/preferences
- Returns 201 and the form indicates success (e.g., "Preferences saved")

Updating preferences (existing):
- If preferences already exist, submitting sends a PUT request to /api/preferences
- Returns 200 and the form indicates success (e.g., "Preferences updated")

Error handling:
- If the API returns an error on load, an error message is displayed with a retry option
- If the API returns an error on save/update, the error is displayed and form values are preserved

---

## Sprint Summary

| Story | Title | Points | Epic |
|-------|-------|--------|------|
| SC-36 | Set up backend testing infrastructure | 2 | TDD Backend |
| SC-37 | TDD — Task creation endpoint | 3 | TDD Backend |
| SC-38 | TDD — Task update endpoint | 3 | TDD Backend |
| SC-39 | TDD — Task deletion endpoint | 2 | TDD Backend |
| SC-40 | Display task list on tasks page | 3 | Frontend Tasks |
| SC-41 | Create task from tasks page | 3 | Frontend Tasks |
| SC-42 | Edit and delete tasks from tasks page | 5 | Frontend Tasks |
| SC-43 | Load and save study preferences | 5 | Frontend Study Preferences |
| | **Total** | **26** | |
