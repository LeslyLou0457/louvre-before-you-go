// Content check: `npm run check-content`.
// Every `next` exists, every node is reachable, 5 questions per level,
// 2–3 choices per question, sources not empty, word budgets (warnings),
// and whether each artwork's image file is in public/.
// Then the Close-Up Challenge files in content/challenge/ (see
// src/lib/validate-challenge.ts), with each round's reading time.
// Runs with plain Node (type stripping), no extra packages.

import fs from "node:fs";
import path from "node:path";
import { sortContentFiles, validateContent } from "../src/lib/validate.ts";
import { validateChallenge, type BaseInfo } from "../src/lib/validate-challenge.ts";

const root = process.cwd();
const contentDir = path.join(root, "content");
const files = sortContentFiles(fs.readdirSync(contentDir));

let errors = 0;
let warnings = 0;
const ids = new Set<string>();
const base = new Map<string, BaseInfo>();

for (const file of files) {
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
  } catch (e) {
    console.log(`ERROR ${file}: invalid JSON (${(e as Error).message})`);
    errors++;
    continue;
  }
  const report = validateContent(data, file);
  const d = data as {
    artwork?: { id?: string; image?: string };
    speakers?: Record<string, unknown>;
    lessons?: { id: string; nodes?: Record<string, unknown> }[];
  };
  if (d.artwork?.id) {
    base.set(d.artwork.id, {
      file,
      nodeIds: new Set((d.lessons ?? []).flatMap((l) => Object.keys(l.nodes ?? {}))),
      speakers: d.speakers ?? {},
    });
  }
  for (const l of d.lessons ?? []) {
    if (ids.has(l.id)) report.errors.push(`${file}: duplicate lesson id "${l.id}"`);
    ids.add(l.id);
  }
  if (d.artwork?.image && !fs.existsSync(path.join(root, "public", d.artwork.image))) {
    report.warnings.push(`${file}: image ${d.artwork.image} not in public/ (placeholder shown)`);
  }
  report.errors.forEach((m) => console.log(`ERROR ${m}`));
  report.warnings.forEach((m) => console.log(`warn  ${m}`));
  errors += report.errors.length;
  warnings += report.warnings.length;
  if (!report.errors.length) console.log(`ok    ${file}`);
}

// Close-Up Challenge files.
const challengeDir = path.join(contentDir, "challenge");
const challengeFiles = fs.existsSync(challengeDir) ? sortContentFiles(fs.readdirSync(challengeDir)) : [];
const exists = (p: string) => fs.existsSync(path.join(root, "public", p));
const artworks = new Set<string>();
let allWorst = 0;
let allRight = 0;
for (const file of challengeFiles) {
  const name = `challenge/${file}`;
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(path.join(challengeDir, file), "utf8"));
  } catch (e) {
    console.log(`ERROR ${name}: invalid JSON (${(e as Error).message})`);
    errors++;
    continue;
  }
  const report = validateChallenge(data, name, base, exists);
  const d = data as { artworkId?: string; lessons?: { id: string }[] };
  if (d.artworkId && artworks.has(d.artworkId)) report.errors.push(`${name}: a second challenge file for "${d.artworkId}"`);
  if (d.artworkId) artworks.add(d.artworkId);
  for (const l of d.lessons ?? []) {
    if (ids.has(l.id)) report.errors.push(`${name}: duplicate lesson id "${l.id}"`);
    ids.add(l.id);
  }
  report.errors.forEach((m) => console.log(`ERROR ${m}`));
  report.warnings.forEach((m) => console.log(`warn  ${m}`));
  errors += report.errors.length;
  warnings += report.warnings.length;
  if (!report.errors.length) console.log(`ok    ${name}`);
  for (const t of report.times) {
    console.log(`        play ${t.play}: ${t.pair.join(" + ")}  ${t.right} s all right, ${t.worst} s all wrong`);
  }
  if (report.times.length) {
    allWorst += Math.max(...report.times.map((t) => t.worst));
    allRight += Math.max(...report.times.map((t) => t.right));
  }
}
if (challengeFiles.length) {
  console.log(
    `\nClose-Up Challenge, heaviest pair of each round: ${(allRight / 60).toFixed(1)} min all right, ${(allWorst / 60).toFixed(1)} min all wrong (cap 12)`,
  );
  if (allWorst > 720) {
    console.log("ERROR the whole challenge can take more than 12 minutes");
    errors++;
  }
}

console.log(`\n${files.length + challengeFiles.length} files, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
