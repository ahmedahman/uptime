import { Card, CardHeading } from "@/components/ui/card";
import type { MacroTargets } from "@/types";

export function TargetsCard({ targets }: { targets: MacroTargets }) {
  const items = [
    { label: "Calories", value: targets.calories, unit: "kcal", accent: "text-accent-primary" },
    { label: "Protein", value: targets.proteinG, unit: "g", accent: "text-accent-pr" },
    { label: "Carbs", value: targets.carbsG, unit: "g", accent: "text-accent-complete" },
    { label: "Fat", value: targets.fatG, unit: "g", accent: "text-accent-secondary" },
  ];

  return (
    <Card>
      <CardHeading>Daily targets</CardHeading>
      <p className="mt-1 text-xs text-app-muted">
        BMR {targets.bmr} kcal × activity × bulk surplus. Recalculates as you edit your stats.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-app-border p-3 text-center">
            <p className={`font-display text-2xl font-black ${item.accent}`}>
              {item.value}
              <span className="ml-1 text-sm font-medium text-app-muted">{item.unit}</span>
            </p>
            <p className="text-xs text-app-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
