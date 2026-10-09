"use client";

// The level route: a squiggly ink line with one node per level. Each node is
// the level's narrator in an ink circle (a numbered circle when there is no
// narrator). Done: gold-brown tick, replayable. Current: ultramarine ring and
// "Continue". Locked: faded, with a quiet hint instead of a pop-up.

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { CheckDoodle, LockDoodle, RouteDoodle } from "@/doodles";
import { Avatar } from "@/doodles/avatars";
import type { JourneyItem } from "@/lib/content";
import { getCompleted, statuses, type LevelStatus } from "@/lib/progress";

function Node({ item, index, status }: { item: JourneyItem; index: number; status: LevelStatus }) {
  const face = item.narrator ? (
    <Avatar speaker={item.narrator} size={68} ring={status === "current"} />
  ) : (
    <span
      className={`wobbly-circle flex h-[68px] w-[68px] items-center justify-center bg-mat font-hand text-3xl font-bold ${
        status === "current" ? "border-[4px] border-ultramarine" : "border-[2.5px] border-ink"
      }`}
    >
      {index + 1}
    </span>
  );
  return (
    <span className={`relative shrink-0 ${status === "locked" ? "opacity-45 grayscale" : ""}`}>
      {face}
      {status === "done" && (
        <span className="wobbly-circle absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center border-2 border-ink bg-gold text-white">
          <CheckDoodle className="h-5 w-5" />
        </span>
      )}
      {status === "locked" && (
        <span className="wobbly-circle absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center border-2 border-ink bg-mat text-ink">
          <LockDoodle className="h-4 w-4" />
        </span>
      )}
    </span>
  );
}

export default function Journey({ items }: { items: JourneyItem[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [hintFor, setHintFor] = useState<string | null>(null);

  useEffect(() => setCompleted(getCompleted()), []);

  const state = statuses(items.map((i) => i.id), completed);
  const allDone = state.every((s) => s === "done");

  return (
    <ol className="flex flex-col">
      {items.map((item, i) => {
        const s = state[i];
        const label = (
          <span className="min-w-0 flex-1">
            <span className={`block font-hand text-2xl font-bold leading-tight ${s === "locked" ? "text-muted" : ""}`}>
              {item.artworkTitle}
            </span>
            <span className="block text-sm text-muted">
              {item.title}
              {s === "done" && <span className="sr-only"> (finished, tap to play again)</span>}
              {s === "locked" && <span className="sr-only"> (locked)</span>}
            </span>
          </span>
        );
        return (
          <Fragment key={item.id}>
            {i > 0 && (
              <li aria-hidden="true" className="flex w-[68px] justify-center">
                <RouteDoodle className="h-12 w-6" dashed={s === "locked"} />
              </li>
            )}
            <li>
              {s === "locked" ? (
                <button
                  type="button"
                  onClick={() => setHintFor(item.id)}
                  className="flex w-full items-center gap-4 text-left"
                  aria-describedby={`hint-${item.id}`}
                >
                  <Node item={item} index={i} status={s} />
                  {label}
                </button>
              ) : (
                <Link href={`/lesson/${item.id}/`} className="flex items-center gap-4">
                  <Node item={item} index={i} status={s} />
                  {label}
                </Link>
              )}
              {s === "current" && (
                <div className="mt-3 pl-[84px]">
                  <Link href={`/lesson/${item.id}/`} className="btn-primary">
                    Continue
                  </Link>
                </div>
              )}
              <p id={`hint-${item.id}`} aria-live="polite" className="pl-[84px] font-hand text-lg text-muted">
                {hintFor === item.id ? "Finish the previous level first" : ""}
              </p>
            </li>
          </Fragment>
        );
      })}
      {allDone && (
        <li className="mt-6 font-hand text-xl">
          You&apos;ve met all {items.length}. Tap any one to play it again.
        </li>
      )}
    </ol>
  );
}
