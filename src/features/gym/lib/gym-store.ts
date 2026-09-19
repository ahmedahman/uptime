import { readCollection, writeCollection, readValue, writeValue } from "@/lib/local-store";

export interface StoredSet {
  setIndex: number;
  weightKg: number | null;
  reps: number | null;
  isPr: boolean;
}

export interface StoredWorkoutLog {
  date: string;
  dayOfWeek: number;
  exerciseId: string;
  sets: StoredSet[];
}

export interface StoredSkillLog {
  date: string;
  skillName: string;
  attempts: number | null;
  holdSeconds: number | null;
}

export interface StoredCoreLog {
  date: string;
  exerciseName: string;
  reps: number | null;
}

export interface StoredCardioLog {
  date: string;
  activityType: string;
  durationMinutes: number;
}

const WORKOUT_LOGS_KEY = "workout-logs";
const SKILL_LOGS_KEY = "skill-logs";
const CORE_LOGS_KEY = "core-logs";
const CARDIO_LOGS_KEY = "cardio-logs";
const WARMUP_DATES_KEY = "warmup-completed-dates";

export function getWorkoutLogs(): StoredWorkoutLog[] {
  return readCollection<StoredWorkoutLog>(WORKOUT_LOGS_KEY);
}

/** Replaces (or creates) the log for this exercise+date, computing each set's PR status. */
export function saveWorkoutLog(
  date: string,
  dayOfWeek: number,
  exerciseId: string,
  sets: { setIndex: number; weightKg: number | null; reps: number | null }[],
): StoredWorkoutLog {
  const logs = getWorkoutLogs();
  const otherLogs = logs.filter((l) => !(l.exerciseId === exerciseId && l.date === date));

  // PR check: does any OTHER session's set for this exercise already match or beat
  // this weight at an equal-or-greater rep count? Compares against other sessions
  // only, never against sibling sets saved in this same call.
  const priorSets = otherLogs.filter((l) => l.exerciseId === exerciseId).flatMap((l) => l.sets);

  const nextSets: StoredSet[] = sets.map((s) => {
    const isPr =
      s.weightKg != null && s.reps != null
        ? !priorSets.some((p) => p.weightKg != null && p.weightKg >= s.weightKg! && (p.reps ?? 0) >= s.reps!)
        : false;
    return { ...s, isPr };
  });

  const nextLog: StoredWorkoutLog = { date, dayOfWeek, exerciseId, sets: nextSets };
  writeCollection(WORKOUT_LOGS_KEY, [...otherLogs, nextLog]);
  return nextLog;
}

export function getSkillLogs(): StoredSkillLog[] {
  return readCollection<StoredSkillLog>(SKILL_LOGS_KEY);
}

export function saveSkillLog(log: StoredSkillLog): void {
  const logs = getSkillLogs().filter((l) => !(l.date === log.date && l.skillName === log.skillName));
  writeCollection(SKILL_LOGS_KEY, [...logs, log]);
}

export function getCoreLogs(): StoredCoreLog[] {
  return readCollection<StoredCoreLog>(CORE_LOGS_KEY);
}

export function saveCoreLogs(date: string, entries: StoredCoreLog[]): void {
  const logs = getCoreLogs().filter((l) => l.date !== date);
  writeCollection(CORE_LOGS_KEY, [...logs, ...entries]);
}

export function getCardioLogs(): StoredCardioLog[] {
  return readCollection<StoredCardioLog>(CARDIO_LOGS_KEY);
}

export function saveCardioLog(log: StoredCardioLog): void {
  const logs = getCardioLogs().filter((l) => l.date !== log.date);
  writeCollection(CARDIO_LOGS_KEY, [...logs, log]);
}

export function isWarmupCompleted(date: string): boolean {
  return readValue<string[]>(WARMUP_DATES_KEY, []).includes(date);
}

export function setWarmupCompleted(date: string, completed: boolean): void {
  const dates = readValue<string[]>(WARMUP_DATES_KEY, []);
  const next = completed ? [...new Set([...dates, date])] : dates.filter((d) => d !== date);
  writeValue(WARMUP_DATES_KEY, next);
}
