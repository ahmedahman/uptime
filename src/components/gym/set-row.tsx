"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { SetInput } from "@/types";

interface SetRowProps {
  label: string;
  value: SetInput;
  isPr: boolean;
  onChange: (value: SetInput) => void;
}

export function SetRow({ label, value, isPr, onChange }: SetRowProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors",
        isPr && "border-accent-pr/40 bg-accent-pr/5",
      )}
      layout
    >
      <span className="w-24 shrink-0 text-xs text-app-muted">{label}</span>
      <Input
        type="number"
        inputMode="decimal"
        placeholder="kg"
        value={value.weightKg ?? ""}
        onChange={(e) =>
          onChange({ ...value, weightKg: e.target.value === "" ? null : Number(e.target.value) })
        }
      />
      <span className="text-app-muted">×</span>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="reps"
        value={value.reps ?? ""}
        onChange={(e) =>
          onChange({ ...value, reps: e.target.value === "" ? null : Number(e.target.value) })
        }
      />
      {isPr && <span className="shrink-0 text-xs font-bold text-accent-pr">PR</span>}
    </motion.div>
  );
}
