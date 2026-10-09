// Fetch the artwork photos from Wikimedia Commons: `node scripts/fetch-images.mjs`.
// Runs in GitHub Actions (.github/workflows/fetch-images.yml), because the
// build environment cannot reach Wikimedia.
//
// Reads scripts/image-sources.json:
//   images:     [{ id, dest, file }]  downloaded to dest (a path under public/)
//   candidates: ["File:..."]          metadata printed only, to choose a file
//   categories: ["Category:..."]      files listed with size and licence
//   previews:   ["File:..."]          250px copies printed to the log
// Writes scripts/image-credits.json with author, licence and source page of
// every downloaded file. Refuses any file whose licence is not Public
// Domain, CC0, CC BY or CC BY-SA.

import fs from "node:fs";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const UA =
  "LouvreBeforeYouGo-ImageFetch/1.0 (https://github.com/LeslyLou0457/louvre-before-you-go; GitHub Actions) node-fetch";
const ALLOWED = /^(public domain|pd\b|cc0|cc by(-sa)? \d)/i;

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "scripts/image-sources.json"), "utf8"));

const strip = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    if (attempt >= 3) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    await new Promise((r) => setTimeout(r, 5000 * attempt));
  }
}

const META = "Artist|Credit|LicenseShortName|LicenseUrl|UsageTerms|Copyrighted|DateTimeOriginal|ImageDescription|ObjectName";

async function info(file, thumbWidth) {
  const params = {
    action: "query",
    titles: file,
    redirects: "1",
    prop: "imageinfo",
    iiprop: "url|size|mime|sha1|extmetadata",
    iiextmetadatafilter: META,
  };
  if (thumbWidth) params.iiurlwidth = String(thumbWidth);
  const data = await api(params);
  const page = data.query.pages[0];
  if (page.missing || !page.imageinfo) throw new Error(`${file}: missing on Commons`);
  const ii = page.imageinfo[0];
  const m = ii.extmetadata ?? {};
  const v = (k) => strip(m[k]?.value);
  return {
    title: page.title,
    width: ii.width,
    height: ii.height,
    bytes: ii.size,
    mime: ii.mime,
    page: ii.descriptionurl,
    original: ii.url,
    thumb: ii.thumburl,
    thumbWidth: ii.thumbwidth,
    thumbHeight: ii.thumbheight,
    author: v("Artist"),
    credit: v("Credit"),
    licence: v("LicenseShortName"),
    licenceUrl: m.LicenseUrl?.value ?? "",
    usageTerms: v("UsageTerms"),
    copyrighted: v("Copyrighted"),
    date: v("DateTimeOriginal"),
    description: v("ImageDescription").slice(0, 400),
  };
}

function print(i) {
  console.log(`\n== ${i.title}`);
  console.log(`   page:        ${i.page}`);
  console.log(`   size:        ${i.width}x${i.height}, ${Math.round(i.bytes / 1024)} KB, ${i.mime}`);
  console.log(`   author:      ${i.author}`);
  console.log(`   credit:      ${i.credit}`);
  console.log(`   licence:     ${i.licence} | ${i.licenceUrl} | ${i.usageTerms} | copyrighted=${i.copyrighted}`);
  console.log(`   date:        ${i.date}`);
  console.log(`   description: ${i.description}`);
}

// Small previews printed into the job log as base64 (lines "B64 <n> ..."),
// so files can be looked at before choosing, without committing them.
const toPreview = [...(config.previews ?? [])];

async function preview(n, file) {
  const i = await info(file, 250);
  const res = await fetch(i.thumb ?? i.original, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} downloading preview`);
  const b64 = Buffer.from(await res.arrayBuffer()).toString("base64");
  console.log(`PREVIEW ${n} ${i.width}x${i.height} ${i.licence} | ${i.title}`);
  for (let k = 0; k < b64.length; k += 3000) console.log(`B64 ${n} ${b64.slice(k, k + 3000)}`);
}

async function listCategory(category, depth, previewMinEdge) {
  let cont = {};
  const subcats = [];
  console.log(`\n#### ${category}`);
  do {
    const data = await api({
      action: "query",
      generator: "categorymembers",
      gcmtitle: category,
      gcmtype: "file|subcat",
      gcmlimit: "100",
      prop: "imageinfo",
      iiprop: "size|extmetadata",
      iiextmetadatafilter: "LicenseShortName|Artist",
      ...cont,
    });
    for (const p of data.query?.pages ?? []) {
      if (p.ns === 14) {
        if (!subcats.includes(p.title)) subcats.push(p.title);
        continue;
      }
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const lic = strip(ii.extmetadata?.LicenseShortName?.value);
      const who = strip(ii.extmetadata?.Artist?.value).slice(0, 60);
      console.log(`${ii.width}x${ii.height}\t${lic}\t${who}\t${p.title}`);
      const free = /^(public domain|cc0)/i.test(lic);
      if (previewMinEdge && free && Math.max(ii.width, ii.height) >= previewMinEdge && !toPreview.includes(p.title)) {
        toPreview.push(p.title);
      }
    }
    cont = data.continue ?? null;
  } while (cont);
  if (depth > 0) for (const s of subcats) await listCategory(s, depth - 1, previewMinEdge);
  else if (subcats.length) console.log(`   (subcategories not listed: ${subcats.join(" | ")})`);
}

for (const file of config.candidates ?? []) {
  try {
    print(await info(file));
  } catch (e) {
    console.log(`\n== ${file}: ${e.message}`);
  }
}

for (const c of config.categories ?? []) await listCategory(c.title ?? c, c.depth ?? 0, c.previewMinEdge);

for (const [n, file] of toPreview.entries()) {
  try {
    await preview(n + 1, file);
  } catch (e) {
    console.log(`PREVIEW ${n + 1} FAILED ${file}: ${e.message}`);
  }
}

const credits = {};
let failed = 0;
for (const img of config.images ?? []) {
  try {
    const first = await info(img.file);
    // Standard Wikimedia thumbnail widths; the long edge ends up near 2000 px.
    const width = first.width >= first.height ? 1920 : 1280;
    const i = width < first.width ? await info(img.file, width) : first;
    print(i);
    if (!ALLOWED.test(i.licence)) throw new Error(`licence "${i.licence}" is not allowed`);
    const src = i.thumb && i.thumbWidth < i.width ? i.thumb : i.original;
    const res = await fetch(src, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`${res.status} downloading ${src}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(root, img.dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    console.log(`   saved:       ${img.dest} (${Math.round(buf.length / 1024)} KB from ${src})`);
    credits[img.id] = {
      file: i.title,
      page: i.page,
      author: i.author,
      credit: i.credit,
      licence: i.licence,
      licenceUrl: i.licenceUrl,
      original: `${i.width}x${i.height}`,
      downloaded: src,
      dest: img.dest,
    };
  } catch (e) {
    console.log(`\nERROR ${img.id}: ${e.message}`);
    failed++;
  }
}

if (config.images?.length) {
  fs.writeFileSync(path.join(root, "scripts/image-credits.json"), JSON.stringify(credits, null, 2) + "\n");
}
if (failed) process.exit(1);
