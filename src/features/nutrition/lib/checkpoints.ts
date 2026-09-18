export type MealSlot = "breakfast" | "lunch" | "dinner";

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

// Editable-in-spirit defaults, not hidden math — just a reasonable starting split.
const SLOT_SHARE: Record<MealSlot, number> = {
  breakfast: 0.3,
  lunch: 0.4,
  dinner: 0.3,
};

export interface CheckpointStatus {
  slot: MealSlot;
  targetCalories: number;
  loggedCalories: number;
  shortfall: number;
}

export interface DailyCalorieStatus {
  checkpoints: CheckpointStatus[];
  totalTarget: number;
  totalLogged: number; // includes snacks
  runningShortfall: number; // cumulative shortfall across all checkpoints so far, not closed by snacks
}

interface CalorieEntryLike {
  slot: string;
  calories: number;
}

export function getDailyCalorieStatus(
  dailyTarget: number,
  entries: CalorieEntryLike[],
): DailyCalorieStatus {
  const loggedBySlot = (slot: MealSlot) =>
    entries.filter((e) => e.slot === slot).reduce((sum, e) => sum + e.calories, 0);

  const checkpoints: CheckpointStatus[] = MEAL_SLOTS.map((slot) => {
    const targetCalories = Math.round(dailyTarget * SLOT_SHARE[slot]);
    const loggedCalories = loggedBySlot(slot);
    return {
      slot,
      targetCalories,
      loggedCalories,
      shortfall: Math.max(targetCalories - loggedCalories, 0),
    };
  });

  const snackCalories = loggedBySlot("snack" as MealSlot);
  const totalLogged = checkpoints.reduce((sum, c) => sum + c.loggedCalories, 0) + snackCalories;
  const shortfallFromCheckpoints = checkpoints.reduce((sum, c) => sum + c.shortfall, 0);
  const runningShortfall = Math.max(shortfallFromCheckpoints - snackCalories, 0);

  return {
    checkpoints,
    totalTarget: Math.round(dailyTarget),
    totalLogged,
    runningShortfall,
  };
}
