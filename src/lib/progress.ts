// Progress lives only in this browser's localStorage (PRODUCT.md: no
// database, no sign-up). Two keys:
// - KEY: which levels are finished (unchanged since 0.5 launch, so existing
//   players keep their ticks).
// - PLACE_KEY: where the player is inside each unfinished level, so leaving
//   or reloading mid-level picks up at the same passage or question.
// - PLAYS_KEY: Close-Up Challenge only, how many times each round has been
//   finished; it picks the pair of questions the next play shows.
// - MOMENTS_KEY (added with motion, PRODUCT.md "Motion"): the two one-shot
//   moments on the route: `justCompleted` (the level or round finished for the
//   first time, set by markComplete, read and cleared by the route) and
//   `challengeUnlockSeen` (the "Close-ups unlocked" moment has played), and
//   `leslyMet` (Lesly's one-time introduction has been shown). Losing it only
//   replays or skips a small moment; progress never depends on it.
// Challenge rounds use KEY and PLACE_KEY too, under their own lesson ids.

const KEY = "louvre-before-you-go:progress:v1";
const PLACE_KEY = "louvre-before-you-go:place:v1";
const PLAYS_KEY = "louvre-before-you-go:challenge-plays:v1";
const MOMENTS_KEY = "louvre-before-you-go:moments:v1";

type Stored = { completed: string[] };

export function getCompleted(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const data = raw ? (JSON.parse(raw) as Stored) : null;
    return Array.isArray(data?.completed) ? data.completed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function markComplete(lessonId: string): void {
  try {
    const completed = getCompleted();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      // First finish only: the route plays its tick-and-unlock moment once.
      writeMoments({ ...readMoments(), justCompleted: lessonId });
    }
    window.localStorage.setItem(KEY, JSON.stringify({ completed } satisfies Stored));
  } catch {
    // Storage blocked (private mode etc.): the level still plays, it just isn't remembered.
  }
  // A finished level has no mid-level spot to come back to.
  clearPlace(lessonId);
}

export type LevelStatus = "done" | "current" | "locked";

/**
 * Done levels stay open for replay; the first unfinished level is current;
 * everything after it is locked.
 */
export function statuses(ids: string[], completed: string[]): LevelStatus[] {
  const done = new Set(completed);
  let currentGiven = false;
  return ids.map((id) => {
    if (done.has(id)) return "done";
    if (!currentGiven) {
      currentGiven = true;
      return "current";
    }
    return "locked";
  });
}

/** The player's spot inside one level. */
export type SavedPlace = {
  /** Node id the player is looking at. */
  node: string;
  /** Questions answered so far. */
  answered: number;
  /** Label of the option just picked (shown above a branch). */
  picked: string | null;
};

function readPlaces(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem(PLACE_KEY);
    const data: unknown = raw ? JSON.parse(raw) : null;
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function writePlaces(places: Record<string, unknown>): void {
  try {
    if (Object.keys(places).length === 0) window.localStorage.removeItem(PLACE_KEY);
    else window.localStorage.setItem(PLACE_KEY, JSON.stringify(places));
  } catch {
    // Storage blocked or full: the level still plays, the place just isn't remembered.
  }
}

/**
 * The saved spot in a level, or null when there is none or it no longer fits
 * the content (node removed or renamed): then the level simply starts over.
 * Pass the level's node ids and question count to check against the current
 * content; without them only the shape of the saved data is checked.
 */
export function getPlace(lessonId: string, nodeIds?: string[], questionCount?: number): SavedPlace | null {
  const p = readPlaces()[lessonId] as Partial<SavedPlace> | undefined;
  if (!p || typeof p !== "object" || typeof p.node !== "string") return null;
  if (nodeIds && !nodeIds.includes(p.node)) return null;
  let answered = typeof p.answered === "number" && Number.isFinite(p.answered) ? Math.max(0, Math.floor(p.answered)) : 0;
  if (questionCount !== undefined) answered = Math.min(answered, questionCount);
  return { node: p.node, answered, picked: typeof p.picked === "string" ? p.picked : null };
}

export function savePlace(lessonId: string, place: SavedPlace): void {
  const places = readPlaces();
  // Re-inserted so the most recently played level is always last (the cover's "Continue" reads that order).
  delete places[lessonId];
  places[lessonId] = place;
  writePlaces(places);
}

/** Of the given lesson ids, the ones with a saved place, most recently played first. */
export function placedByRecency(lessonIds: string[]): string[] {
  return Object.keys(readPlaces())
    .filter((id) => lessonIds.includes(id))
    .reverse();
}

export function clearPlace(lessonId: string): void {
  const places = readPlaces();
  if (!(lessonId in places)) return;
  delete places[lessonId];
  writePlaces(places);
}

function readPlays(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(PLAYS_KEY);
    const data: unknown = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).filter(
        (e): e is [string, number] => typeof e[1] === "number" && Number.isFinite(e[1]) && e[1] >= 0,
      ),
    );
  } catch {
    return {};
  }
}

/** How many times a challenge round has been finished (its play number for the next play). */
export function getPlays(roundId: string): number {
  return Math.floor(readPlays()[roundId] ?? 0);
}

/** Finish a challenge round: tick it, clear its place, and move its rotation on by one. */
export function finishRound(roundId: string): void {
  const plays = readPlays();
  plays[roundId] = Math.floor(plays[roundId] ?? 0) + 1;
  try {
    window.localStorage.setItem(PLAYS_KEY, JSON.stringify(plays));
  } catch {
    // Storage blocked: the round still plays; the next play shows the first pair again.
  }
  markComplete(roundId);
}

/** One-shot moments on the route (PRODUCT.md "Motion"). */
type Moments = { justCompleted?: string; challengeUnlockSeen?: boolean; leslyMet?: boolean };

function readMoments(): Moments {
  try {
    const raw = window.localStorage.getItem(MOMENTS_KEY);
    const data: unknown = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const m = data as Record<string, unknown>;
    return {
      ...(typeof m.justCompleted === "string" ? { justCompleted: m.justCompleted } : {}),
      ...(m.challengeUnlockSeen === true ? { challengeUnlockSeen: true } : {}),
      ...(m.leslyMet === true ? { leslyMet: true } : {}),
    };
  } catch {
    return {};
  }
}

function writeMoments(m: Moments): void {
  try {
    if (Object.keys(m).length === 0) window.localStorage.removeItem(MOMENTS_KEY);
    else window.localStorage.setItem(MOMENTS_KEY, JSON.stringify(m));
  } catch {
    // Storage blocked: the moment simply doesn't play.
  }
}

/**
 * The level or round just finished for the first time, if it is one of `ids`;
 * it is cleared as it is read, so its moment plays on one visit only.
 */
export function takeJustCompleted(ids: string[]): string | null {
  const m = readMoments();
  if (!m.justCompleted || !ids.includes(m.justCompleted)) return null;
  const id = m.justCompleted;
  delete m.justCompleted;
  writeMoments(m);
  return id;
}

/** Whether the "Close-ups unlocked" moment has already played. */
export function challengeUnlockSeen(): boolean {
  return readMoments().challengeUnlockSeen === true;
}

export function markChallengeUnlockSeen(): void {
  writeMoments({ ...readMoments(), challengeUnlockSeen: true });
}

/** Whether the player has already met Lesly, the guide (her one-time introduction). */
export function leslyMet(): boolean {
  return readMoments().leslyMet === true;
}

export function markLeslyMet(): void {
  writeMoments({ ...readMoments(), leslyMet: true });
}
