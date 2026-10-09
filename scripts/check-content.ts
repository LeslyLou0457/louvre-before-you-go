// Content check: `npm run check-content`.
// Every `next` exists, every node is reachable, 5 questions per level,
// 2–3 choices per question, sources not empty, word budgets (warnings),
// and whether each artwork's image file is in public/.
// Runs with plain Node (type stripping), no extra packages.

import fs from "node:fs";
import path from "node:path";
import { sortContentFiles, validateContent } from "../src/lib/validate.ts";

const root = process.cwd();
const contentDir = path.join(root, "content");
const files = sortContentFiles(fs.readdirSync(contentDir));

let errors = 0;
let warnings = 0;
const ids = new Set<string>();

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
  const d = data as { artwork?: { image?: string }; lessons?: { id: string }[] };
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

console.log(`\n${files.length} files, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
