// Checks for the 0.6 catalogue, content/modules.json (PRODUCT.md
// "0.6 · Museum framework" and "Catalogue file"), run by
// `npm run check-content`.
// Keep this file free of runtime imports so Node can run it directly.

import type { Catalogue, CatalogueModule, CatalogueWork, DisplayStatus } from "./types";

export const DISPLAY_STATUSES: readonly DisplayStatus[] = [
  "on-display",
  "restricted",
  "tbd",
  "room-closed",
  "not-on-display",
  "on-loan",
  "appointment-only",
];

/** Not on view: listed last in a module. */
export const OFF_VIEW: readonly DisplayStatus[] = ["room-closed", "not-on-display", "on-loan", "appointment-only"];

/** Off-view states whose work has no location in the record. */
const NO_LOCATION: readonly DisplayStatus[] = ["not-on-display", "on-loan", "appointment-only"];

export const MODULE_COUNT = 15;
/** A record checked longer ago than this gets a warning. */
export const RECHECK_DAYS = 90;

const WORK_KEYS = new Set([
  "id", "title", "titleFr", "artist", "date", "medium", "department", "inventory", "location",
  "display", "displayNote", "rowNote", "checkedOn", "museumUrl", "levelId", "note",
]);
const LOCATION_KEYS = new Set(["wing", "floor", "room", "roomName", "place"]);
const MODULE_KEYS = new Set(["id", "slug", "title", "status", "closedNote", "checkedOn", "works"]);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type CatalogueSummary = {
  modules: number;
  works: number;
  withLevel: number;
  notOnView: number;
  appendix: number;
};

export type CatalogueReport = { errors: string[]; warnings: string[]; summary: CatalogueSummary };

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** A real calendar date written YYYY-MM-DD, as a UTC timestamp, or null. */
function parseDate(v: unknown): number | null {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const t = Date.parse(`${v}T00:00:00Z`);
  return Number.isNaN(t) || new Date(t).toISOString().slice(0, 10) !== v ? null : t;
}

/** 0: on view with a room number; 1: on view without one; 2: not on view. */
function orderGroup(w: CatalogueWork): 0 | 1 | 2 {
  if (OFF_VIEW.includes(w.display)) return 2;
  return w.location?.room ? 0 : 1;
}

/**
 * Checks the parsed catalogue. `file` is only used in messages.
 * `levels` maps every level's lesson id to its file's artwork.id;
 * `today` is the date the 90-day recheck warning counts from.
 */
