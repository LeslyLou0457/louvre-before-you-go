// Record recheck: `npm run recheck-records` (optionally `-- --out <file>`).
// Read-only. For every work in content/modules.json with a collections.louvre.fr
// record, fetches the record's JSON (<ark url>.json), one request per second,
// and compares what we store (room, display status, inventory number, date,
// and for works with a level the dimensions and image credit) with the live
// record, plus the record's last-modified date against our `checkedOn`.
// Prints a Markdown report and writes it to scratch/ (git-ignored) or --out.
// It never writes to content/. Runs with plain Node (type stripping), no
// extra packages. Metadata: Musée du Louvre, Etalab Open Licence 2.0.

import fs from "node:fs";
import path from "node:path";

const REPO_URL = "https://github.com/LeslyLou0457/louvre-before-you-go";
const USER_AGENT = `louvre-before-you-go-record-recheck/1.0 (+${REPO_URL})`;
const GAP_MS = 1000; // at most one request per second
const TIMEOUT_MS = 20000;

type Location = { wing: string; floor: number; room: string | null; roomName?: string; place?: string } | null;
type Work = {
  id: string; title: string; date: string; inventory: string;
  location: Location; display: string; displayNote?: string; checkedOn: string;
  museumUrl: string | null; levelId?: string;
};
type Catalogue = { modules: { id: string; works: Work[] }[]; appendix: { id: string; works: Work[] } };
type Artwork = { id: string; dimensions?: string; imageCredit?: string };
type LouvreRecord = {
  arkId?: string;
  [key: string]: unknown;
};
type Match = "yes" | "NO" | "check" | "info" | "OK (known exception)";
type Row = { id: string; work: string; field: string; ours: string; louvre: string; match: Match };

/**
 * Known exceptions: a "NO" that a person has already checked and found right.
 * Keyed by work id and field; applies only while our value is still `ours`.
 */
const KNOWN_EXCEPTIONS: { work: string; field: string; ours: string; note: string }[] = [
  {
    work: "virgin-and-child-with-saint-anne",
    field: "dimensions",
    ours: "168 × 130 cm",
    note: "The record page notes the panel was enlarged later: 1.13 m wide originally, 1.3 m today (\"agrandi plus tard : 1,3m actuellement\"; not in the JSON). Our 130 cm is the present width.",
  },
];

const root = process.cwd();
const contentDir = path.join(root, "content");
const today = new Date().toISOString().slice(0, 10);

const outArg = process.argv.indexOf("--out");
const outFile = outArg > -1 && process.argv[outArg + 1]
  ? path.resolve(process.argv[outArg + 1])
  : path.join(root, "scratch", `record-recheck-${today}.md`);
if (path.resolve(outFile).startsWith(contentDir + path.sep)) {
  console.error("Refusing to write the report inside content/.");
  process.exit(1);
}

const catalogue = JSON.parse(fs.readFileSync(path.join(contentDir, "modules.json"), "utf8")) as Catalogue;
const works: { chapter: string; work: Work }[] = [
  ...catalogue.modules.flatMap((m) => m.works.map((work) => ({ chapter: m.id, work }))),
  ...catalogue.appendix.works.map((work) => ({ chapter: "appendix", work })),
];

// Level files: artwork id -> artwork (dimensions, image credit).
const artworks = new Map<string, Artwork>();
for (const f of fs.readdirSync(contentDir)) {
  if (!f.endsWith(".json") || f === "modules.json") continue;
  try {
    const a = (JSON.parse(fs.readFileSync(path.join(contentDir, f), "utf8")) as { artwork?: Artwork }).artwork;
    if (a?.id) artworks.set(a.id, a);
  } catch {
    // check-content reports broken files; the recheck just skips them.
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const md = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim() || "—";
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** The ark id from a museumUrl such as https://collections.louvre.fr/en/ark:/53355/cl010062370. */
function arkId(url: string | null): string | null {
  const m = url?.match(/collections\.louvre\.fr\/(?:[a-z]{2}\/)?ark:\/53355\/([a-z0-9]+)/i);
  return m ? m[1] : null;
}

let lastRequest = 0;
async function fetchRecord(id: string): Promise<{ record?: LouvreRecord; error?: string }> {
  const url = `https://collections.louvre.fr/ark:/53355/${id}.json`;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const wait = lastRequest + GAP_MS * attempt - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.status === 404) return { error: "HTTP 404 (no record at this ark id)" };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { record: (await res.json()) as LouvreRecord };
    } catch (e) {
      const msg = (e as Error).name === "TimeoutError" ? `timed out after ${TIMEOUT_MS / 1000} s` : (e as Error).message;
      if (attempt === 2) return { error: msg };
    }
  }
  return { error: "unreachable" };
}

