import { readCollection, writeCollection, readValue, writeValue } from "@/lib/local-store";
import type { UserStatsInput } from "@/features/nutrition/lib/schema";

export interface StoredBodyweightLog {
  date: string;
  weightKg: number;
}

export interface StoredCalorieEntry {
  date: string;
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
}

const USER_STATS_KEY = "user-stats";
const BODYWEIGHT_LOGS_KEY = "bodyweight-logs";
const CALORIE_ENTRIES_KEY = "calorie-entries";

const DEFAULT_STATS: UserStatsInput = {
  weightKg: 61,
  heightCm: 170,
  age: 25,
  activityMult: 1.2,
  proteinPerKg: 1.8,
  surplusPct: 0.15,
};

export function getUserStats(): UserStatsInput {
  return readValue<UserStatsInput>(USER_STATS_KEY, DEFAULT_STATS);
}

export function saveUserStats(stats: UserStatsInput): void {
  writeValue(USER_STATS_KEY, stats);
}

export function getBodyweightLogs(): StoredBodyweightLog[] {
  return readCollection<StoredBodyweightLog>(BODYWEIGHT_LOGS_KEY);
}

export function saveBodyweightLog(log: StoredBodyweightLog): void {
  const logs = getBodyweightLogs().filter((l) => l.date !== log.date);
  writeCollection(BODYWEIGHT_LOGS_KEY, [...logs, log]);
}

export function getCalorieEntries(date: string): StoredCalorieEntry[] {
  return readCollection<StoredCalorieEntry>(CALORIE_ENTRIES_KEY).filter((e) => e.date === date);
}

export function addCalorieEntry(entry: StoredCalorieEntry): void {
  const entries = readCollection<StoredCalorieEntry>(CALORIE_ENTRIES_KEY);
  writeCollection(CALORIE_ENTRIES_KEY, [...entries, entry]);
}
