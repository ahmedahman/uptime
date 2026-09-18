export type DayType = "LIFT" | "REST" | "CARDIO";

export type SetScheme =
  | { kind: "heavy-failure-backoff"; count: 3 }
  | { kind: "straight"; count: number; repRange: string };

export interface ExerciseConfig {
  slug: string;
  name: string;
  muscleGroup: string;
  notes?: string;
}

export interface DayExerciseConfig {
  exerciseSlug: string;
  scheme: SetScheme;
}

export interface DayConfig {
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  dayName: string;
  type: DayType;
  skillName?: string;
  exercises: DayExerciseConfig[];
  coreOptions?: string[];
}

export interface SetInput {
  setIndex: number;
  weightKg: number | null;
  reps: number | null;
}

export interface MacroTargets {
  bmr: number;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}