export function validateCatalogue(
  data: unknown,
  file: string,
  levels: Map<string, string>,
  today: Date = new Date(),
): CatalogueReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const summary: CatalogueSummary = { modules: 0, works: 0, withLevel: 0, notOnView: 0, appendix: 0 };
  const err = (m: string) => errors.push(`${file}: ${m}`);
  const warn = (m: string) => warnings.push(`${file}: ${m}`);

  const d = data as Partial<Catalogue>;
  if (!d || typeof d !== "object") {
    err("not a JSON object");
    return { errors, warnings, summary };
  }
  if (!isText(d.museum)) err("museum is missing");

  // Wings and their floors.
  const floorsOf = new Map<string, Set<number>>();
  if (!Array.isArray(d.wings) || !d.wings.length) err("wings is missing");
  for (const [i, w] of (Array.isArray(d.wings) ? d.wings : []).entries()) {
    const at = `wings[${i}]`;
    if (!isText(w?.id) || !SLUG.test(w.id)) {
      err(`${at}: id is missing or not lower-case`);
      continue;
    }
    if (floorsOf.has(w.id)) err(`${at}: duplicate wing "${w.id}"`);
    if (!isText(w.name)) err(`${at} (${w.id}): name is missing`);
    const floors = Array.isArray(w.floors) ? w.floors : [];
    if (!floors.length || floors.some((f) => !Number.isInteger(f) || f < -1 || f > 2)) {
      err(`${at} (${w.id}): floors must be whole numbers from -1 to 2`);
    }
    if (new Set(floors).size !== floors.length) err(`${at} (${w.id}): a floor is listed twice`);
    floorsOf.set(w.id, new Set(floors));
  }

  // Modules, in number order, then the appendix.
  const modules = Array.isArray(d.modules) ? d.modules : [];
  if (!Array.isArray(d.modules)) err("modules is missing");
  if (modules.length !== MODULE_COUNT) err(`${modules.length} modules, expected ${MODULE_COUNT}`);
  const slugs = new Set<string>();
  const groups: { at: string; works: unknown }[] = [];
  modules.forEach((m: Partial<CatalogueModule>, i) => {
    const want = String(i + 1).padStart(2, "0");
    const at = `module ${isText(m?.id) ? m.id : `#${i + 1}`}`;
    if (m?.id !== want) err(`modules[${i}]: id should be "${want}" (modules are numbered 01–${MODULE_COUNT}, in order)`);
    for (const k of Object.keys(m ?? {})) if (!MODULE_KEYS.has(k)) err(`${at}: unknown field "${k}"`);
    if (!isText(m?.title)) err(`${at}: title is missing`);
    if (!isText(m?.slug) || !SLUG.test(m.slug)) err(`${at}: slug is missing or not URL-safe`);
    else if (slugs.has(m.slug)) err(`${at}: duplicate slug "${m.slug}"`);
    else slugs.add(m.slug);
    if (m?.status === "rooms-closed") {
      if (!isText(m.closedNote)) err(`${at}: a "rooms-closed" module needs closedNote`);
      if (parseDate(m.checkedOn) === null) err(`${at}: a "rooms-closed" module needs checkedOn (YYYY-MM-DD)`);
    } else if (m?.status === "open") {
      if (!Array.isArray(m.works) || !m.works.length) err(`${at}: an open module needs at least one work`);
    } else {
      err(`${at}: status must be "open" or "rooms-closed"`);
    }
    groups.push({ at, works: m?.works });
  });
  const ap = d.appendix;
  if (!ap || typeof ap !== "object") err("appendix is missing");
  else {
    if (ap.id !== "beyond") err('appendix: id should be "beyond"');
    if (!isText(ap.title)) err("appendix: title is missing");
    if (!isText(ap.slug) || !SLUG.test(ap.slug) || slugs.has(ap.slug)) err("appendix: slug is missing, not URL-safe or taken");
    groups.push({ at: "appendix", works: ap.works });
  }
  summary.modules = modules.length;

  // Works: exactly one place each, well formed, in module order.
  const seen = new Map<string, string>();
  const linked = new Map<string, string>(); // lesson id -> work id
  for (const g of groups) {
    if (!Array.isArray(g.works)) {
      err(`${g.at}: works is missing`);
      continue;
    }
    let prev: { group: number; room: number; id: string } | null = null;
    for (const [i, w] of (g.works as CatalogueWork[]).entries()) {
      const at = `${g.at}, work ${isText(w?.id) ? `"${w.id}"` : `#${i + 1}`}`;
      if (!w || typeof w !== "object") {
        err(`${at}: not an object`);
        continue;
      }
      summary.works++;
      if (g.at === "appendix") summary.appendix++;
      for (const k of Object.keys(w)) if (!WORK_KEYS.has(k)) err(`${at}: unknown field "${k}"`);
      if (!isText(w.id) || !SLUG.test(w.id)) err(`${at}: id is missing or not URL-safe`);
      else if (seen.has(w.id)) err(`${at}: also in ${seen.get(w.id)}; every work belongs to exactly one module or the appendix`);
      else seen.set(w.id, g.at);
      for (const k of ["title", "artist", "date", "medium", "department", "inventory"] as const) {
        if (!isText(w[k])) err(`${at}: ${k} is missing (write "TBD" when the record doesn't confirm it)`);
      }
      if (w.titleFr !== undefined && (!isText(w.titleFr) || w.titleFr === w.title)) {
        err(`${at}: titleFr is empty or the same as title; leave it out instead`);
      }

      // Display status and the date checked.
      const display = w.display;
      if (!DISPLAY_STATUSES.includes(display)) err(`${at}: display "${String(display)}" is not one of ${DISPLAY_STATUSES.join(", ")}`);
      if (display !== "on-display" && !isText(w.displayNote)) err(`${at}: display "${display}" needs a displayNote (the reason)`);
      if (w.rowNote !== undefined && (!isText(w.rowNote) || !OFF_VIEW.includes(display))) {
        err(`${at}: rowNote must be text, and only on a work not on view; leave it out otherwise`);
      }
      if (OFF_VIEW.includes(display)) summary.notOnView++;
      const checked = parseDate(w.checkedOn);
      if (checked === null) err(`${at}: checkedOn must be a date, YYYY-MM-DD`);
      else {
        const days = Math.floor((today.getTime() - checked) / 86_400_000);
        if (days < -1) err(`${at}: checkedOn ${w.checkedOn} is in the future`);
        else if (days > RECHECK_DAYS) warn(`${at}: record checked ${days} days ago (${w.checkedOn}); recheck it`);
      }
      if (w.museumUrl !== null && !(isText(w.museumUrl) && w.museumUrl.startsWith("https://collections.louvre.fr/"))) {
        err(`${at}: museumUrl must be a collections.louvre.fr link or null`);
      }
      if (w.note !== undefined && !isText(w.note)) err(`${at}: note is empty`);

      // Location.
      const loc = w.location;
      if (loc === null) {
        if (!NO_LOCATION.includes(display)) err(`${at}: location is null, but display "${display}" needs one`);
      } else if (!loc || typeof loc !== "object") {
        err(`${at}: location is missing (an object, or null when the work is not on view)`);
      } else {
        for (const k of Object.keys(loc)) if (!LOCATION_KEYS.has(k)) err(`${at}: unknown location field "${k}"`);
        const floors = floorsOf.get(loc.wing);
        if (!floors) err(`${at}: unknown wing "${String(loc.wing)}"`);
        else if (!floors.has(loc.floor)) err(`${at}: floor ${String(loc.floor)} is not listed for ${loc.wing}`);
        if (loc.room === null) {
          if (!isText(loc.place)) err(`${at}: a location without a room number needs a place`);
          if (loc.roomName !== undefined) err(`${at}: roomName needs a room number; use place`);
        } else if (typeof loc.room !== "string" || !/^\d{2,4}$/.test(loc.room)) {
          err(`${at}: room must be a room number written as a string ("711"), or null with a place`);
        }
        if (loc.roomName !== undefined && !isText(loc.roomName)) err(`${at}: roomName is empty`);
      }

      // Order: on view by room number, then on view without a number, then not on view.
      const group = orderGroup(w);
      const room = group === 0 ? Number(w.location!.room) : 0;
      if (prev && (group < prev.group || (group === 0 && prev.group === 0 && room < prev.room))) {
        const why = group < prev.group
          ? "not-on-view works come last, after works on view without a room number"
          : `room ${room} comes before room ${prev.room}`;
        err(`${at}: out of order after "${prev.id}" (${why})`);
      }
      prev = { group, room, id: String(w.id) };

      // Link to an existing level.
      if (w.levelId !== undefined) {
        summary.withLevel++;
        const artwork = levels.get(w.levelId);
        if (!isText(w.levelId) || artwork === undefined) err(`${at}: levelId "${String(w.levelId)}" is not a level in content/`);
        else if (artwork !== w.id) err(`${at}: levelId "${w.levelId}" is the level of "${artwork}", not of this work`);
        if (linked.has(w.levelId)) err(`${at}: levelId "${w.levelId}" is already used by "${linked.get(w.levelId)}"`);
        linked.set(w.levelId, String(w.id));
      }
    }
  }

  // Every level's artwork is in the catalogue, linked by levelId.
  const withLevel = new Set(linked.values());
  for (const [lessonId, artworkId] of levels) {
    if (!seen.has(artworkId)) err(`level "${lessonId}": its artwork "${artworkId}" is in no module or the appendix`);
    else if (!withLevel.has(artworkId)) err(`level "${lessonId}": the work "${artworkId}" has no levelId`);
  }

  return { errors, warnings, summary };
}
