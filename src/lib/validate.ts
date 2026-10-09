// Content checks shared by the build (src/lib/content.ts) and
// `npm run check-content` (scripts/check-content.ts).
// Keep this file free of runtime imports so Node can run it directly.

import type { Correction, ContentFile, LessonNode, Voice as LessonNodeVoice } from "./types";

export const QUESTIONS_PER_LEVEL = 5;
export const WORD_LIMITS = { story: 45, branch: 40, question: 15 } as const;
export const VOICE_WORD_LIMITS = { imagined: 25, quote: 30 } as const;
export const CORRECTION_WORD_LIMITS = { verdict: 6, tempting: 30, truth: 35, evidence: 35 } as const;
const CORRECTION_KINDS = ["near-miss", "myth"];
const SPEAKER_KINDS = ["artist", "artwork", "person"];

export type Report = { errors: string[]; warnings: string[] };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Checks one parsed content file. `file` is only used in messages. */
export function validateContent(data: unknown, file: string): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const err = (m: string) => errors.push(`${file}: ${m}`);
  const warn = (m: string) => warnings.push(`${file}: ${m}`);

  const d = data as Partial<ContentFile>;
  if (!d || typeof d !== "object") {
    err("not a JSON object");
    return { errors, warnings };
  }
  for (const k of ["id", "name", "city"] as const) {
    if (!isNonEmptyString(d.museum?.[k])) err(`museum.${k} is missing`);
  }
  for (const k of ["id", "title", "artist", "year", "image", "imageCredit"] as const) {
    if (!isNonEmptyString(d.artwork?.[k])) err(`artwork.${k} is missing`);
  }
  for (const k of ["medium", "dimensions", "museumUrl"] as const) {
    const v = d.artwork?.[k];
    if (v !== undefined && typeof v !== "string") err(`artwork.${k} must be a string`);
  }
  // Optional speakers map.
  const speakers = d.speakers ?? {};
  if (d.speakers !== undefined && (typeof d.speakers !== "object" || Array.isArray(d.speakers))) {
    err("speakers must be an object keyed by speaker id");
  } else {
    for (const [id, sp] of Object.entries(speakers)) {
      if (!isNonEmptyString(sp?.name)) err(`speakers.${id}.name is missing`);
      if (!isNonEmptyString(sp?.avatar)) err(`speakers.${id}.avatar is missing`);
      if (!SPEAKER_KINDS.includes(sp?.kind)) err(`speakers.${id}.kind must be one of ${SPEAKER_KINDS.join(", ")}`);
    }
  }

  if (!Array.isArray(d.lessons) || d.lessons.length === 0) {
    err("lessons must be a non-empty array");
    return { errors, warnings };
  }

  d.lessons.forEach((lesson, li) => {
    const where = `lesson ${lesson?.id ?? li}`;
    if (!isNonEmptyString(lesson?.id)) err(`${where}: id is missing`);
    if (!isNonEmptyString(lesson?.title)) err(`${where}: title is missing`);
    if (typeof lesson?.order !== "number") err(`${where}: order must be a number`);
    if (!isNonEmptyString(lesson?.takeaway)) err(`${where}: takeaway is missing`);
    if (!Array.isArray(lesson?.sources) || lesson.sources.filter(isNonEmptyString).length === 0) {
      err(`${where}: sources must not be empty`);
    }
    if (lesson?.narrator !== undefined && !(lesson.narrator in speakers)) {
      err(`${where}: narrator "${lesson.narrator}" is not in speakers`);
    }
    const nodes = lesson?.nodes;
    if (!nodes || typeof nodes !== "object") {
      err(`${where}: nodes is missing`);
      return;
    }
    if (!isNonEmptyString(lesson.start) || !(lesson.start in nodes)) {
      err(`${where}: start "${lesson.start}" is not a node`);
      return;
    }

    let questions = 0;
    let ends = 0;
    for (const [id, raw] of Object.entries(nodes)) {
      const node = raw as LessonNode;
      const at = `${where}, node ${id}`;
      if (!["story", "question", "branch"].includes(node?.type)) {
        err(`${at}: unknown type "${(node as { type?: string })?.type}"`);
        continue;
      }
      if (!isNonEmptyString(node.text)) err(`${at}: text is missing`);
      const voice = (node as { voice?: unknown }).voice as LessonNodeVoice | undefined;
      if (voice !== undefined) {
        if (node.type === "question") warn(`${at}: voice on a question is ignored`);
        if (!isNonEmptyString(voice?.speaker) || !(voice.speaker in speakers)) {
          err(`${at}: voice.speaker "${voice?.speaker}" is not in speakers`);
        }
        if (!isNonEmptyString(voice?.text)) err(`${at}: voice.text is missing`);
        if (voice?.kind !== "imagined" && voice?.kind !== "quote") {
          err(`${at}: voice.kind must be "imagined" or "quote"`);
        } else {
          if (isNonEmptyString(voice.text) && words(voice.text) > VOICE_WORD_LIMITS[voice.kind]) {
            warn(`${at}: voice has ${words(voice.text)} words (limit ${VOICE_WORD_LIMITS[voice.kind]})`);
          }
          if (voice.kind === "quote") {
            if (!isNonEmptyString(voice.cite)) err(`${at}: a quote needs voice.cite`);
            if (!isNonEmptyString(voice.source)) err(`${at}: a quote needs voice.source`);
            else if (!lesson.sources?.includes(voice.source)) err(`${at}: quote source is not in the level's sources`);
          }
        }
      }
      const correction = (node as { correction?: unknown }).correction as Correction | undefined;
      if (correction !== undefined) {
        if (node.type !== "branch") warn(`${at}: correction only shows on a branch`);
        if (!correction || typeof correction !== "object") {
          err(`${at}: correction must be an object`);
        } else {
          for (const k of ["tempting", "truth", "evidence"] as const) {
            if (!isNonEmptyString(correction[k])) err(`${at}: correction.${k} is missing`);
          }
          if (correction.verdict !== undefined && !isNonEmptyString(correction.verdict)) {
            err(`${at}: correction.verdict must be a non-empty string`);
          }
          if (correction.kind !== undefined && !CORRECTION_KINDS.includes(correction.kind)) {
            err(`${at}: correction.kind must be one of ${CORRECTION_KINDS.join(", ")}`);
          }
          for (const k of ["verdict", "tempting", "truth", "evidence"] as const) {
            const v = correction[k];
            if (isNonEmptyString(v) && words(v) > CORRECTION_WORD_LIMITS[k]) {
              warn(`${at}: correction.${k} has ${words(v)} words (limit ${CORRECTION_WORD_LIMITS[k]})`);
            }
          }
        }
      }
      const limit = WORD_LIMITS[node.type];
      if (isNonEmptyString(node.text) && words(node.text) > limit) {
        warn(`${at}: ${words(node.text)} words (limit ${limit})`);
      }
      if (node.type === "question") {
        questions++;
        if (!Array.isArray(node.choices) || node.choices.length < 2 || node.choices.length > 3) {
          err(`${at}: needs 2–3 choices`);
          continue;
        }
        const hasRight = node.choices.some((c) => c?.correct === true);
        node.choices.forEach((c, ci) => {
          if (!isNonEmptyString(c?.label)) err(`${at}: choice ${ci + 1} has no label`);
          if (!(c?.next in nodes)) {
            err(`${at}: choice ${ci + 1} next "${c?.next}" is not a node`);
            return;
          }
          // A wrong pick should be corrected; a right pick needs no correction.
          const target = nodes[c.next] as { correction?: unknown };
          if (hasRight && c.correct !== true && target.correction === undefined) {
            warn(`${at}: wrong choice ${ci + 1} ("${c.label}") leads to a branch with no correction`);
          }
          if (c.correct === true && target.correction !== undefined) {
            warn(`${at}: right choice ${ci + 1} leads to a branch with a correction`);
          }
        });
      } else if (node.next === undefined) {
        ends++;
      } else if (!(node.next in nodes)) {
        err(`${at}: next "${node.next}" is not a node`);
      }
    }
    if (questions !== QUESTIONS_PER_LEVEL) {
      err(`${where}: has ${questions} questions, expected ${QUESTIONS_PER_LEVEL}`);
    }
    if (ends === 0) err(`${where}: no end node (a story or branch without "next")`);

    // Every node reachable from start.
    const seen = new Set<string>();
    const stack = [lesson.start];
    while (stack.length) {
      const id = stack.pop()!;
      if (seen.has(id) || !(id in nodes)) continue;
      seen.add(id);
      const n = nodes[id] as LessonNode;
      if (n.type === "question") n.choices?.forEach((c) => stack.push(c.next));
      else if (n.next) stack.push(n.next);
    }
    for (const id of Object.keys(nodes)) {
      if (!seen.has(id)) warn(`${where}: node ${id} is never reached`);
    }
  });

  return { errors, warnings };
}

/** Filenames picked up as content: a number prefix, then a name, then .json. */
export const CONTENT_FILE = /^(\d+)-.+\.json$/;

export function sortContentFiles(files: string[]): string[] {
  return files
    .filter((f) => CONTENT_FILE.test(f))
    .sort((a, b) => Number(a.match(CONTENT_FILE)![1]) - Number(b.match(CONTENT_FILE)![1]) || a.localeCompare(b));
}
