// Where a chapter was opened from, so its back arrow returns there
// (PRODUCT.md "Structure and navigation": "Back always returns to where the
// module was opened from"). The map's chapter rows add `?from=map-denon&floor=1`;
// anything else came from the contents. Client components only.

import type { Tab } from "@/components/TabBar";

export type ChapterOrigin = { href: string; label: string; tab: Tab };

export const FROM_CONTENTS: ChapterOrigin = { href: "/contents/", label: "Back to contents", tab: "contents" };

const WINGS: Record<string, string> = { denon: "Denon", sully: "Sully", richelieu: "Richelieu" };

export function readChapterOrigin(): ChapterOrigin {
  try {
    const q = new URLSearchParams(window.location.search);
    const m = /^map-(denon|sully|richelieu)$/.exec(q.get("from") ?? "");
    if (!m) return q.get("from") === "map" ? { href: "/map/", label: "Back to the map", tab: "map" } : FROM_CONTENTS;
    const floor = Number(q.get("floor"));
    const anchor = Number.isInteger(floor) && floor >= -1 && floor <= 2 ? `#${floor < 0 ? `level-minus-${-floor}` : `level-${floor}`}` : "";
    return { href: `/map/${m[1]}/${anchor}`, label: `Back to the ${WINGS[m[1]]} wing`, tab: "map" };
  } catch {
    return FROM_CONTENTS;
  }
}
