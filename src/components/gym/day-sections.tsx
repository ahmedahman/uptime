"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { WarmupChecklist } from "@/components/gym/warmup-checklist";
import { SkillTracker } from "@/components/gym/skill-tracker";
import { ExerciseLogCard } from "@/components/gym/exercise-log-card";
import { CoreFinisher } from "@/components/gym/core-finisher";
import { CardioCard } from "@/components/gym/cardio-card";
import { PrCelebration } from "@/components/motion/pr-celebration";
import { SessionCompleteBurst } from "@/components/motion/session-complete-burst";
import type { DayView } from "@/features/gym/lib/get-day-view";
import type { SetInput } from "@/types";

export function DaySections({ view }: { view: DayView }) {
  const [warmupDone, setWarmupDone] = useState(view.warmupCompleted);
  const [skillDone, setSkillDone] = useState(view.skillLogged);
  const [coreDone, setCoreDone] = useState(view.coreLogged);
  const [cardioDone, setCardioDone] = useState(view.cardioLogged);
  const [loggedExerciseIds, setLoggedExerciseIds] = useState<Set<string>>(
    () => new Set(view.exercises.filter((e) => e.sets.length > 0).map((e) => e.id)),
  );
  const [prTotal, setPrTotal] = useState(0);
  const [celebration, setCelebration] = useState<{
    exerciseName: string;
    weightKg: number;
    reps: number;
  } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [hasCelebratedComplete, setHasCelebratedComplete] = useState(false);

  function checkComplete(nextState: {
    warmupDone: boolean;
    skillDone: boolean;
    coreDone: boolean;
    loggedCount: number;
  }) {
    if (view.type !== "LIFT" || hasCelebratedComplete) return;
    const allExercisesDone = nextState.loggedCount === view.exercises.length;
    if (nextState.warmupDone && nextState.skillDone && nextState.coreDone && allExercisesDone) {
      setHasCelebratedComplete(true);
      setShowComplete(true);
    }
  }

  function handleExerciseSaved(exerciseId: string, exerciseName: string, prSets: SetInput[]) {
    const nextLogged = new Set(loggedExerciseIds).add(exerciseId);
    setLoggedExerciseIds(nextLogged);

    if (prSets.length > 0) {
      setPrTotal((p) => p + prSets.length);
      const first = prSets[0];
      setCelebration({
        exerciseName,
        weightKg: first.weightKg ?? 0,
        reps: first.reps ?? 0,
      });
    }

    checkComplete({ warmupDone, skillDone, coreDone, loggedCount: nextLogged.size });
  }

  if (view.type === "REST") {
    return (
      <div className="rounded-2xl border border-dashed border-app-border p-8 text-center text-app-muted">
        Rest day. Nothing to log.
      </div>
    );
  }

  if (view.type === "CARDIO") {
    return (
      <CardioCard
        date={view.date}
        initialLogged={cardioDone}
        onLogged={() => setCardioDone(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <WarmupChecklist
        date={view.date}
        initialCompleted={warmupDone}
        onToggle={(v) => {
          setWarmupDone(v);
          checkComplete({ warmupDone: v, skillDone, coreDone, loggedCount: loggedExerciseIds.size });
        }}
      />

      {view.skillName && (
        <SkillTracker
          date={view.date}
          skillName={view.skillName}
          initialLogged={skillDone}
          onLogged={() => {
            setSkillDone(true);
            checkComplete({
              warmupDone,
              skillDone: true,
              coreDone,
              loggedCount: loggedExerciseIds.size,
            });
          }}
        />
      )}

      {view.exercises.map((exercise) => (
        <ExerciseLogCard
          key={exercise.id}
          date={view.date}
          dayOfWeek={view.dayOfWeek}
          exercise={exercise}
          onSaved={(name, prSets) => handleExerciseSaved(exercise.id, name, prSets)}
        />
      ))}

      <CoreFinisher
        date={view.date}
        options={view.coreOptions}
        initialLogged={coreDone}
        onLogged={() => {
          setCoreDone(true);
          checkComplete({ warmupDone, skillDone, coreDone: true, loggedCount: loggedExerciseIds.size });
        }}
      />

      {prTotal > 0 && (
        <div className="flex justify-center">
          <Badge variant="pr">{prTotal} PR{prTotal === 1 ? "" : "s"} today</Badge>
        </div>
      )}

      <PrCelebration
        show={celebration != null}
        exerciseName={celebration?.exerciseName ?? ""}
        weightKg={celebration?.weightKg ?? 0}
        reps={celebration?.reps ?? 0}
        onDone={() => setCelebration(null)}
      />

      <SessionCompleteBurst
        show={showComplete}
        dayName={view.dayName}
        prCount={prTotal}
        exerciseCount={loggedExerciseIds.size}
        onClose={() => setShowComplete(false)}
      />
    </div>
  );
}
