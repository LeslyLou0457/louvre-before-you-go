// Close-Up Challenge rotation and time model (PRODUCT.md "Close-Up
// Challenge"). Pure functions with no imports, shared by the content check
// (plain Node) and the app.

/**
 * Which pool questions play number `play` (0, 1, 2, …) shows: pool items
 * 2k and 2k+1 for a round size of 2, counted round the pool. A pool no
 * bigger than the round shows the whole pool every time.
 */
export function roundPair(pool: string[], play: number, size = 2): string[] {
  if (pool.length <= size) return [...pool];
  const k = Number.isFinite(play) && play > 0 ? Math.floor(play) : 0;
  return Array.from({ length: size }, (_, i) => pool[(k * size + i) % pool.length]);
}

/** Every distinct pair the rotation can show, with the first play that shows it. */
export function allRounds(pool: string[], size = 2): { play: number; pair: string[] }[] {
  const seen = new Set<string>();
  const out: { play: number; pair: string[] }[] = [];
  // The rotation repeats after at most pool.length plays.
  for (let play = 0; play < Math.max(1, pool.length); play++) {
    const pair = roundPair(pool, play, size);
    const key = pair.join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ play, pair });
  }
  return out;
}

/** Time model: 200 words a minute, plus fixed looking, choosing and tapping time. */
export const TIME_MODEL = {
  secondsPerWord: 0.3,
  /** 6 s looking at the zoom + 5 s choosing + 4 taps of 1 s. */
  secondsPerQuestion: 15,
  /** Taps on the cleared page. */
  secondsPerRound: 2,
  /** 12 minutes for all five rounds. */
  roundCapSeconds: 144,
} as const;
