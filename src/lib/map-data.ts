// Build-time data for the map and the wing pages (PRODUCT.md "The map" and
// "Structure and navigation": Map, Wing). Everything is derived from
// content/modules.json through the book; nothing is typed by hand.
//
// The map shows works on view, as the chapter pages define it ("Order"): a
// work with a place in the museum whose display is on-display, restricted or
// not yet confirmed. Works not on view and the appendix stay in Contents and
// in their chapters; the map is never the only way in.

import { buildLouvreMap, WING_NAMES, type MapDrawing, type WingName } from "@/doodles/map";
import { floorLabel, isOffView } from "./book";
import { getBook, type BookChapter, type BookWork } from "./catalogue";
import type { WingId } from "./types";

export type MapChapterRow = {
  id: string;
  title: string;
  /** Works of this chapter on this floor of this wing. */
  here: number;
  /** "Room 703", "Rooms 700–702", or a place with no number. */
  rooms: string;
  /** "Sully, Floor 0", for the chapter's works on view elsewhere. */
  also: string[];
};

export type MapFloor = {
  floor: number;
  /** "level-1", "level-0", "level-minus-1": the floor's #anchor on the wing page. */
  anchor: string;
  works: number;
  /** Lowest to highest room number on this floor, or "". */
  rooms: string;
  chapters: MapChapterRow[];
};

export type MapWing = {
  id: WingId;
  name: WingName;
  /** Top floor first, like a cross-section of the building. Floors with no work on view are left out. */
  floors: MapFloor[];
  chapters: number;
  works: number;
  /** "Denon wing: 6 chapters, 30 works on view, floors −1 to 1". */
  ariaLabel: string;
};

export type MapData = {
  drawing: MapDrawing;
  wings: MapWing[];
  /** The chapters, for each row's progress dots. */
  chapters: BookChapter[];
  /** Works of the 100 that are not on the map. */
  offMap: number;
};

export function floorAnchor(floor: number): string {
  return floor < 0 ? `level-minus-${-floor}` : `level-${floor}`;
}

function range(nums: number[]): string {
  if (!nums.length) return "";
  const lo = Math.min(...nums), hi = Math.max(...nums);
  return lo === hi ? String(lo) : `${lo}–${hi}`;
}

function roomsText(works: BookWork[]): string {
  const nums = works.flatMap((w) => (w.location?.room ? [Number(w.location.room)] : []));
  const r = range(nums);
  if (r) return `${r.includes("–") ? "Rooms" : "Room"} ${r}`;
  return works.find((w) => w.location?.place)?.location?.place ?? "";
}

let cache: MapData | null = null;

export function getMapData(): MapData {
  if (cache) return cache;
  const book = getBook();
  const chapters = book.chapters.filter((c) => !c.appendix);
  const onMap = chapters.flatMap((c) => c.works.filter((w) => w.location && !isOffView(w)).map((w) => ({ w, chapter: c })));

  const wings: MapWing[] = book.wings.map((wing) => {
    const name = wing.name as WingName;
    const mine = onMap.filter((x) => x.w.location!.wing === wing.id);
    const floorNums = [...new Set(mine.map((x) => x.w.location!.floor))].sort((a, b) => b - a);
    const floors: MapFloor[] = floorNums.map((floor) => {
      const here = mine.filter((x) => x.w.location!.floor === floor);
      const ids = [...new Set(here.map((x) => x.chapter.id))].sort();
      return {
        floor,
        anchor: floorAnchor(floor),
        works: here.length,
        rooms: range(here.flatMap((x) => (x.w.location!.room ? [Number(x.w.location!.room)] : []))),
        chapters: ids.map((id) => {
          const chapter = chapters.find((c) => c.id === id)!;
          const works = here.filter((x) => x.chapter.id === id).map((x) => x.w);
          const elsewhere = onMap.filter((x) => x.chapter.id === id && !(x.w.location!.wing === wing.id && x.w.location!.floor === floor));
          const also = [...new Set(elsewhere.map((x) => `${x.w.location!.wingName}, Floor ${floorLabel(x.w.location!.floor)}`))];
          return { id, title: chapter.title, here: works.length, rooms: roomsText(works), also };
        }),
      };
    });
    const nChapters = new Set(mine.map((x) => x.chapter.id)).size;
    const lo = Math.min(...floorNums), hi = Math.max(...floorNums);
    return {
      id: wing.id,
      name,
      floors,
      chapters: nChapters,
      works: mine.length,
      ariaLabel: `${name} wing: ${nChapters} chapters, ${mine.length} works on view, floors ${floorLabel(lo)} to ${floorLabel(hi)}`,
    };
  });

  const text = Object.fromEntries(
    WING_NAMES.map((n) => {
      const w = wings.find((x) => x.name === n)!;
      const lo = Math.min(...w.floors.map((f) => f.floor)), hi = Math.max(...w.floors.map((f) => f.floor));
      return [n, { ariaLabel: w.ariaLabel, levels: `Floors ${floorLabel(lo)} to ${floorLabel(hi)}` }];
    }),
  ) as Record<WingName, { ariaLabel: string; levels: string }>;

  cache = {
    drawing: buildLouvreMap(text),
    wings,
    chapters,
    offMap: book.chapters.reduce((n, c) => n + c.works.length, 0) - onMap.length,
  };
  return cache;
}
