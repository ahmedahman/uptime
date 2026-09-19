"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetRow } from "@/components/gym/set-row";
import { parseScheme } from "@/features/gym/lib/parse-scheme";
import { saveWorkoutLog } from "@/features/gym/lib/gym-store";
import type { SetInput } from "@/types";
import type { DayViewExercise } from "@/features/gym/lib/get-day-view";

interface ExerciseLogCardProps {
  date: string;
  dayOfWeek: number;
  exercise: DayViewExercise;
  onSaved: (exerciseName: string, prSets: SetInput[]) => void;
}

export function ExerciseLogCard({ date, dayOfWeek, exercise, onSaved }: ExerciseLogCardProps) {
  const { setCount, setLabels, estimatedMinutes } = parseScheme(exercise.scheme);
  const [sets, setSets] = useState<SetInput[]>(() =>
    Array.from({ length: setCount }, (_, i) => {
      const existing = exercise.sets.find((s) => s.setIndex === i);
      return {
        setIndex: i,
        weightKg: existing?.weightKg ?? exercise.lastSession?.topWeightKg ?? null,
        reps: existing?.reps ?? null,
      };
    }),
  );
  const [prIndexes, setPrIndexes] = useState<Set<number>>(
    () => new Set(exercise.sets.filter((s) => s.isPr).map((s) => s.setIndex)),
  );
  const [saved, setSaved] = useState(exercise.sets.length > 0);

  function handleSave() {
    const log = saveWorkoutLog(date, dayOfWeek, exercise.id, sets);
    const newPrIndexes = new Set<number>(log.sets.filter((s) => s.isPr).map((s) => s.setIndex));
    setPrIndexes(newPrIndexes);
    setSaved(true);

    const prSets = sets.filter((s) => newPrIndexes.has(s.setIndex));
    onSaved(exercise.name, prSets);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardHeading>{exercise.name}</CardHeading>
          <p className="text-xs text-app-muted">
            {exercise.muscleGroup} · ~{estimatedMinutes} min
          </p>
        </div>
        {saved && <span className="text-xs font-semibold text-accent-complete">Logged</span>}
      </div>

      {exercise.lastSession && (
        <p className="mt-2 text-xs text-accent-primary">
          Last time: {exercise.lastSession.topWeightKg}kg × {exercise.lastSession.topReps}
        </p>
      )}

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

      <Button className="mt-4 w-full" variant="secondary" onClick={handleSave}>
        Save
      </Button>
    </Card>
  );
}
