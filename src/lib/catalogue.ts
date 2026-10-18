// Build-time loading of the 0.6 catalogue, content/modules.json (PRODUCT.md
// "0.6 · Museum framework" and "Catalogue file"). Runs only on the server
// during `next build`, never in the browser.
//
// The pages get a "book": the 15 chapters and the appendix, each work joined
// to its level (when it has one) so a ready work can show its photo and link
// to the level. Order inside a chapter is the file's own module order, which
// the content check enforces; nothing here re-sorts it.

import fs from "node:fs";
import path from "node:path";
import { getRoundForLevel } from "./challenge";
import { getLevels, narratorOf } from "./content";
import type { Catalogue, CatalogueWork, DisplayStatus, Speaker, WingId } from "./types";
import { floorLabel, isOffView } from "./book";
import { validateCatalogue } from "./validate-modules";

const CATALOGUE_FILE = path.join(process.cwd(), "content", "modules.json");

/** What a work's row and label sheet need. Plain data, safe to pass to client components. */
export type BookWork = {
  id: string;
  title: string;
  titleFr?: string;
  artist: string;
  date: string;
  medium: string;
  department: string;
  inventory: string;
  location: {
    wing: WingId;
    wingName: string;
    floor: number;
    room: string | null;
    roomName?: string;
    place?: string;
  } | null;
  display: DisplayStatus;
  displayNote?: string;
  checkedOn: string;
  museumUrl: string | null;
  /** The work's level, when one exists. */
  level?: {
    id: string;
    /** Path under public/ (no basePath), or null when the photo file is missing. */
    image: string | null;
    questionCount: number;
    /** For checking a saved mid-level spot against the current content. */
    nodeIds: string[];
    /** The level's narrator, whose head shows on the work's row. */
    narrator?: Speaker;
  };
  /** The work's close-up round, when one exists; it opens once the level is met. */
  round?: {
    id: string;
    title: string;
    /** Rounds with a pool bigger than the round show new questions on replay. */
    poolSize: number;
    /** Questions in one play of the round. */
    roundSize: number;
    nodeIds: string[];
  };
};

export type BookChapter = {
  /** "01" … "15", or "beyond" for the appendix: also the route. */
  id: string;
  /** Shown big on the page: "09", or "+" for the appendix. */
  number: string;
  title: string;
  appendix: boolean;
  status: "open" | "rooms-closed";
  closedNote?: string;
  checkedOn?: string;
  /** "Denon · Floor 1", "Denon · Floors −1, 0, 1; Sully · Floor 0" (works on view only). */
  wingsFloors: string;
  /** Wing ids with a work placed in them, for the contents filter. */
  wings: WingId[];
  /** Lowest to highest numbered room ("710–712", "501"), or "" when there is none. */
  roomRange: string;
  works: BookWork[];
};

export type Book = {
  wings: { id: WingId; name: string }[];
  chapters: BookChapter[];
};

let cache: Book | null = null;

