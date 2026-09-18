"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const ACTIVITY_TYPES = ["Running", "Cycling", "Rowing"];

interface CardioCardProps {
  date: string;
  initialLogged: boolean;
  onLogged: () => void;
}

export function CardioCard({ date, initialLogged, onLogged }: CardioCardProps) {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [duration, setDuration] = useState<number | "">("");
  const [logged, setLogged] = useState(initialLogged);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (duration === "") return;
    setSaving(true);
    try {
      await fetch("/api/cardio-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, activityType, durationMinutes: duration }),
      });
      setLogged(true);
      onLogged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeading>Cardio</CardHeading>
        {logged && <span className="text-xs font-semibold text-accent-complete">Logged</span>}
      </div>
      <p className="mt-1 text-xs text-app-muted">
        Endurance-focused, steady-state preferred while building a base.
      </p>

      <div className="mt-3 flex gap-2">
        {ACTIVITY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActivityType(type)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activityType === type
                ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                : "border-app-border"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-3 max-w-[10rem]">
        <Label>Duration (min)</Label>
        <Input
          type="number"
          inputMode="numeric"
          value={duration}
          onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>

      <Button className="mt-4 w-full" variant="secondary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </Card>
  );
}
