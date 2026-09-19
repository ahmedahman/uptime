import { findExercise } from "@/features/gym/lib/day-templates";
import { getWorkoutLogs } from "@/features/gym/lib/gym-store";

export interface ProgressPoint {
  date: string;
  topWeightKg: number;
  topReps: number;
}

export function getExerciseProgress(exerciseId: string, take = 6) {
  const exercise = findExercise(exerciseId);
  if (!exercise) return null;

  const logs = getWorkoutLogs()
    .filter((l) => l.exerciseId === exerciseId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, take);

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

  return { exercise: { id: exercise.slug, name: exercise.name, muscleGroup: exercise.muscleGroup }, points };
}
