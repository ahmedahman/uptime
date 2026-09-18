"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDailyCalorieStatus, type MealSlot } from "@/features/nutrition/lib/checkpoints";
import { todayIso } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const SLOT_LABEL: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

interface Entry {
  slot: string;
  calories: number;
}

interface CalorieTrackerProps {
  dailyTarget: number;
  initialEntries: Entry[];
}

export function CalorieTracker({ dailyTarget, initialEntries }: CalorieTrackerProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [drafts, setDrafts] = useState<Record<MealSlot, number | "">>({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [snackDraft, setSnackDraft] = useState<number | "">("");
  const [saving, setSaving] = useState<string | null>(null);

  const status = getDailyCalorieStatus(dailyTarget, entries);

  async function logEntry(slot: MealSlot | "snack", calories: number) {
    setSaving(slot);
    try {
      const date = todayIso();
      await fetch("/api/calorie-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot, calories }),
      });
      setEntries((prev) => [...prev, { slot, calories }]);
    } finally {
      setSaving(null);
    }
  }

  return (
    <Card>
      <CardHeading>Today&rsquo;s calories</CardHeading>
      <p className="mt-1 text-xs text-app-muted">
        Target {status.totalTarget} kcal — logged {status.totalLogged} kcal so far.
      </p>

      <div className="mt-4 space-y-3">
        {status.checkpoints.map((checkpoint) => (
          <div key={checkpoint.slot} className="rounded-xl border border-app-border p-3">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-sm font-extrabold">{SLOT_LABEL[checkpoint.slot]}</p>
              <p className="text-xs text-app-muted">
                {checkpoint.loggedCalories} / {checkpoint.targetCalories} kcal
              </p>
            </div>
            {checkpoint.shortfall === 0 && checkpoint.loggedCalories > 0 && (
              <p className="mt-1 text-xs font-semibold text-accent-complete">Hit</p>
            )}
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="kcal eaten"
                value={drafts[checkpoint.slot]}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [checkpoint.slot]: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
              <Button
                variant="secondary"
                disabled={saving === checkpoint.slot || drafts[checkpoint.slot] === ""}
                onClick={() => {
                  const value = drafts[checkpoint.slot];
                  if (value === "") return;
                  logEntry(checkpoint.slot, value);
                  setDrafts((prev) => ({ ...prev, [checkpoint.slot]: "" }));
                }}
              >
                Log
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-4 rounded-xl border p-3",
          status.runningShortfall > 0
            ? "border-accent-pr/40 bg-accent-pr/5"
            : "border-app-border",
        )}
      >
        {status.runningShortfall > 0 ? (
          <p className="text-sm font-semibold text-accent-pr">
            Behind by {status.runningShortfall} kcal today
          </p>
        ) : (
          <p className="text-sm font-semibold text-accent-complete">On target</p>
        )}
        <div className="mt-2 flex gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Add snack (kcal)"
            value={snackDraft}
            onChange={(e) => setSnackDraft(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <Button
            variant="secondary"
            disabled={saving === "snack" || snackDraft === ""}
            onClick={() => {
              if (snackDraft === "") return;
              logEntry("snack", snackDraft);
              setSnackDraft("");
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
