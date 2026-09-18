export interface MealSlot {
  label: string;
  timing: string;
  swaps: string[];
}

/**
 * Budget-aware for Abuja/Nigeria self-catering (per the user's constraints): no imported
 * supplement assumptions beyond optional creatine, no dietary restrictions to route around.
 */
export const MEAL_STRUCTURE: MealSlot[] = [
  {
    label: "Meal 1",
    timing: "Morning",
    swaps: ["Eggs + bread/oats", "Beans + akara/bread", "Yam + eggs"],
  },
  {
    label: "Meal 2",
    timing: "Midday",
    swaps: ["Rice/beans + chicken or fish", "Spaghetti + minced meat", "Yam/plantain + egg sauce"],
  },
  {
    label: "Meal 3",
    timing: "Same-day as training, before or after the gym",
    swaps: [
      "Rice + chicken/fish (protein + carbs together)",
      "Beans + plantain",
      "Pasta + ground meat",
    ],
  },
  {
    label: "Meal 4",
    timing: "Evening",
    swaps: ["Soup (egusi/okra/etc.) + swallow + protein", "Rice + stew + meat/fish", "Noodles + egg + sausage"],
  },
  {
    label: "Snack (optional)",
    timing: "Between meals, whenever hunger or calories are short",
    swaps: ["Groundnuts", "Milk/yogurt", "Boiled eggs", "Fruit (banana, orange)"],
  },
];

export const NUTRITION_PRINCIPLES = [
  "Moderate surplus (~10-20% above maintenance) — a bulk isn't “eat everything,” it's controlled enough to limit excess fat gain.",
  "Protein at ~1.6-2.2g per kg bodyweight per day, spread across meals rather than one big serving.",
  "A protein + carb meal within a few hours of training (before and/or after) supports recovery on lifting days — same-day matters more than exact timing.",
  "Consistency week to week matters more than daily precision.",
  "Creatine is the only supplement assumed here, and only if needed — nothing else is required.",
];
