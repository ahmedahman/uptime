import { Card, CardHeading } from "@/components/ui/card";
import { MEAL_STRUCTURE, NUTRITION_PRINCIPLES } from "@/features/nutrition/lib/meal-structure";

export function MealStructureCard() {
  return (
    <Card>
      <CardHeading>Meal structure</CardHeading>
      <p className="mt-1 text-xs text-app-muted">
        A template, not a rigid plan — swap freely based on what&rsquo;s around and what&rsquo;s cheap.
      </p>

      <div className="mt-4 space-y-3">
        {MEAL_STRUCTURE.map((meal) => (
          <div key={meal.label} className="rounded-xl border border-app-border p-3">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-sm font-extrabold">{meal.label}</p>
              <p className="text-xs text-app-muted">{meal.timing}</p>
            </div>
            <p className="mt-1 text-sm text-app-muted">{meal.swaps.join(" · ")}</p>
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-1.5 border-t border-app-border pt-4 text-xs text-app-muted">
        {NUTRITION_PRINCIPLES.map((principle) => (
          <li key={principle}>{principle}</li>
        ))}
      </ul>
    </Card>
  );
}
