"use client";

// The level route: one node per level, in journey order. Done levels
// (gold-brown) can be replayed, the current level (ultramarine) has
// "Continue", locked levels (grey) show a quiet hint instead of a pop-up.

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { CheckDoodle, LockDoodle, RouteDoodle } from "@/doodles";
import { ArtistHead, findHead } from "@/doodles/heads";
import type { JourneyItem } from "@/lib/content";
import { getCompleted, statuses, type LevelStatus } from "@/lib/progress";

const nodeStyle: Record<LevelStatus, string> = {
  done: "bg-gold text-white",
  current: "bg-ultramarine text-white",
  locked: "bg-line text-muted",
};

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
        const head = findHead(item.artist);
        const circle = (
          <span
            className={`wobbly-circle flex h-16 w-16 shrink-0 items-center justify-center border-[2.5px] border-ink font-hand text-3xl font-bold ${nodeStyle[s]}`}
          >
            {s === "done" ? <CheckDoodle className="h-8 w-8" /> : s === "locked" ? <LockDoodle className="h-7 w-7" /> : i + 1}
          </span>
        );
        const text = (
          <span className="min-w-0 flex-1">
            <span className={`block font-hand text-2xl font-bold leading-tight ${s === "locked" ? "text-muted" : ""}`}>
              {item.artworkTitle}
            </span>
            <span className="block text-sm text-muted">{item.title}</span>
          </span>
        );
        return (
          <Fragment key={item.id}>
            {i > 0 && (
              <li aria-hidden="true" className="flex w-16 justify-center">
                <RouteDoodle className="h-12 w-6" dashed={s === "locked"} />
              </li>
            )}
            <li>
              {s === "locked" ? (
                <button
                  type="button"
                  onClick={() => setHintFor(item.id)}
                  className="flex w-full items-center gap-4 text-left"
                  aria-describedby={hintFor === item.id ? `hint-${item.id}` : undefined}
                >
                  {circle}
                  {text}
                </button>
              ) : (
                <Link href={`/lesson/${item.id}/`} className="flex items-center gap-4">
                  {circle}
                  {text}
                  {head && s !== "current" && <ArtistHead head={head} size={40} />}
                </Link>
              )}
              {s === "current" && (
                <div className="mt-3 flex items-center gap-3 pl-20">
                  <Link href={`/lesson/${item.id}/`} className="btn-primary">
                    Continue
                  </Link>
                  {head && <ArtistHead head={head} size={44} />}
                </div>
              )}
              {s === "done" && <span className="sr-only">Finished. Tap to play again.</span>}
              <p id={`hint-${item.id}`} aria-live="polite" className="min-h-0 pl-20 font-hand text-lg text-muted">
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
