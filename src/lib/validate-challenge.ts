// Checks for Close-Up Challenge files (content/challenge/*.json), shared by
// the build (src/lib/challenge.ts) and `npm run check-content`.
// PRODUCT.md "Close-Up Challenge" and "Challenge files" are the spec.
// Keep this file free of runtime imports other than ./rotation.ts so Node can
// run it directly.

import type { BranchNode, ChallengeFile, LessonNode, QuestionNode, StoryNode, Zoom } from "./types";
import { allRounds, TIME_MODEL } from "./rotation.ts";

export const CHALLENGE_WORD_CAPS = {
  title: 8,
  intro: 30,
  question: 12,
  option: 7,
  optionsTotal: 15,
  rightBranch: 30,
  wrongBranch: 15,
  verdict: 6,
  tempting: 20,
  truth: 25,
  evidence: 25,
  merge: 18,
} as const;

export type BaseInfo = {
  file: string;
  /** Node ids of the artwork's level. */
  nodeIds: Set<string>;
  speakers: Record<string, unknown>;
};

export type RoundTime = { play: number; pair: string[]; right: number; worst: number };

export type ChallengeReport = { errors: string[]; warnings: string[]; times: RoundTime[] };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const EPS = 1e-9;

type Question = {
  start: string;
  intro: StoryNode;
  question: QuestionNode;
  merge: StoryNode;
  rightSeconds: number;
  worstSeconds: number;
};

/**
 * Checks one parsed challenge file. `base` maps artwork ids to their level
 * file; `exists` says whether a path under public/ exists.
 */
