"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetRow } from "@/components/gym/set-row";
import { parseScheme } from "@/features/gym/lib/parse-scheme";
import type { SetInput } from "@/types";
import type { DayViewExercise } from "@/features/gym/lib/get-day-view";

interface ExerciseLogCardProps {
  date: string;
  dayOfWeek: number;
  exercise: DayViewExercise;
  onSaved: (exerciseName: string, prSets: SetInput[]) => void;
}

export function ExerciseLogCard({ date, dayOfWeek, exercise, onSaved }: ExerciseLogCardProps) {
  const { setCount, setLabels } = parseScheme(exercise.scheme);
  const [sets, setSets] = useState<SetInput[]>(() =>
    Array.from({ length: setCount }, (_, i) => {
      const existing = exercise.sets.find((s) => s.setIndex === i);
      return { setIndex: i, weightKg: existing?.weightKg ?? null, reps: existing?.reps ?? null };
    }),
  );
  const [prIndexes, setPrIndexes] = useState<Set<number>>(
    () => new Set(exercise.sets.filter((s) => s.isPr).map((s) => s.setIndex)),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(exercise.sets.length > 0);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, dayOfWeek, exerciseId: exercise.id, sets }),
      });
      const data = await res.json();
      const newPrIndexes = new Set<number>(
        (data.sets as { setIndex: number; isPr: boolean }[])
          .filter((s) => s.isPr)
          .map((s) => s.setIndex),
      );
      setPrIndexes(newPrIndexes);
      setSaved(true);

      const prSets = sets.filter((s) => newPrIndexes.has(s.setIndex));
      onSaved(exercise.name, prSets);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardHeading>{exercise.name}</CardHeading>
          <p className="text-xs text-app-muted">{exercise.muscleGroup}</p>
        </div>
        {saved && <span className="text-xs font-semibold text-accent-complete">Logged</span>}
      </div>

      {exercise.notes && <p className="mt-2 text-xs text-app-muted">{exercise.notes}</p>}

      <div className="mt-4 space-y-2">
        {sets.map((set, i) => (
          <SetRow
            key={i}
            label={setLabels[i]}
            value={set}
            isPr={prIndexes.has(i)}
            onChange={(next) => setSets((prev) => prev.map((s, idx) => (idx === i ? next : s)))}
          />
        ))}
      </div>

      <Button className="mt-4 w-full" variant="secondary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </Card>
  );
}
