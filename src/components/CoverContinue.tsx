"use client";

// "Continue · <work>" on the cover (PRODUCT.md "Structure and navigation"):
// the way back into a chapter level left mid-way, which the "Start here" card
// doesn't show (it covers the five trail levels only). The most recently
// played one, read from the order of the existing place key, opens in its
// chapter. Nothing shows when no chapter level is in progress.

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCompleted, getPlace, placedByRecency } from "@/lib/progress";

export type ChapterLevel = { levelId: string; title: string; chapterId: string; nodeIds: string[]; questionCount: number };

export default function CoverContinue({ levels }: { levels: ChapterLevel[] }) {
  const [resume, setResume] = useState<{ level: ChapterLevel; answered: number } | null>(null);

  useEffect(() => {
    const done = new Set(getCompleted());
    for (const id of placedByRecency(levels.map((l) => l.levelId))) {
      const level = levels.find((l) => l.levelId === id);
      const place = level && !done.has(id) ? getPlace(id, level.nodeIds, level.questionCount) : null;
      if (level && place) {
        setResume({ level, answered: place.answered });
        return;
      }
    }
  }, [levels]);

  if (!resume) return null;
  const { level, answered } = resume;
  return (
    <Link
      href={`/lesson/${level.levelId}/?from=${level.chapterId}`}
      aria-label={`Continue ${level.title}, Chapter ${level.chapterId}, ${answered} of ${level.questionCount} answered`}
      className="btn-option justify-center text-center font-bold"
    >
      Continue · {level.title}
    </Link>
  );
}
