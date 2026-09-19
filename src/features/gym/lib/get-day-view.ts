import { dayOfWeekFromIso } from "@/lib/utils/date";
import { findDayTemplate, findExercise } from "@/features/gym/lib/day-templates";
import {
  getWorkoutLogs,
  getSkillLogs,
  getCoreLogs,
  getCardioLogs,
  isWarmupCompleted,
} from "@/features/gym/lib/gym-store";
import type { DayType } from "@/types";

export interface DayViewExercise {
  id: string;
  name: string;
  muscleGroup: string;
  notes: string | null;
  scheme: string;
  sets: { setIndex: number; weightKg: number | null; reps: number | null; isPr: boolean }[];
  lastSession: { date: string; topWeightKg: number; topReps: number } | null;
}

export interface DayView {
  date: string;
  dayOfWeek: number;
  dayName: string;
  type: DayType;
  skillName: string | null;
  exercises: DayViewExercise[];
  coreOptions: string[];
  warmupCompleted: boolean;
  skillLog: { attempts: number | null; holdSeconds: number | null } | null;
  coreLogs: { exerciseName: string; reps: number | null }[];
  cardioLogged: boolean;
}

function schemeFor(count: number, kind: "heavy-failure-backoff" | "straight", repRange?: string) {
  return kind === "heavy-failure-backoff" ? `heavy-failure-backoff:${count}` : `straight:${count}x${repRange}`;
}

export function getDayView(date: string): DayView {
  const dayOfWeek = dayOfWeekFromIso(date);
  const template = findDayTemplate(dayOfWeek);

  if (!template) {
    throw new Error(`No day template configured for dayOfWeek ${dayOfWeek}`);
  }

  const allWorkoutLogs = getWorkoutLogs();
  const priorLogs = allWorkoutLogs.filter((l) => l.date < date);

  // priorLogs isn't ordered, so track the most recent date seen per exercise.
  const lastSessionByExerciseId = new Map<
    string,
    { date: string; topWeightKg: number; topReps: number }
  >();
  for (const log of priorLogs) {
    const withWeight = log.sets.filter((s) => s.weightKg != null);
    if (withWeight.length === 0) continue;
    const top = withWeight.reduce((best, s) => ((s.weightKg ?? 0) > (best.weightKg ?? 0) ? s : best));
    const existing = lastSessionByExerciseId.get(log.exerciseId);
    if (!existing || log.date > existing.date) {
      lastSessionByExerciseId.set(log.exerciseId, {
        date: log.date,
        topWeightKg: top.weightKg ?? 0,
        topReps: top.reps ?? 0,
      });
    }
  }

  const exercises: DayViewExercise[] = template.exercises.map((dayExercise) => {
    const exercise = findExercise(dayExercise.exerciseSlug);
    if (!exercise) throw new Error(`Unknown exercise slug: ${dayExercise.exerciseSlug}`);

    const scheme =
      dayExercise.scheme.kind === "heavy-failure-backoff"
        ? schemeFor(dayExercise.scheme.count, "heavy-failure-backoff")
        : schemeFor(dayExercise.scheme.count, "straight", dayExercise.scheme.repRange);

    const log = allWorkoutLogs.find((l) => l.date === date && l.exerciseId === exercise.slug);

    return {
      id: exercise.slug,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      notes: exercise.notes ?? null,
      scheme,
      sets: log?.sets ?? [],
      lastSession: lastSessionByExerciseId.get(exercise.slug) ?? null,
    };
  });

  const skillLogsToday = getSkillLogs().filter((l) => l.date === date);
  const skillLog = template.skillName
    ? skillLogsToday.find((l) => l.skillName === template.skillName) ?? null
    : null;

  return {
    date,
    dayOfWeek,
    dayName: template.dayName,
    type: template.type,
    skillName: template.skillName ?? null,
    exercises,
    coreOptions: template.coreOptions ?? [],
    warmupCompleted: isWarmupCompleted(date),
    skillLog: skillLog ? { attempts: skillLog.attempts, holdSeconds: skillLog.holdSeconds } : null,
    coreLogs: getCoreLogs()
      .filter((l) => l.date === date)
      .map((l) => ({ exerciseName: l.exerciseName, reps: l.reps })),
    cardioLogged: getCardioLogs().some((l) => l.date === date),
  };
}
