import { prisma } from "@/lib/prisma";
import { NutritionView } from "@/components/nutrition/nutrition-view";

export default async function NutritionPage() {
  const [stats, bodyweightLogs] = await Promise.all([
    prisma.userStats.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    }),
    prisma.bodyweightLog.findMany({ orderBy: { date: "desc" }, take: 12 }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-black tracking-tight">Nutrition</h1>
      <p className="mt-1 text-sm text-app-muted">Bulk reference — no food logging.</p>

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
        />
      </div>
    </div>
  );
}
