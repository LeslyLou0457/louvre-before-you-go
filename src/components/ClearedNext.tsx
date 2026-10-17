"use client";

// The bottom of the level-cleared page: what comes next (PRODUCT.md
// "Progress, 'Next up' and seals"). Opened from the "Start here" trail or the
// cover, a trail level unlocks the next trail level, as since 0.5. Any other
// level, and a trail level opened from a chapter (`?from=09`), points to its
// chapter's "Next up": the first level in module order not met yet, the same
// rule as the chapter page. When the chapter has none left, it says so and
// offers the next chapter with a level to play. Read from the existing
// progress keys after mount; nothing new is stored.

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import ReturnLink from "./ReturnLink";
import { readOrigin, TRAIL, type Origin } from "@/lib/origin";
import { getCompleted } from "@/lib/progress";

export type ChapterLevels = { id: string; levels: { levelId: string; title: string }[] };

type Props = {
  levelId: string;
  /** The next trail level, for a trail level opened from the trail or the cover. */
  trailNext?: { title: string; href: string };
  /** Whether the level is one of the five "Start here" levels. */
  trail: boolean;
  /** The chapter holding the level, with its levels in module order. */
  chapter?: ChapterLevels;
  /** Every chapter with a level, in book order, for "the next chapter". */
  chapters: ChapterLevels[];
  /** The level has a close-up round, which opens now in its chapter. */
  hasRound: boolean;
};

function chapterName(id: string): string {
  return id === "beyond" ? "the appendix" : `Chapter ${id}`;
}

export default function ClearedNext({ levelId, trailNext, trail, chapter, chapters, hasRound }: Props) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    setOrigin(readOrigin());
    setCompleted(new Set([...getCompleted(), levelId]));
  }, [levelId]);

  const o = origin ?? TRAIL;
  const chapterMode = !!chapter && (!trail || o.kind === "chapter");
  const unmet = (c: ChapterLevels) => c.levels.find((l) => !completed.has(l.levelId));

  let line: ReactNode;
  let next: { label: string; href: string } | undefined;

  if (chapterMode && chapter) {
    const up = unmet(chapter);
    if (up) {
      line = (
        <>
          Next in {chapterName(chapter.id)}: <span className="font-bold">{up.title}</span>
        </>
      );
      next = { label: "Start the next level now", href: `/lesson/${up.levelId}/?from=${chapter.id}` };
    } else {
      line = `That's every level in ${chapterName(chapter.id)} met for now.${
        hasRound ? " Its close-up round is open now, at the bottom of the chapter." : ""
      }`;
      const i = chapters.findIndex((c) => c.id === chapter.id);
      const after = [...chapters.slice(i + 1), ...chapters.slice(0, Math.max(i, 0))].find((c) => c.id !== chapter.id && unmet(c));
      if (after) next = { label: `Go on to ${chapterName(after.id)}`, href: `/chapter/${after.id}/` };
    }
  } else if (trailNext) {
    line = (
      <>
        Unlocked: <span className="font-bold">{trailNext.title}</span>
      </>
    );
    next = { label: "Start the next level now", href: trailNext.href };
  } else if (trail) {
    line = "That was the last one. You're ready for the Louvre.";
  } else {
    line = "That's the last level for now.";
  }

  return (
    <div className={`mt-auto flex flex-col items-center gap-3 ${origin ? "" : "invisible"}`}>
      <p className="text-center font-hand text-xl">{line}</p>
      <ReturnLink className="btn-primary w-full" />
      {next && (
        <Link href={next.href} className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline">
          {next.label}
        </Link>
      )}
    </div>
  );
}