export function validateChallenge(
  data: unknown,
  file: string,
  base: Map<string, BaseInfo>,
  exists: (publicPath: string) => boolean,
): ChallengeReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const times: RoundTime[] = [];
  const err = (m: string) => errors.push(`${file}: ${m}`);
  const warn = (m: string) => warnings.push(`${file}: ${m}`);
  const cap = (at: string, text: unknown, limit: number) => {
    if (isText(text) && words(text) > limit) err(`${at}: ${words(text)} words (cap ${limit})`);
  };

  const d = data as Partial<ChallengeFile>;
  if (!d || typeof d !== "object") {
    err("not a JSON object");
    return { errors, warnings, times };
  }
  const baseInfo = isText(d.artworkId) ? base.get(d.artworkId) : undefined;
  if (!baseInfo) err(`artworkId "${d.artworkId}" is not the artwork.id of any level file`);

  const zi = d.zoomImage;
  if (!zi || typeof zi !== "object") err("zoomImage is missing");
  else {
    for (const k of ["file", "commons", "licence", "credit", "overview"] as const) {
      if (!isText(zi[k])) err(`zoomImage.${k} is missing`);
    }
    for (const k of ["width", "height"] as const) {
      if (typeof zi[k] !== "number" || !(zi[k] > 0)) err(`zoomImage.${k} must be a positive number of pixels`);
    }
    if (isText(zi.overview) && !exists(zi.overview)) err(`zoomImage.overview ${zi.overview} is not in public/`);
  }

  const review = (d.review ?? {}) as Record<string, Record<string, unknown>>;
  if (!d.review || typeof d.review !== "object") err("review is missing");

  if (!Array.isArray(d.lessons) || d.lessons.length !== 1) {
    err("lessons must hold exactly one round");
    return { errors, warnings, times };
  }

  for (const lesson of d.lessons) {
    const where = `round ${lesson?.id ?? "?"}`;
    if (!isText(lesson?.id)) err(`${where}: id is missing`);
    if (lesson?.kind !== "challenge") err(`${where}: kind must be "challenge"`);
    if (lesson?.unlock !== "all-base-levels") err(`${where}: unlock must be "all-base-levels"`);
    if (lesson?.roundSize !== 2) err(`${where}: roundSize must be 2`);
    if (typeof lesson?.order !== "number") err(`${where}: order must be a number`);
    if (!isText(lesson?.title)) err(`${where}: title is missing`);
    cap(`${where}: title`, lesson?.title, CHALLENGE_WORD_CAPS.title);
    if (lesson?.narrator !== undefined && baseInfo && !(lesson.narrator in baseInfo.speakers)) {
      err(`${where}: narrator "${lesson.narrator}" is not in the level file's speakers`);
    }
    const nodes = (lesson?.nodes ?? {}) as Record<string, LessonNode>;
    if (!lesson?.nodes || typeof lesson.nodes !== "object") {
      err(`${where}: nodes is missing`);
      continue;
    }
    const pool = Array.isArray(lesson.pool) ? lesson.pool : [];
    if (pool.length < (lesson.roundSize ?? 2)) err(`${where}: pool needs at least ${lesson.roundSize ?? 2} questions`);
    const held = Array.isArray(lesson.held) ? lesson.held : [];
    if (lesson.held !== undefined && !Array.isArray(lesson.held)) err(`${where}: held must be an array`);
    const starts = [...pool, ...held.map((h) => h?.start)];
    if (new Set(starts).size !== starts.length) err(`${where}: a question is listed twice in pool/held`);
    held.forEach((h, i) => {
      if (!isText(h?.start)) err(`${where}: held[${i}].start is missing`);
      if (!isText(h?.why)) err(`${where}: held[${i}].why is missing (say why it can't ship)`);
    });

    const used = new Set<string>();
    const questions = new Map<string, Question>();

    for (const start of starts) {
      if (!isText(start)) continue;
      const inPool = pool.includes(start);
      const at = `${where}, ${start}`;
      const intro = nodes[start] as StoryNode | undefined;
      const qid = `${start}q`;
      const mid = `${start}m`;
      const q = nodes[qid] as QuestionNode | undefined;
      const merge = nodes[mid] as StoryNode | undefined;
      if (intro?.type !== "story") {
        err(`${at}: intro node ${start} must be a story`);
        continue;
      }
      if (q?.type !== "question") {
        err(`${at}: question node ${qid} is missing`);
        continue;
      }
      if (merge?.type !== "story") {
        err(`${at}: merge node ${mid} is missing`);
        continue;
      }
      used.add(start).add(qid).add(mid);
      if (intro.next !== qid) err(`${at}: intro must lead to ${qid}`);
      if (merge.next !== undefined) err(`${at}: merge line ${mid} must not have "next"`);

      // Texts and caps.
      for (const [id, n] of [[start, intro], [qid, q], [mid, merge]] as const) {
        if (!isText(n.text)) err(`${at}: ${id} text is missing`);
        if ((n as { voice?: unknown }).voice !== undefined) warn(`${at}: ${id} has a voice; the challenge doesn't show voices`);
      }
      cap(`${at}: intro`, intro.text, CHALLENGE_WORD_CAPS.intro);
      cap(`${at}: question`, q.text, CHALLENGE_WORD_CAPS.question);
      cap(`${at}: merge line`, merge.text, CHALLENGE_WORD_CAPS.merge);

      // Zoom: inside the image, the same on intro and question, crop file present.
      checkZoom(`${at}: ${start}.zoom`, intro.zoom, err);
      checkZoom(`${at}: ${qid}.zoom`, q.zoom, err);
      if (intro.zoom && q.zoom && JSON.stringify(intro.zoom) !== JSON.stringify(q.zoom)) {
        err(`${at}: zoom on ${start} and ${qid} must be the same`);
      }
      if (inPool && isText(intro.zoom?.image) && !exists(intro.zoom.image)) {
        err(`${at}: crop ${intro.zoom.image} is not in public/`);
      }

      // Options: 3, one right, two wrong (near-miss, or myth as an approved exception).
      const r = (review[qid] ?? {}) as Record<string, unknown>;
      const choices = Array.isArray(q.choices) ? q.choices : [];
      if (choices.length !== 3) err(`${at}: needs exactly 3 options`);
      const right = choices.filter((c) => c?.correct === true);
      if (right.length !== 1) err(`${at}: needs exactly one right option`);
      let optionWords = 0;
      let rightBranchWords = 0;
      let worstBranchWords = 0;
      choices.forEach((c, ci) => {
        const label = `${at}: option ${ci + 1}`;
        if (!isText(c?.label)) err(`${label} has no label`);
        else {
          optionWords += words(c.label);
          cap(label, c.label, CHALLENGE_WORD_CAPS.option);
        }
        const isRight = c?.correct === true;
        if (isRight && c.role !== "right") err(`${label}: the right option needs role "right"`);
        if (!isRight) {
          if (c?.role === "myth") {
            if (!isText(r.exception)) err(`${label}: role "myth" needs review.${qid}.exception (an approved exception)`);
          } else if (c?.role !== "near-miss") err(`${label}: a wrong option needs role "near-miss"`);
        }
        const b = nodes[c?.next] as BranchNode | undefined;
        if (b?.type !== "branch") {
          err(`${label}: next "${c?.next}" is not a branch node`);
          return;
        }
        used.add(c.next);
        if (b.next !== mid) err(`${label}: branch ${c.next} must lead to the merge line ${mid}`);
        if (!isText(b.text)) err(`${label}: branch ${c.next} text is missing`);
        if (isRight) {
          cap(`${at}: right branch ${c.next}`, b.text, CHALLENGE_WORD_CAPS.rightBranch);
          if (b.correction) err(`${at}: right branch ${c.next} must not have a correction`);
          rightBranchWords = isText(b.text) ? words(b.text) : 0;
        } else {
          cap(`${at}: wrong branch ${c.next}`, b.text, CHALLENGE_WORD_CAPS.wrongBranch);
          const corr = b.correction;
          if (!corr) {
            err(`${at}: wrong branch ${c.next} needs a correction`);
          } else {
            for (const k of ["tempting", "truth", "evidence"] as const) {
              if (!isText(corr[k])) err(`${at}: ${c.next}.correction.${k} is missing`);
              cap(`${at}: ${c.next}.correction.${k}`, corr[k], CHALLENGE_WORD_CAPS[k]);
            }
            if (corr.verdict !== undefined) cap(`${at}: ${c.next}.correction.verdict`, corr.verdict, CHALLENGE_WORD_CAPS.verdict);
            const kind = c.role === "myth" ? "myth" : "near-miss";
            if (corr.kind !== kind) err(`${at}: ${c.next}.correction.kind must be "${kind}" to match the option's role`);
            const w = [b.text, corr.tempting, corr.truth, corr.evidence].reduce((n, t) => n + (isText(t) ? words(t) : 0), 0);
            worstBranchWords = Math.max(worstBranchWords, w);
          }
          // The wrong option's source.
          const cs = (r.choiceSources ?? {}) as Record<string, unknown>;
          const list = cs[c.next];
          if (!Array.isArray(list) || list.length === 0) err(`${at}: review.${qid}.choiceSources.${c.next} is missing`);
          else checkSourceList(`${at}: review.${qid}.choiceSources.${c.next}`, list, err);
        }
      });
      if (optionWords > CHALLENGE_WORD_CAPS.optionsTotal) {
        err(`${at}: options have ${optionWords} words in total (cap ${CHALLENGE_WORD_CAPS.optionsTotal})`);
      }

      // Review: what it extends in the level, and the sources placing the region.
      if (!d.review || !(qid in review)) err(`${at}: review.${qid} is missing`);
      else {
        const ext = r.extends as { nodes?: unknown; concept?: unknown } | undefined;
        if (!ext || !Array.isArray(ext.nodes) || ext.nodes.length === 0) err(`${at}: review.${qid}.extends.nodes is missing`);
        else if (baseInfo) {
          for (const n of ext.nodes) {
            if (typeof n !== "string" || !baseInfo.nodeIds.has(n)) {
              err(`${at}: review.${qid}.extends names "${n}", which is not a node in ${baseInfo.file}`);
            }
          }
        }
        if (!isText(ext?.concept)) err(`${at}: review.${qid}.extends.concept is missing`);
        const rs = r.regionSources;
        if (!Array.isArray(rs) || rs.length === 0) err(`${at}: review.${qid}.regionSources needs at least one quoted source`);
        else checkSourceList(`${at}: review.${qid}.regionSources`, rs, err);
        if (!isText(r.confidence)) warn(`${at}: review.${qid}.confidence is missing`);
      }

      // Sources shown to players: every reviewed source's URL is listed.
      const shown = Array.isArray(q.sources) ? q.sources : [];
      if (shown.length === 0) err(`${at}: ${qid}.sources is missing`);
      shown.forEach((s, si) => {
        if (!isText(s?.title) || !isText(s?.url)) err(`${at}: ${qid}.sources[${si}] needs title and url`);
        else if (/\bTBD\b/.test(s.title)) err(`${at}: ${qid}.sources[${si}] title shows "TBD" to players`);
      });
      const shownUrls = new Set(shown.map((s) => s?.url));
      const reviewed = [
        ...(Array.isArray(r.regionSources) ? r.regionSources : []),
        ...Object.values((r.choiceSources ?? {}) as Record<string, unknown[]>).flat(),
      ] as { url?: string }[];
      for (const s of reviewed) {
        if (isText(s?.url) && !shownUrls.has(s.url)) err(`${at}: source ${s.url} is in review but not in ${qid}.sources`);
      }

      const fixed = (w: number) => w * TIME_MODEL.secondsPerWord + TIME_MODEL.secondsPerQuestion;
      const common = [intro.text, q.text].reduce((n, t) => n + (isText(t) ? words(t) : 0), 0) + optionWords + (isText(merge.text) ? words(merge.text) : 0);
      questions.set(start, {
        start,
        intro,
        question: q,
        merge,
        rightSeconds: fixed(common + rightBranchWords),
        worstSeconds: fixed(common + Math.max(worstBranchWords, rightBranchWords)),
      });
    }

    for (const id of Object.keys(nodes)) {
      if (!used.has(id)) warn(`${where}: node ${id} is not part of any question in pool or held`);
    }

    // Time budget for every pair the rotation can show.
    const titleWords = isText(lesson.title) ? words(lesson.title) : 0;
    for (const { play, pair } of allRounds(pool.filter((p) => questions.has(p)), lesson.roundSize ?? 2)) {
      const qs = pair.map((p) => questions.get(p)!);
      const mergeWords = qs.reduce((n, x) => n + (isText(x.merge.text) ? words(x.merge.text) : 0), 0);
      const roundExtra = (titleWords + mergeWords) * TIME_MODEL.secondsPerWord + TIME_MODEL.secondsPerRound;
      const t: RoundTime = {
        play,
        pair,
        right: round1(qs.reduce((n, x) => n + x.rightSeconds, 0) + roundExtra),
        worst: round1(qs.reduce((n, x) => n + x.worstSeconds, 0) + roundExtra),
      };
      times.push(t);
      if (t.worst > TIME_MODEL.roundCapSeconds) {
        err(`${where}: play ${play} (${pair.join(" + ")}) takes ${t.worst} s on the slowest path (cap ${TIME_MODEL.roundCapSeconds} s)`);
      }
    }
  }
  return { errors, warnings, times };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function checkZoom(at: string, z: Zoom | undefined, err: (m: string) => void) {
  if (!z || typeof z !== "object") {
    err(`${at} is missing`);
    return;
  }
  for (const k of ["x", "y", "w", "h"] as const) {
    if (typeof z[k] !== "number" || !Number.isFinite(z[k])) err(`${at}.${k} must be a number`);
  }
  if (z.x < 0 || z.y < 0 || z.w <= 0 || z.h <= 0 || z.x + z.w > 1 + EPS || z.y + z.h > 1 + EPS) {
    err(`${at} must lie inside the image (0–1)`);
  }
  if (!isText(z.label)) err(`${at}.label is missing`);
  if (!isText(z.image)) err(`${at}.image is missing`);
}

function checkSourceList(at: string, list: unknown[], err: (m: string) => void) {
  list.forEach((raw, i) => {
    const s = raw as Record<string, unknown>;
    if (!isText(s?.title) || !isText(s?.url) || !isText(s?.quote)) err(`${at}[${i}] needs title, url and the quoted passage`);
  });
}
