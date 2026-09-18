"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { shiftIso, todayIso } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface DaySwitcherProps {
  date: string;
}

export function DaySwitcher({ date }: DaySwitcherProps) {
  const router = useRouter();
  const today = todayIso();
  const days = Array.from({ length: 7 }, (_, i) => shiftIso(date, i - 3));

  return (
    <div className="flex justify-between gap-1 overflow-x-auto pb-1">
      {days.map((d) => {
        const isSelected = d === date;
        const isToday = d === today;
        return (
          <button
            key={d}
            onClick={() => router.push(`/gym?date=${d}`)}
            className={cn(
              "flex min-w-11 flex-col items-center rounded-xl border border-transparent px-2 py-1.5 text-xs transition-colors",
              isSelected && "border-accent-primary bg-accent-primary/15 text-accent-primary",
              !isSelected && isToday && "text-accent-complete",
              !isSelected && !isToday && "text-app-muted",
            )}
          >
            <span className="font-medium">{format(parseISO(d), "EEE")}</span>
            <span className="font-display font-bold">{format(parseISO(d), "d")}</span>
          </button>
        );
      })}
    </div>
  );
}
