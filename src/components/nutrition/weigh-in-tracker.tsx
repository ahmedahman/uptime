"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";
import { Card, CardHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { todayIso } from "@/lib/utils/date";
import { saveBodyweightLog } from "@/features/nutrition/lib/nutrition-store";

interface WeighInTrackerProps {
  initialLogs: { date: string; weightKg: number }[];
}

export function WeighInTracker({ initialLogs }: WeighInTrackerProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [weight, setWeight] = useState<number | "">("");

  function handleSave() {
    if (weight === "") return;
    const date = todayIso();
    saveBodyweightLog({ date, weightKg: weight });
    setLogs((prev) => [...prev.filter((l) => l.date !== date), { date, weightKg: weight }]);
    setWeight("");
  }

  const data = logs.map((l) => ({ ...l, label: format(parseISO(l.date), "d MMM") }));

  return (
    <Card>
      <CardHeading>Weekly weigh-in</CardHeading>
      <p className="mt-1 text-xs text-app-muted">
        Weekly, not daily — the simplest bulk progress signal without food logging.
      </p>

      {data.length > 1 && (
        <div className="mt-4 h-40 w-full">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--app-muted)" fontSize={11} />
              <YAxis stroke="var(--app-muted)" fontSize={11} width={36} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="weightKg" stroke="var(--accent-complete)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Input
          type="number"
          step="0.1"
          inputMode="decimal"
          placeholder="Weight today (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Button onClick={handleSave}>Log</Button>
      </div>
    </Card>
  );
}
