"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

interface SessionCompleteBurstProps {
  show: boolean;
  dayName: string;
  prCount: number;
  exerciseCount: number;
  onClose: () => void;
}

export function SessionCompleteBurst({
  show,
  dayName,
  prCount,
  exerciseCount,
  onClose,
}: SessionCompleteBurstProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-t-3xl border border-app-border bg-app-surface p-6 text-center sm:rounded-3xl"
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!reduceMotion && (
              <motion.div
                className="absolute inset-x-0 top-0 h-1.5 bg-accent-complete"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
            )}

            <motion.p
              className="font-display text-sm font-extrabold uppercase tracking-wide text-accent-complete"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Session complete
            </motion.p>

            <motion.h2
              className="mt-2 font-display text-3xl font-black tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              {dayName} — done
            </motion.h2>

            <motion.p
              className="mt-3 text-sm text-app-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
            >
              {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"} logged
              {prCount > 0 && (
                <>
                  {" "}
                  · <span className="font-semibold text-accent-pr">{prCount} new PR{prCount === 1 ? "" : "s"}</span>
                </>
              )}
            </motion.p>

            <Button className="mt-6 w-full" onClick={onClose}>
              Nice
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