/** The record's last-modified date; the live JSON spells the key "modified " (trailing space). */
function modified(r: LouvreRecord): string {
  const key = Object.keys(r).find((k) => k.trim() === "modified");
  return key ? str(r[key]) : "";
}

/** What the record says about display, from currentLocation, room and longTermLoanTo. */
function recordDisplay(r: LouvreRecord): { status: string; words: string } {
  const loc = str(r.currentLocation);
  const room = str(r.room);
  const loan = str(r.longTermLoanTo);
  const words = [loc && `currentLocation "${loc}"`, room && `room "${room}"`, loan && `longTermLoanTo "${loan}"`]
    .filter(Boolean).join("; ") || "not in record";
  if (/non expos/i.test(loc)) return { status: "not-on-display", words };
  // longTermLoanTo sometimes names the Louvre's own department: not a loan.
  if (loan && !/mus[ée]e du louvre/i.test(loan)) return { status: "on-loan", words };
  if (room) return { status: /acc[èe]s r[ée]serv/i.test(loc + " " + room) ? "restricted" : "on-display", words };
  // No room: a store ("Réserve des pastels", "Petit format horizontal") or a place outside the Louvre.
  if (/r[ée]serve|format|encadr/i.test(loc)) return { status: "in store", words };
  if (loc && !/^(denon|sully|richelieu|napol[ée]on)\b/i.test(loc)) return { status: "on-loan", words };
  if (loc) return { status: "on-display", words };
  return { status: "not in record", words };
}

function compareDisplay(ours: string, live: string): Match {
  if (live === "not in record") return ours === "tbd" || ours === "appointment-only" ? "check" : "NO";
  if (live === "in store") return ours === "appointment-only" ? "check" : ours === "not-on-display" ? "yes" : "NO";
  if (ours === live) return "yes";
  // The record has no field for these: a person decides from its words.
  if (ours === "room-closed" || ours === "appointment-only" || ours === "tbd") return "check";
  if (ours === "restricted" && live === "on-display") return "check";
  return "NO";
}

function oursRoom(w: Work): string {
  const l = w.location;
  if (!l) return "no location";
  return `${l.wing}, floor ${l.floor}, ${l.room ? `room ${l.room}` : l.place ?? "no room"}`;
}

function compareRoom(w: Work, r: LouvreRecord): Match {
  const live = str(r.room).match(/^Salle\s+(\d+)/i)?.[1] ?? null;
  const ours = w.location?.room ?? null;
  if (ours && live) {
    if (ours !== live) return "NO";
    const wing = str(r.room).match(/Aile\s+(?:Aile\s+)?(\w+)/i)?.[1];
    const floor = str(r.room).match(/Niveau\s+(-?\d+)/i)?.[1];
    if (wing && w.location && norm(wing) !== norm(w.location.wing)) return "NO";
    if (floor && w.location && Number(floor) !== w.location.floor) return "NO";
    return "yes";
  }
  if (!ours && !live) {
    const place = w.location?.place;
    if (!place) return "yes";
    return norm(str(r.room)).startsWith(norm(place)) ? "yes" : "check";
  }
  if (!ours && live) return "NO";
  return "NO"; // we have a room, the record has none
}

function compareInventory(ours: string, r: LouvreRecord): { live: string; match: Match } {
  const nums = Array.isArray(r.objectNumber) ? (r.objectNumber as { value?: string; type?: string }[]) : [];
  const live = nums.map((n) => `${n.value ?? ""}${n.type ? ` (${n.type})` : ""}`).join("; ");
  if (!nums.some((n) => n.value)) return { live: "not in record", match: "check" };
  // Ours leads with the number the label uses: the main number, or for
  // antiquities the catalogue number ("Ma 399"). ", Recto" is a sheet side.
  const o = norm(ours);
  const hit = nums.some((n) => {
    const m = norm((n.value ?? "").replace(/,\s*(recto|verso)$/i, ""));
    return m !== "" && (o === m || o.startsWith(m + " ") || o.startsWith(m + "("));
  });
  return { live, match: hit ? "yes" : "NO" };
}

/** Years named in a date string; BC years are negative. */
function years(s: string): number[] {
  const out: number[] = [];
  const bc = /\bBC\b/.test(s);
  for (const m of s.matchAll(/\b(\d{3,4}|\d{2}(?= ?(?:BC|AD)))\b/g)) out.push(bc ? -Number(m[1]) : Number(m[1]));
  return out;
}

