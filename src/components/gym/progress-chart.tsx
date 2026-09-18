"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { ProgressPoint } from "@/features/gym/lib/get-exercise-progress";

export function ProgressChart({ points }: { points: ProgressPoint[] }) {
  const data = points.map((p) => ({
    ...p,
    label: format(parseISO(p.date), "d MMM"),
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" stroke="var(--app-muted)" fontSize={12} />
          <YAxis stroke="var(--app-muted)" fontSize={12} width={40} />
          <Tooltip
            contentStyle={{
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value, name) =>
              name === "topWeightKg" ? [`${value}kg`, "Top weight"] : [`${value}`, "Reps"]
            }
          />
          <Line
            type="monotone"
            dataKey="topWeightKg"
            stroke="var(--accent-primary)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
