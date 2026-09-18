"use client";

import { useMemo, useState } from "react";
import { StatsForm } from "@/components/nutrition/stats-form";
import { TargetsCard } from "@/components/nutrition/targets-card";
import { CalorieTracker } from "@/components/nutrition/calorie-tracker";
import { WeighInTracker } from "@/components/nutrition/weigh-in-tracker";
import { calculateMacros } from "@/features/nutrition/lib/macro-calc";
import type { UserStatsInput } from "@/features/nutrition/lib/schema";

interface NutritionViewProps {
  initialStats: UserStatsInput;
  initialBodyweightLogs: { date: string; weightKg: number }[];
  initialCalorieEntries: { slot: string; calories: number }[];
}

export function NutritionView({
  initialStats,
  initialBodyweightLogs,
  initialCalorieEntries,
}: NutritionViewProps) {
  const [stats, setStats] = useState(initialStats);
  const targets = useMemo(() => calculateMacros(stats), [stats]);

  return (
    <div className="space-y-4">
      <StatsForm initial={initialStats} onChange={setStats} />
      <TargetsCard targets={targets} />
      <CalorieTracker dailyTarget={targets.calories} initialEntries={initialCalorieEntries} />
      <WeighInTracker initialLogs={initialBodyweightLogs} />
    </div>
  );
}
