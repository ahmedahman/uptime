import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/** Thin re-export so every motion primitive pulls this from one place. */
export function useReducedMotion() {
  return useFramerReducedMotion() ?? false;
}
