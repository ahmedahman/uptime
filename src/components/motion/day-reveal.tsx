"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

interface DayRevealProps {
  dayName: string;
  displayDate: string;
  children: ReactNode;
}

/**
 * Plays once on every day-view mount. Kept under ~600ms end-to-end so it stays a
 * "sets the tone" beat rather than something that gets annoying on repeat visits.
 */
export function DayReveal({ dayName, displayDate, children }: DayRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div>
        <p className="text-sm text-app-muted">{displayDate}</p>
        <h1 className="font-display text-4xl font-black tracking-tight">{dayName}</h1>
        <div className="mt-6">{children}</div>
      </div>
    );
  }

  return (
    <div>
      <motion.p
        className="text-sm text-app-muted"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {displayDate}
      </motion.p>

      <div className="relative overflow-hidden">
        <motion.h1
          className="font-display text-4xl font-black tracking-tight"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {dayName}
        </motion.h1>
        <motion.div
          className="absolute inset-y-0 left-0 w-full bg-accent-primary"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          style={{ originX: 1 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.7, 0, 0.2, 1] }}
        />
      </div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
