// Progress lives only in this browser's localStorage (PRODUCT.md: no
// database, no sign-up). We store which levels are finished, nothing else:
// leaving mid-level restarts that level next time.

const KEY = "louvre-before-you-go:progress:v1";

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
