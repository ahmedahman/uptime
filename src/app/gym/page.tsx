import Link from "next/link";
import { getDayView } from "@/features/gym/lib/get-day-view";
import { todayIso, formatDisplayDate } from "@/lib/utils/date";
import { DayReveal } from "@/components/motion/day-reveal";
import { DaySwitcher } from "@/components/gym/day-switcher";
import { DaySections } from "@/components/gym/day-sections";
import { ROUTES } from "@/lib/constants/routes";

export default async function GymPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date ?? todayIso();
  const view = await getDayView(date);

  return (
    <div>
      <DaySwitcher date={date} />

      <div className="mt-6">
        <DayReveal dayName={view.dayName} displayDate={formatDisplayDate(date)}>
          <DaySections view={view} />
        </DayReveal>
      </div>

      {view.type === "LIFT" && view.exercises.length > 0 && (
        <p className="mt-6 text-center text-xs text-app-muted">
          Track progress:{" "}
          {view.exercises.map((e, i) => (
            <span key={e.id}>
              <Link href={ROUTES.gymProgress(e.id)} className="text-accent-primary underline">
                {e.name}
              </Link>
              {i < view.exercises.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
