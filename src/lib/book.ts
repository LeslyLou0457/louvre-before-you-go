// Client-safe helpers for the contents and chapter pages (PRODUCT.md
// "Status: what each work says it is" and "Progress, 'Next up' and seals").
// A work's state is derived from the existing progress keys (progress:v1 and
// place:v1, read by lib/book-progress); nothing new is stored.
// No React or browser APIs here: the server loader uses it too.

import type { BookWork } from "./catalogue";
import type { SavedPlace } from "./progress";
import type { DisplayStatus } from "./types";
import { OFF_VIEW } from "./validate-modules";

/** met: level finished · cont: a saved place · ready: level not started · soon: no level · off: no level, not on view. */
export type WorkState = "met" | "cont" | "ready" | "soon" | "off";

/** The grey chip of a work not on view (PRODUCT.md "Display state"). */
export const OFF_LABEL: Partial<Record<DisplayStatus, string>> = {
  "not-on-display": "Not on display",
  "on-loan": "On loan",
  "room-closed": "Room closed",
  "appointment-only": "By appointment only",
};

/** Status line on the label sheet, before the date checked. */
export const DISPLAY_TEXT: Record<DisplayStatus, string> = {
  "on-display": "On display",
  restricted: "On display, access restricted",
  tbd: "Room and display not confirmed",
  "room-closed": "Room closed",
  "not-on-display": "Not on display",
  "on-loan": "On loan",
  "appointment-only": "By appointment only",
};

export function isOffView(w: Pick<BookWork, "display">): boolean {
  return OFF_VIEW.includes(w.display);
}

export type Progress = {
  completed: Set<string>;
  places: Record<string, SavedPlace | null>;
};

/** A level's state wins over display: a work with a level can always be played. */
export function workState(w: BookWork, p: Progress): WorkState {
  if (w.level) {
    if (p.completed.has(w.level.id)) return "met";
    if (p.places[w.level.id]) return "cont";
    return "ready";
  }
  return isOffView(w) ? "off" : "soon";
}

/** "2 met · 1 ready · 6 coming soon · 2 not on view" (zero counts left out). */
export function summary(states: WorkState[]): string {
  const n = (s: WorkState) => states.filter((x) => x === s).length;
  return (
    [
      [n("met"), "met"],
      [n("cont"), "in progress"],
      [n("ready"), "ready"],
      [n("soon"), "coming soon"],
      [n("off"), "not on view"],
    ] as const
  )
    .filter(([count]) => count > 0)
    .map(([count, word]) => `${count} ${word}`)
    .join(" · ");
}

/** The first work in module order that has a level and isn't met yet. */
export function nextUpId(works: BookWork[], states: WorkState[]): string | null {
  const i = works.findIndex((w, k) => w.level && states[k] !== "met");
  return i >= 0 ? works[i].id : null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-13" → "13 Oct 2026". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "−1" with a real minus sign, as printed. */
export function floorLabel(floor: number): string {
  return String(floor).replace("-", "−");
}
