import { prisma } from "@/lib/prisma";

/**
 * A set is a PR if its weight beats every previous set for this exercise done at
 * an equal-or-greater rep count (so a heavier set at fewer reps doesn't false-flag,
 * and a lighter set at way more reps doesn't either).
 */
export async function isPersonalRecord(
  exerciseId: string,
  weightKg: number,
  reps: number,
  excludeWorkoutLogId?: string,
): Promise<boolean> {
  if (!weightKg || !reps) return false;

  const better = await prisma.workoutSet.findFirst({
    where: {
      exerciseId,
      reps: { gte: reps },
      weightKg: { gte: weightKg },
      ...(excludeWorkoutLogId ? { workoutLogId: { not: excludeWorkoutLogId } } : {}),
    },
  });

  return !better;
}
