// Progress lives only in this browser's localStorage (PRODUCT.md: no
// database, no sign-up). Two keys:
// - KEY: which levels are finished (unchanged since 0.5 launch, so existing
//   players keep their ticks).
// - PLACE_KEY: where the player is inside each unfinished level, so leaving
//   or reloading mid-level picks up at the same passage or question.
// - PLAYS_KEY: Close-Up Challenge only, how many times each round has been
//   finished; it picks the pair of questions the next play shows.
// Challenge rounds use KEY and PLACE_KEY too, under their own lesson ids.

const KEY = "louvre-before-you-go:progress:v1";
const PLACE_KEY = "louvre-before-you-go:place:v1";
const PLAYS_KEY = "louvre-before-you-go:challenge-plays:v1";

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
    if (!completed.includes(lessonId)) completed.push(lessonId);
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
  places[lessonId] = place;
  writePlaces(places);
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
