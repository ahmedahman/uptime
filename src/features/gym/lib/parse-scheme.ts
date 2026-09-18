export interface ParsedScheme {
  setCount: number;
  setLabels: string[];
  estimatedMinutes: number;
}

// Rough heuristic, purely informational — a number to self-pace against, not a timer.
const MINUTES_PER_SET_HEAVY = 2.7; // heavy/failure/backoff compound: ~8 min for 3 sets
const MINUTES_PER_SET_STRAIGHT = 1.7; // straight-set accessory: ~5 min for 3 sets

export function parseScheme(scheme: string): ParsedScheme {
  if (scheme.startsWith("heavy-failure-backoff")) {
    return {
      setCount: 3,
      setLabels: ["Heavy", "Failure", "Backoff"],
      estimatedMinutes: Math.round(3 * MINUTES_PER_SET_HEAVY),
    };
  }

  const match = scheme.match(/^straight:(\d+)x(.+)$/);
  if (match) {
    const count = Number(match[1]);
    const repRange = match[2];
    return {
      setCount: count,
      setLabels: Array.from({ length: count }, (_, i) => `Set ${i + 1} · ${repRange} reps`),
      estimatedMinutes: Math.round(count * MINUTES_PER_SET_STRAIGHT),
    };
  }

  return { setCount: 3, setLabels: ["Set 1", "Set 2", "Set 3"], estimatedMinutes: 5 };
}
