-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('LIFT', 'REST', 'CARDIO');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayTemplate" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "dayName" TEXT NOT NULL,
    "type" "DayType" NOT NULL,
    "skillName" TEXT,

    CONSTRAINT "DayTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayTemplateExercise" (
    "id" TEXT NOT NULL,
    "dayTemplateId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "scheme" TEXT NOT NULL,

    CONSTRAINT "DayTemplateExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" TEXT NOT NULL,
    "workoutLogId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "reps" INTEGER,
    "isPr" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "holdSeconds" INTEGER,
    "attempts" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "durationSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoreLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardioLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardioLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarmupLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarmupLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyweightLog" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyweightLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "weightKg" DOUBLE PRECISION NOT NULL DEFAULT 61,
    "heightCm" DOUBLE PRECISION NOT NULL DEFAULT 170,
    "age" INTEGER NOT NULL DEFAULT 25,
    "activityMult" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
    "proteinPerKg" DOUBLE PRECISION NOT NULL DEFAULT 1.8,
    "surplusPct" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayTemplate_dayOfWeek_key" ON "DayTemplate"("dayOfWeek");

-- CreateIndex
CREATE INDEX "DayTemplateExercise_dayTemplateId_idx" ON "DayTemplateExercise"("dayTemplateId");

-- CreateIndex
CREATE INDEX "WorkoutLog_exerciseId_date_idx" ON "WorkoutLog"("exerciseId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_exerciseId_date_key" ON "WorkoutLog"("exerciseId", "date");

-- CreateIndex
CREATE INDEX "WorkoutSet_exerciseId_idx" ON "WorkoutSet"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WarmupLog_date_key" ON "WarmupLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "BodyweightLog_date_key" ON "BodyweightLog"("date");

-- AddForeignKey
ALTER TABLE "DayTemplateExercise" ADD CONSTRAINT "DayTemplateExercise_dayTemplateId_fkey" FOREIGN KEY ("dayTemplateId") REFERENCES "DayTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayTemplateExercise" ADD CONSTRAINT "DayTemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
