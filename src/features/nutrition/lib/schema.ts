import { z } from "zod";

export const userStatsSchema = z.object({
  weightKg: z.coerce.number().min(30).max(250),
  heightCm: z.coerce.number().min(100).max(230),
  age: z.coerce.number().int().min(13).max(90),
  activityMult: z.coerce.number().min(1).max(2),
  proteinPerKg: z.coerce.number().min(1).max(3),
  surplusPct: z.coerce.number().min(0).max(0.4),
});

export type UserStatsInput = z.infer<typeof userStatsSchema>;

export const ACTIVITY_LEVELS = [
  { label: "Sedentary (desk job, little exercise)", value: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/wk)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/wk)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/wk)", value: 1.725 },
] as const;