function compareDate(ours: string, r: LouvreRecord): { live: string; match: Match } {
  const live = str(r.displayDateCreated) || "not in record";
  const dc = Array.isArray(r.dateCreated) ? (r.dateCreated as { startYear?: number; endYear?: number }[]) : [];
  const first = dc.find((d) => typeof d.startYear === "number");
  if (!first) return { live, match: "check" };
  if (ours.includes(";")) return { live, match: "check" }; // several dates (vase; mount)
  const ys = years(ours.replace(/\(AH [^)]*\)/g, ""));
  if (ys.length === 0) return { live, match: "check" };
  const start = first.startYear!;
  const end = typeof first.endYear === "number" ? first.endYear : start;
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  if (lo === Math.min(start, end) && hi === Math.max(start, end)) return { live, match: "yes" };
  // Ours is narrower than the record's span (often a century): a person decides.
  if (lo >= Math.min(start, end) && hi <= Math.max(start, end)) return { live, match: "check" };
  // Centuries, "c.", "(record: …)" and similar are judged by a person.
  return { live, match: /century|record:|TBD|\?|BC.*AD/i.test(ours) ? "check" : "NO" };
}

function compareDimensions(ours: string | undefined, r: LouvreRecord): { live: string; match: Match } {
  const dims = Array.isArray(r.dimension) ? (r.dimension as { type?: string; value?: string; unit?: string; displayDimension?: string }[]) : [];
  const live = dims.map((d) => `${d.type}: ${d.displayDimension ?? d.value}`).join("; ") || "not in record";
  if (!ours) return { live, match: "info" };
  const toCm = (v: string, unit: string) => {
    const n = Number(v.replace(",", "."));
    return unit === "m" ? n * 100 : unit === "mm" ? n / 10 : n;
  };
  const plain = dims.filter((d) => /^(Hauteur|Largeur|Longueur|Profondeur)$/i.test(d.type ?? "") && d.value);
  if (plain.length === 0) return { live, match: "check" };
  const liveCm = plain.map((d) => toCm(d.value!, d.unit ?? "m"));
  const oursCm = [...ours.matchAll(/(\d+(?:[.,]\d+)?)/g)].map((m) => Number(m[1].replace(",", ".")) * (/\bm\b/.test(ours) && !/cm/.test(ours) ? 100 : 1));
  const ok = oursCm.length > 0 && oursCm.every((o) => liveCm.some((l) => Math.abs(l - o) < 0.051));
  return { live, match: ok ? "yes" : "NO" };
}

