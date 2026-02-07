-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "TaskComplexity" AS ENUM ('Simple', 'Moderate', 'Complex');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'InProgress', 'Completed');

-- CreateEnum
CREATE TYPE "PreferredStudyTime" AS ENUM ('Morning', 'Afternoon', 'Evening', 'Night');

-- CreateEnum
CREATE TYPE "WeekendPreference" AS ENUM ('Heavy', 'Light', 'Free');

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
    "complexity" "TaskComplexity" NOT NULL DEFAULT 'Moderate',
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_preferences" (
    "id" TEXT NOT NULL,
    "preferredTime" "PreferredStudyTime" NOT NULL DEFAULT 'Morning',
    "sessionLength" INTEGER NOT NULL,
    "breakLength" INTEGER NOT NULL,
    "weekendPreference" "WeekendPreference" NOT NULL DEFAULT 'Light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_dueDate_idx" ON "tasks"("dueDate");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_priority_idx" ON "tasks"("priority");
