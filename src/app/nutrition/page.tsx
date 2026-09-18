import { prisma } from "@/lib/prisma";
import { NutritionView } from "@/components/nutrition/nutrition-view";
import { todayIso } from "@/lib/utils/date";

export default async function NutritionPage() {
  const date = todayIso();
  const [stats, bodyweightLogs, calorieEntries] = await Promise.all([
    prisma.userStats.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    }),
    prisma.bodyweightLog.findMany({ orderBy: { date: "desc" }, take: 12 }),
    prisma.calorieEntry.findMany({ where: { date }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-black tracking-tight">Nutrition</h1>
      <p className="mt-1 text-sm text-app-muted">Bulk targets — log calories, no food tracking.</p>

      <div className="mt-6">
        <NutritionView
          initialStats={{
            weightKg: stats.weightKg,
            heightCm: stats.heightCm,
            age: stats.age,
            activityMult: stats.activityMult,
            proteinPerKg: stats.proteinPerKg,
            surplusPct: stats.surplusPct,
          }}
          initialBodyweightLogs={bodyweightLogs.reverse().map((l) => ({
            date: l.date,
            weightKg: l.weightKg,
          }))}
          initialCalorieEntries={calorieEntries.map((e) => ({ slot: e.slot, calories: e.calories }))}
        />
      </div>
    </div>
  );
}
