"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeading } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { userStatsSchema, type UserStatsInput, ACTIVITY_LEVELS } from "@/features/nutrition/lib/schema";

interface StatsFormProps {
  initial: UserStatsInput;
  onChange: (values: UserStatsInput) => void;
}

export function StatsForm({ initial, onChange }: StatsFormProps) {
  const form = useForm<UserStatsInput>({
    resolver: zodResolver(userStatsSchema),
    defaultValues: initial,
  });
  const { register, handleSubmit } = form;
  const [surplusPct, setSurplusPct] = useState(initial.surplusPct);

  // Live recalculation on every change, via RHF's non-reactive `subscribe` (rather
  // than watch()) so the React Compiler can still memoize this component.
  useEffect(() => {
    return form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        const parsed = userStatsSchema.safeParse(values);
        if (parsed.success) {
          onChange(parsed.data);
          setSurplusPct(parsed.data.surplusPct);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persist(values: UserStatsInput) {
    await fetch("/api/user-stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  }

  return (
    <Card>
      <CardHeading>Your stats</CardHeading>
      <form className="mt-4 grid grid-cols-2 gap-4" onBlur={handleSubmit(persist)}>
        <div>
          <Label>Weight (kg)</Label>
          <Input type="number" step="0.1" inputMode="decimal" {...register("weightKg")} />
        </div>
        <div>
          <Label>Height (cm)</Label>
          <Input type="number" inputMode="numeric" {...register("heightCm")} />
        </div>
        <div>
          <Label>Age</Label>
          <Input type="number" inputMode="numeric" {...register("age")} />
        </div>
        <div>
          <Label>Protein (g/kg)</Label>
          <Input type="number" step="0.1" inputMode="decimal" {...register("proteinPerKg")} />
        </div>
        <div className="col-span-2">
          <Label>Activity level</Label>
          <select
            className="h-11 w-full rounded-lg border border-app-border bg-app-bg px-4 text-sm text-app-fg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            {...register("activityMult")}
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <Label>Bulk surplus ({Math.round(surplusPct * 100)}%)</Label>
          <input
            type="range"
            min={0}
            max={0.3}
            step={0.01}
            className="w-full accent-accent-primary"
            {...register("surplusPct")}
          />
        </div>
      </form>
    </Card>
  );
}
