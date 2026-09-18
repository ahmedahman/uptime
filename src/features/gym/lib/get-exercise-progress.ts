import { prisma } from "@/lib/prisma";

export interface ProgressPoint {
  date: string;
  topWeightKg: number;
  topReps: number;
}

export async function getExerciseProgress(exerciseId: string, take = 6) {
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return null;

  const logs = await prisma.workoutLog.findMany({
    where: { exerciseId },
    include: { sets: true },
    orderBy: { date: "desc" },
    take,
  });

  const points: ProgressPoint[] = logs
    .map((log) => {
      const withWeight = log.sets.filter((s) => s.weightKg != null);
      if (withWeight.length === 0) return null;
      const top = withWeight.reduce((best, s) =>
        (s.weightKg ?? 0) > (best.weightKg ?? 0) ? s : best,
      );
      return { date: log.date, topWeightKg: top.weightKg ?? 0, topReps: top.reps ?? 0 };
    })
    .filter((p): p is ProgressPoint => p !== null)
    .reverse();

  return { exercise, points };
}
