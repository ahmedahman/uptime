export const WARMUP_STEPS = [
  "3-5 min light cardio",
  "2-3 min dynamic mobility",
  "1-2 warm-up sets on the day's first exercise (~50% working weight × 8-10, then ~75% × 4-5)",
] as const;

export const SKILL_PROGRESSIONS: Record<string, string[]> = {
  "L-sit": ["Tuck", "One-leg extended", "Full"],
  Handstand: ["Wall-supported, chest-to-wall", "Wall-supported, back-to-wall", "Freestanding"],
  "Frog stand": ["Hands on floor, knees on elbows, lean forward until feet lift"],
  "Elbow lever": ["Tuck version", "Extend legs"],
};

export const SKILL_FORMAT =
  "5-8 short attempts, well before failure, resting 30-60 sec between.";
