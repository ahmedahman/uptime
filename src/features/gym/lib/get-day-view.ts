import { prisma } from "@/lib/prisma";
import { dayOfWeekFromIso } from "@/lib/utils/date";

export interface DayViewExercise {
  id: string;
  name: string;
  muscleGroup: string;
  notes: string | null;
  scheme: string;
  sets: { setIndex: number; weightKg: number | null; reps: number | null; isPr: boolean }[];
}

export interface DayView {
  date: string;
  dayOfWeek: number;
  dayName: string;
  type: "LIFT" | "REST" | "CARDIO";
  skillName: string | null;
  exercises: DayViewExercise[];
  coreOptions: string[];
  warmupCompleted: boolean;
  skillLogged: boolean;
  coreLogged: boolean;
  cardioLogged: boolean;
}

const CORE_ROTATION = ["Hanging leg raise", "Cable crunch", "Plank", "Weighted sit-up"];

export async function getDayView(date: string): Promise<DayView> {
  const dayOfWeek = dayOfWeekFromIso(date);

  const template = await prisma.dayTemplate.findUnique({
    where: { dayOfWeek },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: true },
      },
    },
  });

  if (!template) {
    throw new Error(`No day template configured for dayOfWeek ${dayOfWeek}`);
  }

  const exerciseIds = template.exercises.map((e) => e.exerciseId);

  const [logs, warmup, skillLogs, coreLogs, cardioLogs] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { date, exerciseId: { in: exerciseIds } },
      include: { sets: { orderBy: { setIndex: "asc" } } },
    }),
    prisma.warmupLog.findUnique({ where: { date } }),
    prisma.skillLog.findMany({ where: { date } }),
    prisma.coreLog.findMany({ where: { date } }),
    prisma.cardioLog.findMany({ where: { date } }),
  ]);

  const logByExerciseId = new Map(logs.map((l) => [l.exerciseId, l]));

  const exercises: DayViewExercise[] = template.exercises.map((te) => {
    const log = logByExerciseId.get(te.exerciseId);
    return {
      id: te.exercise.id,
      name: te.exercise.name,
      muscleGroup: te.exercise.muscleGroup,
      notes: te.exercise.notes,
      scheme: te.scheme,
      sets: log?.sets.map((s) => ({
        setIndex: s.setIndex,
        weightKg: s.weightKg,
        reps: s.reps,
        isPr: s.isPr,
      })) ?? [],
    };
  });

  return {
    date,
    dayOfWeek,
    dayName: template.dayName,
    type: template.type,
    skillName: template.skillName,
    exercises,
    coreOptions: CORE_ROTATION,
    warmupCompleted: warmup?.completed ?? false,
    skillLogged: skillLogs.length > 0,
    coreLogged: coreLogs.length > 0,
    cardioLogged: cardioLogs.length > 0,
  };
}