async function main() {
  const rows: Row[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];
  const changedSince: string[] = [];
  const mods: string[] = [];
  let checked = 0;
  const live = works.filter(({ work }) => work.levelId);

  for (const [i, { chapter, work: w }] of works.entries()) {
    const id = arkId(w.museumUrl);
    const label = `${w.title}${w.levelId ? " (level)" : ""}`;
    if (!id) {
      skipped.push(`${w.title} (${chapter}): no Louvre record (${w.inventory})`);
      continue;
    }
    process.stderr.write(`[${i + 1}/${works.length}] ${w.id} … `);
    const { record: r, error } = await fetchRecord(id);
    if (!r) {
      process.stderr.write(`failed: ${error}\n`);
      failed.push(`${w.title} (${id}): ${error}`);
      continue;
    }
    process.stderr.write("ok\n");
    checked++;
    const mod = modified(r);
    if (mod) mods.push(mod);
    const disp = recordDisplay(r);
    const inv = compareInventory(w.inventory, r);
    const date = compareDate(w.date, r);
    const art = artworks.get(w.id);
    rows.push({ id: w.id, work: label, field: "room", ours: oursRoom(w), louvre: str(r.room) || "not in record", match: compareRoom(w, r) });
    rows.push({ id: w.id, work: label, field: "display", ours: w.display + (w.displayNote ? ` (${w.displayNote})` : ""), louvre: disp.words, match: compareDisplay(w.display, disp.status) });
    rows.push({ id: w.id, work: label, field: "inventory", ours: w.inventory, louvre: inv.live, match: inv.match });
    rows.push({ id: w.id, work: label, field: "date", ours: w.date, louvre: date.live, match: date.match });
    if (art) {
      const dim = compareDimensions(art.dimensions, r);
      rows.push({ id: w.id, work: label, field: "dimensions", ours: art.dimensions ?? "—", louvre: dim.live, match: dim.match });
      const imgs = Array.isArray(r.image) ? (r.image as { copyright?: string }[]) : [];
      // Our photos come from Wikimedia Commons, not the Louvre's own images: shown for reference only.
      rows.push({ id: w.id, work: label, field: "image credit", ours: art.imageCredit ?? "—", louvre: imgs[0]?.copyright ?? "not in record", match: "info" });
    }
    const changed = mod && mod > w.checkedOn;
    if (changed) changedSince.push(`${w.title}: record modified ${mod}, we checked ${w.checkedOn}`);
    rows.push({ id: w.id, work: label, field: "record modified", ours: `checkedOn ${w.checkedOn}`, louvre: mod || "not in record", match: changed ? "check" : "yes" });
  }

  for (const r of rows) {
    if (r.match !== "NO") continue;
    const x = KNOWN_EXCEPTIONS.find((e) => e.work === r.id && e.field === r.field && e.ours === r.ours);
    if (x) {
      r.match = "OK (known exception)";
      r.louvre += ` · Known exception: ${x.note}`;
    }
  }
  const known = rows.filter((r) => r.match === "OK (known exception)");
  const no = rows.filter((r) => r.match === "NO");
  const toCheck = rows.filter((r) => r.match === "check");
  const byField = new Map<string, number>();
  for (const r of no) byField.set(r.field, (byField.get(r.field) ?? 0) + 1);
  const liveNames = new Set(live.map(({ work }) => `${work.title} (level)`));
  const liveHit = [...new Set(no.filter((r) => liveNames.has(r.work)).map((r) => `${r.work}: ${r.field}`))];
  const table = (list: Row[]) => [
    "| Work | Field | Ours | Louvre | Match? |",
    "|---|---|---|---|---|",
    ...list.map((r) => `| ${md(r.work)} | ${r.field} | ${md(r.ours)} | ${md(r.louvre)} | ${r.match} |`),
  ];

  const lines = [
    `# Record recheck, ${today}`,
    "",
    `Source: collections.louvre.fr record JSON (\`<ark url>.json\`), fetched ${today}, one request per second. Metadata © Musée du Louvre, reused under the Etalab Open Licence 2.0; records last updated ${mods.length ? `${mods.sort()[0]} to ${mods[mods.length - 1]}` : "(no dates in the records)"}; each record's own update date is in its "record modified" row. Read-only: this report changes nothing in \`content/\`.`,
    "",
    `Generated by \`npm run recheck-records\` (${REPO_URL}).`,
    "",
    "## Summary",
    "",
    `- Works in the catalogue: ${works.length}; records checked: ${checked}; skipped (no Louvre record): ${skipped.length}; failed to fetch: ${failed.length}.`,
    `- Mismatches ("NO"): **${no.length}**${no.length ? ` (${[...byField].map(([f, n]) => `${f} ${n}`).join(", ")})` : ""}.`,
    `- Known exceptions (a person checked these and our value is right): ${known.length}${known.length ? ` (${known.map((r) => `${r.work}: ${r.field}`).join("; ")})` : ""}.`,
    `- For a person to judge ("check"): ${toCheck.length}, of which ${changedSince.length} are records modified after our \`checkedOn\`.`,
    `- Works with a level (${live.length}) with a mismatch: ${liveHit.length ? liveHit.join("; ") : "none"}.`,
    "",
    "How to read it: \"yes\" agrees; \"NO\" disagrees; \"check\" the record can't settle it automatically (a status the record has no field for, a century or approximate date, a spot without a room number, or a record changed since we checked); \"OK (known exception)\" disagrees with the record JSON, but a person checked it and our value is right (the reason is in the row); \"info\" is shown for reference (our photos are from Wikimedia Commons, so their credit is not the Louvre's). The record has no on-display field: display is read from `currentLocation` (\"non exposé\"), `room` and `longTermLoanTo`. The Louvre warns room data may be out of date.",
    "",
  ];
  if (skipped.length) lines.push("## Skipped", "", ...skipped.map((s) => `- ${s}`), "");
  if (failed.length) lines.push("## Failed to fetch", "", ...failed.map((s) => `- ${s}`), "");
  lines.push("## Mismatches", "", ...(no.length ? table(no) : ["None."]), "");
  if (known.length) lines.push("## Known exceptions", "", ...table(known), "");
  if (changedSince.length) lines.push("## Records modified since our check", "", ...changedSince.map((s) => `- ${s}`), "");
  lines.push("## Full comparison", "", ...table(rows), "");
  const report = lines.join("\n");

  console.log(report);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, report);
  process.stderr.write(`\nReport written to ${outFile}\n`);
}

main().catch((e) => {
  console.error(`Record recheck failed: ${(e as Error).message}`);
  process.exit(1);
});
