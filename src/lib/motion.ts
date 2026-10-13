// Motion state for the level and challenge players (PRODUCT.md "Motion").
// Nothing here is saved: the mood comes from the content, and the
// "has the head entered yet" memory lives only for this visit of the page.

import { useRef } from "react";
import type { Mood } from "@/doodles/avatars";
import type { LessonNode } from "./types";

/**
 * How the head reacts on a branch: a hop when it was reached from the right
 * answer, a thoughtful tilt when it carries a correction (a wrong answer), and
 * nothing for questions with no right answer. Works the same after a reload.
 */
export function moodFor(nodes: Record<string, LessonNode>, nodeId: string): Mood | undefined {
  const node = nodes[nodeId];
  if (node?.type !== "branch") return undefined;
  for (const n of Object.values(nodes)) {
    if (n.type !== "question") continue;
    const choice = n.choices.find((c) => c.next === nodeId);
    if (choice && (choice.correct || choice.role === "right")) return "hop";
  }
  return node.correction ? "tilt" : undefined;
}

type Shown = { node: string | null; enter: boolean; filled?: number };

/**
 * Per screen: does the head rise in (first screen shown in this visit, or the
 * speaker changed), and which progress segment was answered on this screen
 * (none on the first screen, so a resumed level doesn't replay its fills).
 * Worked out once per node, so a re-render of the same screen never restarts
 * an animation.
 */
export function useScreenMotion(ready: boolean, nodeId: string, speakerId: string | undefined, answered: number) {
  const shown = useRef<Shown>({ node: null, enter: false });
  const lastSpeaker = useRef<string | undefined | null>(null);
  const lastAnswered = useRef<number | null>(null);
  if (!ready) return { enter: false, filled: undefined };
  if (shown.current.node !== nodeId) {
    const enter = speakerId !== undefined && lastSpeaker.current !== speakerId;
    const filled = lastAnswered.current !== null && answered > lastAnswered.current ? answered - 1 : undefined;
    lastSpeaker.current = speakerId;
    lastAnswered.current = answered;
    shown.current = { node: nodeId, enter, filled };
  }
  return { enter: shown.current.enter, filled: shown.current.filled };
}
