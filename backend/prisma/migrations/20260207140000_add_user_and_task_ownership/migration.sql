-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AlterTable: add userId to tasks (nullable first for existing rows)
ALTER TABLE "tasks" ADD COLUMN "userId" TEXT;

-- Create a default user and assign existing tasks to it (if any)
INSERT INTO "users" ("id", "email", "createdAt", "updatedAt")
SELECT '00000000-0000-0000-0000-000000000001', 'default@local.dev', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE "id" = '00000000-0000-0000-0000-000000000001');

UPDATE "tasks" SET "userId" = '00000000-0000-0000-0000-000000000001' WHERE "userId" IS NULL;

-- Now enforce NOT NULL and FK
ALTER TABLE "tasks" ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
