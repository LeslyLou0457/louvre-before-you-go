// Build-time content loading. Runs only on the server during `next build`
// (static export), never in the browser.
//
// "Add one JSON, get one more artwork": every content/NN-name.json file is
// picked up and the journey is ordered by the NN prefix, then by lesson order.

import fs from "node:fs";
import path from "node:path";
import type { ContentFile, Level } from "./types";
import { sortContentFiles, validateContent } from "./validate";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let cache: Level[] | null = null;

export function getLevels(): Level[] {
  if (cache) return cache;

  const levels: Level[] = [];
  const problems: string[] = [];

  for (const file of sortContentFiles(fs.readdirSync(CONTENT_DIR))) {
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")) as ContentFile;
    const { errors } = validateContent(data, file);
    if (errors.length) {
      problems.push(...errors);
      continue;
    }
    const imageAvailable = fs.existsSync(path.join(PUBLIC_DIR, data.artwork.image));
    for (const lesson of [...data.lessons].sort((a, b) => a.order - b.order)) {
      levels.push({
        index: levels.length,
        lesson,
        artwork: data.artwork,
        museum: data.museum,
        questionCount: Object.values(lesson.nodes).filter((n) => n.type === "question").length,
        imageAvailable,
        file,
      });
    }
  }

  const ids = levels.map((l) => l.lesson.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) problems.push(`duplicate lesson ids: ${dupes.join(", ")}`);

  if (problems.length) {
    throw new Error(`Content problems (run \`npm run check-content\`):\n${problems.join("\n")}`);
  }

  cache = levels;
  return levels;
}

export function getLevel(id: string): Level | undefined {
  return getLevels().find((l) => l.lesson.id === id);
}

/** Journey summary passed to client components (no node text). */
export type JourneyItem = {
  id: string;
  title: string;
  artworkTitle: string;
  artist: string;
};

export function getJourney(): JourneyItem[] {
  return getLevels().map((l) => ({
    id: l.lesson.id,
    title: l.lesson.title,
    artworkTitle: l.artwork.title,
    artist: l.artwork.artist,
  }));
}

/**
 * Link to the work on the museum's own site: `artwork.museumUrl` if the
 * content gives one, otherwise the level's first source on
 * collections.louvre.fr (the Louvre's own record of the work).
 */
export function museumLink(level: Level): string | undefined {
  return (
    level.artwork.museumUrl ??
    level.lesson.sources.find((s) => s.startsWith("https://collections.louvre.fr/"))
  );
}
