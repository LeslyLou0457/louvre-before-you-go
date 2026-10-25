// The visit day (PRODUCT.md "Visit countdown"): the one day the player plans
// to be at the Louvre, stored only in this browser's localStorage as a plain
// local date, "YYYY-MM-DD". Losing it only asks for the day again.

const VISIT_KEY = "louvre-before-you-go:visit:v1";
const DAY_MS = 86_400_000;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date in the player's own time zone, as "YYYY-MM-DD". */
export function todayIso(now = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

/** Tomorrow, the earliest day the picker allows. */
export function tomorrowIso(now = new Date()): string {
  return todayIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
}

function utc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from today to the visit: 0 on the day, negative once it has passed. */
export function daysUntil(visit: string, now = new Date()): number {
  return Math.round((utc(visit) - utc(todayIso(now))) / DAY_MS);
}

export function getVisit(): string | null {
  try {
    const raw = window.localStorage.getItem(VISIT_KEY);
    return raw && ISO.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Saves a visit day; only a future date is accepted (returns false otherwise). */
export function setVisit(visit: string): boolean {
  if (!ISO.test(visit) || daysUntil(visit) < 1) return false;
  try {
    window.localStorage.setItem(VISIT_KEY, visit);
  } catch {
    // Storage blocked: the countdown simply isn't remembered.
  }
  return true;
}

/** "Saturday 14 November", in English, for the line under the sign. */
export function formatVisit(visit: string): string {
  const [y, m, d] = visit.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
