// Level time model (PRODUCT.md "Three details": about 5 minutes, never more
// than 7; one work, level plus close-up round, within 10). Pure functions with
// no runtime imports, shared by the content check (plain Node) and the app.
//
// The same reading model as the Close-Up Challenge (lib/rotation.ts
// TIME_MODEL): 200 words a minute (0.3 s a word). On top of reading, every
// screen costs one tap (1 s) and every question 5 s of choosing. A screen's
// words are its text, its voice line and, on a question, its options; a wrong
// branch adds its correction card.

import type { LessonNode } from "./types";

export const LEVEL_TIME_MODEL = {
  secondsPerWord: 0.3,
  secondsPerScreen: 1,
  secondsPerChoice: 5,
  /** "About 5 minutes": the content check warns when the all-right path is longer than 6. */
  rightWarnSeconds: 360,
  /** "Never more than 7": the content check fails a level whose slowest path is longer. */
  capSeconds: 420,
  /** One work, its level plus its close-up round. */
  workCapSeconds: 600,
} as const;

export type LevelTime = {
  /** Seconds on the path that picks every right answer (the longest branch where there is none). */
  right: number;
  /** Seconds on the slowest path: every wrong answer, every correction card read. */
  worst: number;
  /** Screens on the slowest path. */
  screens: number;
};

const words = (s: unknown) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);

function screenWords(n: LessonNode): number {
  let w = words(n.text) + words((n as { voice?: { text?: string } }).voice?.text);
  if (n.type === "question") w += n.choices.reduce((s, c) => s + words(c.label), 0);
  if (n.type === "branch" && n.correction) {
    w += words(n.correction.verdict) + words(n.correction.tempting) + words(n.correction.truth) + words(n.correction.evidence);
  }
  return w;
}

/**
 * Times one level from its start node. Returns null when the graph has a
 * cycle or a missing node (the structural checks report those).
 */
export function levelTime(nodes: Record<string, LessonNode>, start: string): LevelTime | null {
  const M = LEVEL_TIME_MODEL;
  const cost = (n: LessonNode) => screenWords(n) * M.secondsPerWord + M.secondsPerScreen + (n.type === "question" ? M.secondsPerChoice : 0);
  type R = { right: number; worst: number; screens: number };
  const memo = new Map<string, R>();
  const visiting = new Set<string>();

  const walk = (id: string): R | null => {
    const done = memo.get(id);
    if (done) return done;
    const n = nodes[id];
    if (!n || visiting.has(id)) return null;
    visiting.add(id);
    const own = cost(n);
    let r: R | null;
    if (n.type === "question") {
      const kids = n.choices.map((c) => ({ c, r: walk(c.next) }));
      if (kids.some((k) => !k.r)) r = null;
      else {
        const worst = kids.reduce((a, k) => (k.r!.worst > a.r!.worst ? k : a));
        const rightKid = kids.find((k) => k.c.correct === true);
        const rightTime = rightKid ? rightKid.r!.right : Math.max(...kids.map((k) => k.r!.right));
        r = { right: own + rightTime, worst: own + worst.r!.worst, screens: 1 + worst.r!.screens };
      }
    } else if (n.next === undefined) {
      r = { right: own, worst: own, screens: 1 };
    } else {
      const k = walk(n.next);
      r = k ? { right: own + k.right, worst: own + k.worst, screens: 1 + k.screens } : null;
    }
    visiting.delete(id);
    if (r) memo.set(id, r);
    return r;
  };

  const r = walk(start);
  if (!r) return null;
  const round1 = (x: number) => Math.round(x * 10) / 10;
  return { right: round1(r.right), worst: round1(r.worst), screens: r.screens };
}
