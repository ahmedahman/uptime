import type { DayConfig, ExerciseConfig } from "@/types";

const hfb = { kind: "heavy-failure-backoff", count: 3 } as const;
const straight = (count: number, repRange: string) =>
  ({ kind: "straight", count, repRange }) as const;

export const EXERCISES: ExerciseConfig[] = [
  { slug: "leg-press", name: "Leg press", muscleGroup: "quads" },
  { slug: "hamstring-curl", name: "Hamstring curl", muscleGroup: "hamstrings" },
  { slug: "abductor-adductor", name: "Abductor/adductor", muscleGroup: "hips" },
  { slug: "calf-raise", name: "Calf raise", muscleGroup: "calves" },
  { slug: "incline-bench-press", name: "Incline bench press", muscleGroup: "chest" },
  { slug: "chest-fly", name: "Chest fly", muscleGroup: "chest" },
  {
    slug: "pull-ups",
    name: "Pull-ups",
    muscleGroup: "back",
    notes: "Lat pulldown fallback on weaker days. Cue: “break the bar” — pull hands apart horizontally to pre-activate lats before/during the pull.",
  },
  { slug: "overhead-barbell-press", name: "Overhead barbell press", muscleGroup: "shoulders" },
  {
    slug: "chest-supported-row",
    name: "Chest-supported row",
    muscleGroup: "back",
    notes: "Chosen over seated cable row to avoid lower-back loading if form breaks down late in a set.",
  },
  { slug: "incline-dumbbell-curl", name: "Incline dumbbell curl", muscleGroup: "biceps" },
  { slug: "tricep-extension", name: "Tricep extension", muscleGroup: "triceps" },
  { slug: "wrist-curls", name: "Wrist curls", muscleGroup: "forearms", notes: "“Sam Sulek style.”" },
  { slug: "leg-extension", name: "Leg extension", muscleGroup: "quads" },
  { slug: "incline-dumbbell-press", name: "Incline dumbbell press", muscleGroup: "chest" },
  { slug: "t-bar-row", name: "T-bar row", muscleGroup: "back" },
  { slug: "lateral-raise", name: "Lateral raise", muscleGroup: "shoulders" },
  { slug: "rear-delt-fly", name: "Rear delt fly", muscleGroup: "shoulders" },
  { slug: "hammer-curl", name: "Hammer curl", muscleGroup: "biceps" },
];

const coreRotation = [
  "Hanging leg raise",
  "Cable crunch",
  "Plank",
  "Weighted sit-up",
];

export const DAY_TEMPLATES: DayConfig[] = [
  {
    dayOfWeek: 1,
    dayName: "Lower A",
    type: "LIFT",
    skillName: "L-sit",
    coreOptions: coreRotation,
    exercises: [
      { exerciseSlug: "leg-press", scheme: hfb },
      { exerciseSlug: "hamstring-curl", scheme: straight(3, "10-15") },
      { exerciseSlug: "abductor-adductor", scheme: straight(3, "12-15") },
      { exerciseSlug: "calf-raise", scheme: straight(3, "12-15") },
    ],
  },
  {
    dayOfWeek: 2,
    dayName: "Upper A",
    type: "LIFT",
    skillName: "Handstand",
    coreOptions: coreRotation,
    exercises: [
      { exerciseSlug: "incline-bench-press", scheme: hfb },
      { exerciseSlug: "chest-fly", scheme: straight(3, "12-15") },
      { exerciseSlug: "pull-ups", scheme: straight(3, "to near-failure") },
      { exerciseSlug: "overhead-barbell-press", scheme: straight(3, "6-10") },
      { exerciseSlug: "chest-supported-row", scheme: straight(3, "8-12") },
      { exerciseSlug: "incline-dumbbell-curl", scheme: straight(3, "10-15") },
      { exerciseSlug: "tricep-extension", scheme: straight(3, "10-15") },
      { exerciseSlug: "wrist-curls", scheme: straight(2, "15-20") },
    ],
  },
  {
    dayOfWeek: 3,
    dayName: "Rest",
    type: "REST",
    exercises: [],
  },
  {
    dayOfWeek: 4,
    dayName: "Lower B",
    type: "LIFT",
    skillName: "Frog stand",
    coreOptions: coreRotation,
    exercises: [
      { exerciseSlug: "leg-extension", scheme: hfb },
      { exerciseSlug: "hamstring-curl", scheme: straight(3, "10-15") },
      { exerciseSlug: "abductor-adductor", scheme: straight(3, "12-15") },
      { exerciseSlug: "calf-raise", scheme: straight(3, "12-15") },
    ],
  },
  {
    dayOfWeek: 5,
    dayName: "Upper B",
    type: "LIFT",
    skillName: "Elbow lever",
    coreOptions: coreRotation,
    exercises: [
      { exerciseSlug: "incline-dumbbell-press", scheme: hfb },
      { exerciseSlug: "chest-fly", scheme: straight(3, "12-15") },
      { exerciseSlug: "t-bar-row", scheme: straight(3, "8-12") },
      { exerciseSlug: "pull-ups", scheme: straight(3, "to near-failure") },
      { exerciseSlug: "lateral-raise", scheme: straight(3, "12-15") },
      { exerciseSlug: "rear-delt-fly", scheme: straight(3, "12-15") },
      { exerciseSlug: "hammer-curl", scheme: straight(3, "10-15") },
      { exerciseSlug: "tricep-extension", scheme: straight(3, "10-15") },
      { exerciseSlug: "wrist-curls", scheme: straight(2, "15-20") },
    ],
  },
  {
    dayOfWeek: 6,
    dayName: "Cardio",
    type: "CARDIO",
    exercises: [],
  },
  {
    dayOfWeek: 0,
    dayName: "Rest",
    type: "REST",
    exercises: [],
  },
];

export function findDayTemplate(dayOfWeek: number): DayConfig | undefined {
  return DAY_TEMPLATES.find((d) => d.dayOfWeek === dayOfWeek);
}

export function findExercise(slug: string): ExerciseConfig | undefined {
  return EXERCISES.find((e) => e.slug === slug);
}
