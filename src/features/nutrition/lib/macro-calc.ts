import type { MacroTargets } from "@/types";

interface MacroInput {
  weightKg: number;
  heightCm: number;
  age: number;
  activityMult: number;
  proteinPerKg: number;
  surplusPct: number;
}

const CALORIES_PER_G_PROTEIN = 4;
const CALORIES_PER_G_CARB = 4;
const CALORIES_PER_G_FAT = 9;
const FAT_PCT_OF_CALORIES = 0.25;

/** Mifflin-St Jeor, male coefficients (single-user app). */
export function calculateMacros(input: MacroInput): MacroTargets {
  const { weightKg, heightCm, age, activityMult, proteinPerKg, surplusPct } = input;

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const maintenance = bmr * activityMult;
  const calories = Math.round(maintenance * (1 + surplusPct));

  const proteinG = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinG * CALORIES_PER_G_PROTEIN;

  const fatCalories = calories * FAT_PCT_OF_CALORIES;
  const fatG = Math.round(fatCalories / CALORIES_PER_G_FAT);

  const remainingCalories = calories - proteinCalories - fatCalories;
  const carbsG = Math.round(Math.max(remainingCalories, 0) / CALORIES_PER_G_CARB);

  return { bmr: Math.round(bmr), calories, proteinG, fatG, carbsG };
}
