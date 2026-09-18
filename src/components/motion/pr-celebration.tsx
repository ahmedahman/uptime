"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

interface PrCelebrationProps {
  show: boolean;
  exerciseName: string;
  weightKg: number;
  reps: number;
  onDone: () => void;
}

const PARTICLES = Array.from({ length: 8 }, (_, i) => i);

export function PrCelebration({ show, exerciseName, weightKg, reps, onDone }: PrCelebrationProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(onDone, reduceMotion ? 1400 : 1900);
    return () => clearTimeout(timeout);
  }, [show, reduceMotion, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          <div className="relative flex items-center gap-3 rounded-2xl bg-accent-pr px-5 py-3 text-white shadow-lg">
            {!reduceMotion &&
              PARTICLES.map((i) => (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-white"
                  style={{ left: "50%", top: "50%" }}
                  initial={{ opacity: 1, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i / PARTICLES.length) * Math.PI * 2) * 70,
                    y: Math.sin((i / PARTICLES.length) * Math.PI * 2) * 70,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              ))}
            <div>
              <p className="font-display text-sm font-extrabold uppercase tracking-wide">
                New PR
              </p>
              <p className="text-sm">
                {exerciseName} — {weightKg}kg × {reps}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
