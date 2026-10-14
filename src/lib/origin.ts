// Where a level was opened from, so finishing or leaving it goes back there
// (PRODUCT.md "Structure and navigation": "A level or round finished from a
// module returns to that module"). Carried in the URL as `?from=09`,
// `?from=beyond` or `?from=cover`; no `from` means the "Start here" trail,
// which is where every level opened before 0.6 returns. Nothing is stored.
// Client components only (reads window.location).

export type Origin = { kind: "trail" } | { kind: "cover" } | { kind: "chapter"; id: string };

const CHAPTER = /^(0[1-9]|1[0-5]|beyond)$/;

export const TRAIL: Origin = { kind: "trail" };

/** The origin named by a `from` value, or the trail when it names nothing we know. */
export function parseOrigin(from: string | null | undefined): Origin {
  if (from === "cover") return { kind: "cover" };
  if (from && CHAPTER.test(from)) return { kind: "chapter", id: from };
  return TRAIL;
}

export function readOrigin(): Origin {
  try {
    return parseOrigin(new URLSearchParams(window.location.search).get("from"));
  } catch {
    return TRAIL;
  }
}

/** The page to go back to. */
export function originHref(o: Origin): string {
  if (o.kind === "cover") return "/";
  if (o.kind === "chapter") return `/chapter/${o.id}/`;
  return "/start/";
}

/** "Back to Chapter 09", "Back to the appendix", "Back to the cover", "Back to the journey". */
export function originLabel(o: Origin): string {
  if (o.kind === "cover") return "Back to the cover";
  if (o.kind === "chapter") return o.id === "beyond" ? "Back to the appendix" : `Back to Chapter ${o.id}`;
  return "Back to the journey";
}

/** `?from=…` to append to a level link, or "" for the trail. */
export function originQuery(o: Origin): string {
  if (o.kind === "cover") return "?from=cover";
  if (o.kind === "chapter") return `?from=${o.id}`;
  return "";
}
