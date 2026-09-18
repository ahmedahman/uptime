"use client";

import { useState } from "react";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SKILL_PROGRESSIONS, SKILL_FORMAT } from "@/lib/config/warmup";

interface SkillTrackerProps {
  date: string;
  skillName: string;
  initialLog: { attempts: number | null; holdSeconds: number | null } | null;
  onLogged: () => void;
}

export function SkillTracker({ date, skillName, initialLog, onLogged }: SkillTrackerProps) {
  const [attempts, setAttempts] = useState<number | "">(initialLog?.attempts ?? "");
  const [holdSeconds, setHoldSeconds] = useState<number | "">(initialLog?.holdSeconds ?? "");
  const [logged, setLogged] = useState(initialLog != null);
  const [saving, setSaving] = useState(false);
  const progressions = SKILL_PROGRESSIONS[skillName] ?? [];

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/skill-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          skillName,
          attempts: attempts === "" ? null : attempts,
          holdSeconds: holdSeconds === "" ? null : holdSeconds,
        }),
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
        <CardHeading>Skill — {skillName}</CardHeading>
        {logged && <span className="text-xs font-semibold text-accent-complete">Logged</span>}
      </div>
      <p className="mt-1 text-xs text-app-muted">{SKILL_FORMAT}</p>
      <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-xs text-app-muted">
        {progressions.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <Label>Attempts</Label>
          <Input
            type="number"
            inputMode="numeric"
            value={attempts}
            onChange={(e) => setAttempts(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Best hold (sec)</Label>
          <Input
            type="number"
            inputMode="numeric"
            value={holdSeconds}
            onChange={(e) => setHoldSeconds(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      </div>

      <Button className="mt-4 w-full" variant="secondary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </Card>
  );
}
