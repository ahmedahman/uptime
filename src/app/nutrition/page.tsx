"use client";

import { useEffect, useState } from "react";
import { NutritionView } from "@/components/nutrition/nutrition-view";
import { todayIso } from "@/lib/utils/date";
import { getUserStats, getBodyweightLogs, getCalorieEntries } from "@/features/nutrition/lib/nutrition-store";
import type { UserStatsInput } from "@/features/nutrition/lib/schema";

interface InitialData {
  stats: UserStatsInput;
  bodyweightLogs: { date: string; weightKg: number }[];
  calorieEntries: { slot: string; calories: number }[];
}

export default function NutritionPage() {
  const [data, setData] = useState<InitialData | null>(null);

  // One-time read of localStorage (client-only, non-reactive) on mount — not a sync loop.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      stats: getUserStats(),
      bodyweightLogs: getBodyweightLogs()
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .slice(-12),
      calorieEntries: getCalorieEntries(todayIso()),
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-black tracking-tight">Nutrition</h1>
      <p className="mt-1 text-sm text-app-muted">Bulk targets — log calories, no food tracking.</p>

      {data && (
        <div className="mt-6">
          <NutritionView
            initialStats={data.stats}
            initialBodyweightLogs={data.bodyweightLogs}
            initialCalorieEntries={data.calorieEntries}
          />
        </div>
      )}
    </div>
  );
}
