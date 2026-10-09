// Build-time loading of the Close-Up Challenge (content/challenge/*.json).
// Runs only on the server during `next build`, never in the browser.
// Rounds follow the level route: the round of the first level's artwork
// comes first.

import fs from "node:fs";
import path from "node:path";
import { getLevels } from "./content";
import type { ChallengeFile, Round, SourceRef, Speaker, StoryNode } from "./types";
import { sortContentFiles } from "./validate";
import { validateChallenge, type BaseInfo } from "./validate-challenge";

const CHALLENGE_DIR = path.join(process.cwd(), "content", "challenge");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let cache: Round[] | null = null;

export function getRounds(): Round[] {
  if (cache) return cache;
  const levels = getLevels();
  const base = new Map<string, BaseInfo>(
    levels.map((l) => [l.artwork.id, { file: l.file, nodeIds: new Set(Object.keys(l.lesson.nodes)), speakers: l.speakers }]),
  );
  const exists = (p: string) => fs.existsSync(path.join(PUBLIC_DIR, p));

  const found: Omit<Round, "index">[] = [];
  const problems: string[] = [];
  const files = fs.existsSync(CHALLENGE_DIR) ? sortContentFiles(fs.readdirSync(CHALLENGE_DIR)) : [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(CHALLENGE_DIR, file), "utf8")) as ChallengeFile;
    const { errors } = validateChallenge(data, `challenge/${file}`, base, exists);
    if (errors.length) {
      problems.push(...errors);
      continue;
    }
    const level = levels.find((l) => l.artwork.id === data.artworkId)!;
    for (const lesson of data.lessons) {
      found.push({
        lesson,
        artwork: level.artwork,
        speakers: level.speakers,
        zoomImage: data.zoomImage,
        levelId: level.lesson.id,
        file,
      });
    }
  }
  if (problems.length) {
    throw new Error(`Challenge content problems (run \`npm run check-content\`):\n${problems.join("\n")}`);
  }

  const order = (r: Omit<Round, "index">) => levels.findIndex((l) => l.lesson.id === r.levelId);
  cache = found.sort((a, b) => order(a) - order(b)).map((r, index) => ({ ...r, index }));
  return cache;
}

export function getRound(id: string): Round | undefined {
  return getRounds().find((r) => r.lesson.id === id);
}

/** Challenge summary passed to the home page (no node text). */
export type ChallengeItem = {
  id: string;
  title: string;
  artworkTitle: string;
  narrator?: Speaker;
  pool: string[];
  /** For checking a saved mid-round spot against the current content. */
  nodeIds: string[];
};

export function getChallenge(): ChallengeItem[] {
  return getRounds().map((r) => ({
    id: r.lesson.id,
    title: r.lesson.title,
    artworkTitle: r.artwork.title,
    narrator: r.lesson.narrator ? r.speakers[r.lesson.narrator] : undefined,
    pool: r.lesson.pool,
    nodeIds: Object.keys(r.lesson.nodes),
  }));
}

/** Merge line of each pool question, keyed by its intro id (for the cleared page). */
export function mergeLines(r: Round): Record<string, string> {
  return Object.fromEntries(
    r.lesson.pool.map((start) => [start, (r.lesson.nodes[`${start}m`] as StoryNode).text]),
  );
}

/** Every source of a round's shippable questions, once each, in pool order. */
export function closeUpSources(r: Round): SourceRef[] {
  const seen = new Map<string, SourceRef>();
  for (const start of r.lesson.pool) {
    const q = r.lesson.nodes[`${start}q`];
    if (q?.type !== "question") continue;
    for (const s of q.sources ?? []) if (!seen.has(s.url)) seen.set(s.url, s);
  }
  return [...seen.values()];
}
