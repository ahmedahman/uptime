export interface ParsedScheme {
  setCount: number;
  setLabels: string[];
}

export function parseScheme(scheme: string): ParsedScheme {
  if (scheme.startsWith("heavy-failure-backoff")) {
    return { setCount: 3, setLabels: ["Heavy", "Failure", "Backoff"] };
  }

  const match = scheme.match(/^straight:(\d+)x(.+)$/);
  if (match) {
    const count = Number(match[1]);
    const repRange = match[2];
    return {
      setCount: count,
      setLabels: Array.from({ length: count }, (_, i) => `Set ${i + 1} · ${repRange} reps`),
    };
  }

  return { setCount: 3, setLabels: ["Set 1", "Set 2", "Set 3"] };
}
