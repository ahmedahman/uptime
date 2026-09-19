"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDayView, type DayView } from "@/features/gym/lib/get-day-view";
import { todayIso, formatDisplayDate } from "@/lib/utils/date";
import { DayReveal } from "@/components/motion/day-reveal";
import { DaySwitcher } from "@/components/gym/day-switcher";
import { DaySections } from "@/components/gym/day-sections";
import { ROUTES } from "@/lib/constants/routes";

export function GymPageClient() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? todayIso();
  const [view, setView] = useState<DayView | null>(null);

  // Reads localStorage, which only exists client-side — computed after mount
  // rather than during render to avoid a server/client hydration mismatch. Not a
  // sync loop: this is a one-time read of an external, non-reactive source, not
  // state derived from props/state that belongs in render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(getDayView(date));
  }, [date]);

  return (
    <div>
      <DaySwitcher date={date} />

      {view && (
        <div className="mt-6" key={date}>
          <DayReveal dayName={view.dayName} displayDate={formatDisplayDate(date)}>
            <DaySections view={view} />
          </DayReveal>

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
      )}
    </div>
  );
}
