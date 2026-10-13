"use client";

// The level route: a squiggly ink line with one node per level. Each node is
// the level's narrator in an ink circle (a numbered circle when there is no
// narrator). Done: gold-brown tick, replayable. Current: ultramarine ring and
// "Start". Any open level left mid-way gets "Continue" and how far it got.
// Locked: faded, with a quiet hint instead of a pop-up.
//
// Motion (PRODUCT.md "Motion"): only the current level's head floats. On the
// first visit after a level is finished for the first time, its tick pops,
// the route to the next level draws itself solid, the next head's ring draws
// and its Start button rises, once. A tapped locked level wiggles its padlock.

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { CheckDoodle, LockDoodle, RouteDoodle } from "@/doodles";
import { Head } from "@/doodles/avatars";
import type { JourneyItem } from "@/lib/content";
import { getCompleted, getPlace, statuses, takeJustCompleted, type LevelStatus, type SavedPlace } from "@/lib/progress";

type NodeProps = {
  item: JourneyItem;
  index: number;
  status: LevelStatus;
  /** This level was just finished: pop its tick. */
  justDone?: boolean;
  /** This level was just unlocked: draw its ring. */
  justOpened?: boolean;
  /** Bumped on each tap of a locked level, to wiggle its padlock again. */
  wiggle?: number;
};

function Node({ item, index, status, justDone, justOpened, wiggle }: NodeProps) {
  const face = item.narrator ? (
    <Head
      speaker={item.narrator}
      size={68}
      ring={status === "current"}
      ringDrawDelay={justOpened ? 200 : undefined}
      float={status === "current"}
    />
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
        <span
          className={`wobbly-circle absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center border-2 border-ink bg-gold text-white ${
            justDone ? "m-tick" : ""
          }`}
        >
          <CheckDoodle className="h-5 w-5" />
        </span>
      )}
      {status === "locked" && (
        <span
          key={wiggle}
          className={`wobbly-circle absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center border-2 border-ink bg-mat text-ink ${
            wiggle ? "m-wiggle" : ""
          }`}
        >
          <LockDoodle className="h-4 w-4" />
        </span>
      )}
    </span>
  );
}

export default function Journey({ items }: { items: JourneyItem[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [places, setPlaces] = useState<Record<string, SavedPlace | null>>({});
  const [hint, setHint] = useState<{ id: string; n: number } | null>(null);
  const [justDone, setJustDone] = useState<string | null>(null);

  useEffect(() => {
    setCompleted(getCompleted());
    setPlaces(Object.fromEntries(items.map((i) => [i.id, getPlace(i.id, i.nodeIds, i.questionCount)])));
    const just = takeJustCompleted(items.map((i) => i.id));
    if (just) setJustDone(just);
  }, [items]);

  const state = statuses(items.map((i) => i.id), completed);
  const allDone = state.every((s) => s === "done");
  // The level opened by the one just finished (if that is the next one on the route).
  const justIndex = justDone ? items.findIndex((i) => i.id === justDone) : -1;
  const justOpenedIndex = justIndex >= 0 && state[justIndex + 1] === "current" ? justIndex + 1 : -1;

  return (
    <ol className="flex flex-col">
      {items.map((item, i) => {
        const s = state[i];
        const place = s === "locked" ? null : places[item.id];
        const label = (
          <span className="min-w-0 flex-1">
            <span className={`block font-hand text-2xl font-bold leading-tight ${s === "locked" ? "text-muted" : ""}`}>
              {item.artworkTitle}
            </span>
            <span className="block text-sm text-muted">
              {item.title}
              {s === "done" && !place && <span className="sr-only"> (finished, tap to play again)</span>}
              {place && <span className="sr-only"> (in progress, tap to continue)</span>}
              {s === "locked" && <span className="sr-only"> (locked)</span>}
            </span>
          </span>
        );
        return (
          <Fragment key={item.id}>
            {i > 0 && (
              <li aria-hidden="true" className="flex w-[68px] justify-center">
                <RouteDoodle className="h-12 w-6" dashed={s === "locked"} draw={i === justOpenedIndex} />
              </li>
            )}
            <li>
              {s === "locked" ? (
                <button
                  type="button"
                  onClick={() => setHint((h) => ({ id: item.id, n: (h?.n ?? 0) + 1 }))}
                  className="flex w-full items-center gap-4 text-left"
                  aria-describedby={`hint-${item.id}`}
                >
                  <Node item={item} index={i} status={s} wiggle={hint?.id === item.id ? hint.n : undefined} />
                  {label}
                </button>
              ) : (
                <Link href={`/lesson/${item.id}/`} className="flex items-center gap-4">
                  <Node item={item} index={i} status={s} justDone={item.id === justDone} justOpened={i === justOpenedIndex} />
                  {label}
                </Link>
              )}
              {place ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[84px]">
                  <Link href={`/lesson/${item.id}/`} className="btn-primary">
                    Continue
                  </Link>
                  <span className="font-hand text-lg text-muted">
                    {place.answered} of {item.questionCount} answered
                  </span>
                </div>
              ) : (
                s === "current" && (
                  <div className="mt-3 pl-[84px]">
                    <Link href={`/lesson/${item.id}/`} className={`btn-primary ${i === justOpenedIndex ? "m-rise" : ""}`}>
                      Start
                    </Link>
                  </div>
                )
              )}
              <p id={`hint-${item.id}`} aria-live="polite" className="pl-[84px] font-hand text-lg text-muted">
                {hint?.id === item.id && (
                  <span key={hint.n} className="m-hint">
                    Finish the previous level first
                  </span>
                )}
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
