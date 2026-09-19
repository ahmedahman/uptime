"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { WARMUP_STEPS } from "@/lib/config/warmup";
import { cn } from "@/lib/utils/cn";
import { setWarmupCompleted } from "@/features/gym/lib/gym-store";

interface WarmupChecklistProps {
  date: string;
  initialCompleted: boolean;
  onToggle: (completed: boolean) => void;
}

export function WarmupChecklist({ date, initialCompleted, onToggle }: WarmupChecklistProps) {
  const [completed, setCompleted] = useState(initialCompleted);

  function toggle() {
    const next = !completed;
    setCompleted(next);
    setWarmupCompleted(date, next);
    onToggle(next);
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeading>Warm-up</CardHeading>
        <button
          onClick={toggle}
          className={cn(
            "h-6 w-6 shrink-0 rounded-full border-2 border-app-border transition-colors",
            completed && "border-accent-complete bg-accent-complete",
          )}
          aria-pressed={completed}
          aria-label="Mark warm-up complete"
        />
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-app-muted">
        {WARMUP_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </Card>
  );
}
