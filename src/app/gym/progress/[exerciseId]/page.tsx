import { notFound } from "next/navigation";
import Link from "next/link";
import { getExerciseProgress } from "@/features/gym/lib/get-exercise-progress";
import { ProgressChart } from "@/components/gym/progress-chart";
import { Card, CardHeading } from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/utils/date";
import { ROUTES } from "@/lib/constants/routes";

export default async function ExerciseProgressPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const data = await getExerciseProgress(exerciseId);
  if (!data) notFound();

  const { exercise, points } = data;

  return (
    <div>
      <Link href={ROUTES.gym} className="text-sm text-accent-primary underline">
        ← Back to today
      </Link>

      <h1 className="mt-3 font-display text-3xl font-black tracking-tight">{exercise.name}</h1>
      <p className="text-sm text-app-muted">{exercise.muscleGroup}</p>

      <Card className="mt-6">
        <CardHeading>Top set, last {points.length} sessions</CardHeading>
        {points.length === 0 ? (
          <p className="mt-4 text-sm text-app-muted">No sets logged yet.</p>
        ) : (
          <div className="mt-4">
            <ProgressChart points={points} />
          </div>
        )}
      </Card>

      {points.length > 0 && (
        <div className="mt-4 space-y-2">
          {[...points].reverse().map((p) => (
            <div
              key={p.date}
              className="flex items-center justify-between rounded-xl border border-app-border px-4 py-2 text-sm"
            >
              <span className="text-app-muted">{formatDisplayDate(p.date)}</span>
              <span className="font-semibold">
                {p.topWeightKg}kg × {p.topReps}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
