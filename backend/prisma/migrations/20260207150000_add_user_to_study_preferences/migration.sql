-- AlterTable: add userId to study_preferences (nullable first)
ALTER TABLE "study_preferences" ADD COLUMN "userId" TEXT;

-- Assign existing rows to default user (same as tasks migration)
UPDATE "study_preferences" SET "userId" = '00000000-0000-0000-0000-000000000001' WHERE "userId" IS NULL;

-- Ensure default user exists (idempotent)
INSERT INTO "users" ("id", "email", "createdAt", "updatedAt")
SELECT '00000000-0000-0000-0000-000000000001', 'default@local.dev', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE "id" = '00000000-0000-0000-0000-000000000001');

ALTER TABLE "study_preferences" ALTER COLUMN "userId" SET NOT NULL;

CREATE UNIQUE INDEX "study_preferences_userId_key" ON "study_preferences"("userId");
CREATE INDEX "study_preferences_userId_idx" ON "study_preferences"("userId");

ALTER TABLE "study_preferences" ADD CONSTRAINT "study_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