export function getBook(): Book {
  if (cache) return cache;

  const levels = getLevels();
  const data = JSON.parse(fs.readFileSync(CATALOGUE_FILE, "utf8")) as Catalogue;
  const { errors } = validateCatalogue(data, "modules.json", new Map(levels.map((l) => [l.lesson.id, l.artwork.id])));
  if (errors.length) {
    throw new Error(`Catalogue problems (run \`npm run check-content\`):\n${errors.join("\n")}`);
  }

  const wingName = new Map(data.wings.map((w) => [w.id, w.name]));

  const toWork = (w: CatalogueWork): BookWork => {
    const level = w.levelId ? levels.find((l) => l.lesson.id === w.levelId) : undefined;
    const round = level ? getRoundForLevel(level.lesson.id) : undefined;
    return {
      id: w.id,
      title: w.title,
      ...(w.titleFr ? { titleFr: w.titleFr } : {}),
      artist: w.artist,
      date: w.date,
      medium: w.medium,
      department: w.department,
      inventory: w.inventory,
      location: w.location
        ? {
            wing: w.location.wing,
            wingName: wingName.get(w.location.wing) ?? w.location.wing,
            floor: w.location.floor,
            room: w.location.room,
            ...(w.location.roomName ? { roomName: w.location.roomName } : {}),
            ...(w.location.place ? { place: w.location.place } : {}),
          }
        : null,
      display: w.display,
      ...(w.displayNote ? { displayNote: w.displayNote } : {}),
      checkedOn: w.checkedOn,
      museumUrl: w.museumUrl,
      ...(level
        ? {
            level: {
              id: level.lesson.id,
              image: level.imageAvailable ? level.artwork.image : null,
              questionCount: level.questionCount,
              nodeIds: Object.keys(level.lesson.nodes),
              ...(narratorOf(level) ? { narrator: narratorOf(level) } : {}),
            },
          }
        : {}),
      ...(round
        ? {
            round: {
              id: round.lesson.id,
              title: round.lesson.title,
              poolSize: round.lesson.pool.length,
              roundSize: Math.min(round.lesson.roundSize, round.lesson.pool.length),
              nodeIds: Object.keys(round.lesson.nodes),
            },
          }
        : {}),
    };
  };

  const chapter = (
    m: { id: string; title: string; status?: "open" | "rooms-closed"; closedNote?: string; checkedOn?: string; works: CatalogueWork[] },
    appendix: boolean,
  ): BookChapter => {
    const works = m.works.map(toWork);
    return {
      id: m.id,
      number: appendix ? "+" : m.id,
      title: m.title,
      appendix,
      status: m.status ?? "open",
      ...(m.closedNote ? { closedNote: m.closedNote } : {}),
      ...(m.checkedOn ? { checkedOn: m.checkedOn } : {}),
      wingsFloors: wingsFloors(works),
      wings: [...new Set(works.flatMap((w) => (w.location ? [w.location.wing] : [])))],
      roomRange: roomRange(works),
      works,
    };
  };

  cache = {
    wings: data.wings.map((w) => ({ id: w.id, name: w.name })),
    chapters: [...data.modules.map((m) => chapter(m, false)), chapter(data.appendix, true)],
  };
  return cache;
}

export function getChapter(id: string): BookChapter | undefined {
  return getBook().chapters.find((c) => c.id === id);
}

/** The chapter holding a work, and the next work after it (in module order) that has a level. */
export function nextInChapter(workId: string): { chapterId: string; next?: BookWork } | undefined {
  for (const c of getBook().chapters) {
    const i = c.works.findIndex((w) => w.id === workId);
    if (i >= 0) return { chapterId: c.id, next: c.works.slice(i + 1).find((w) => w.level) };
  }
  return undefined;
}

/** Wings in order of first appearance in the chapter, each with its floors, low to high. */
function wingsFloors(works: BookWork[]): string {
  const byWing = new Map<string, Set<number>>();
  for (const w of works) {
    if (!w.location || isOffView(w)) continue;
    const floors = byWing.get(w.location.wingName) ?? new Set<number>();
    floors.add(w.location.floor);
    byWing.set(w.location.wingName, floors);
  }
  return [...byWing]
    .map(([name, floors]) => {
      const list = [...floors].sort((a, b) => a - b).map(floorLabel);
      return `${name} · ${list.length > 1 ? "Floors" : "Floor"} ${list.join(", ")}`;
    })
    .join("; ");
}

function roomRange(works: BookWork[]): string {
  const rooms = works.flatMap((w) => (w.location?.room && /^\d+$/.test(w.location.room) ? [Number(w.location.room)] : []));
  if (!rooms.length) return "";
  const lo = Math.min(...rooms);
  const hi = Math.max(...rooms);
  return lo === hi ? String(lo) : `${lo}–${hi}`;
}
