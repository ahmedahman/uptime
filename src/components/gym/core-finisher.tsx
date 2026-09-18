"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface CoreFinisherProps {
  date: string;
  options: string[];
  initialLogged: boolean;
  onLogged: () => void;
}

export function CoreFinisher({ date, options, initialLogged, onLogged }: CoreFinisherProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [reps, setReps] = useState<number | "">("");
  const [logged, setLogged] = useState(initialLogged);
  const [saving, setSaving] = useState(false);

  function togglePick(name: string) {
    setPicked((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name].slice(0, 3),
    );
  }

  async function handleSave() {
    if (picked.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        picked.map((exerciseName) =>
          fetch("/api/core-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, exerciseName, reps: reps === "" ? null : reps }),
          }),
        ),
      );
      setLogged(true);
      onLogged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeading>Core finisher</CardHeading>
        {logged && <span className="text-xs font-semibold text-accent-complete">Logged</span>}
      </div>
      <p className="mt-1 text-xs text-app-muted">Pick 2-3 — not all four every day.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => togglePick(option)}
            className={cn(
              "rounded-full border border-app-border px-3 py-1.5 text-xs font-medium transition-colors",
              picked.includes(option) && "border-accent-primary bg-accent-primary/15 text-accent-primary",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 max-w-[8rem]">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="reps/sec"
          value={reps}
          onChange={(e) => setReps(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>

      <Button
        className="mt-4 w-full"
        variant="secondary"
        onClick={handleSave}
        disabled={saving || picked.length === 0}
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </Card>
  );
}
