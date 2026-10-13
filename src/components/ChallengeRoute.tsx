"use client";

// The Close-Up Challenge on the home page, under the level route
// (PRODUCT.md "Close-Up Challenge"). Locked until all five levels are done,
// with one line saying why. Then one round per artwork in route order, like
// the levels: done (gold tick, replayable with the next pair of questions),
// current ("Start"), any round left mid-way ("Continue"), later ones locked.
//
// Motion (PRODUCT.md "Motion"), all one-shots: on the first home visit after
// the five levels (with no round played yet) the close-ups unlock: the
// magnifier pops and turns ultramarine, the padlock opens, the line reads
// "Close-ups unlocked.", and the first round's badge flips to a magnifier,
// its head regains its colour, its ring draws and Start rises. After a round
// is finished for the first time, its tick pops and the next round opens the
// same way. A tapped locked round wiggles its padlock. Heads here stay still.

import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import { CheckDoodle, LockDoodle, UnderlineDoodle, ZoomDoodle } from "@/doodles";
import { Avatar } from "@/doodles/avatars";
import type { ChallengeItem } from "@/lib/challenge";
import {
  challengeUnlockSeen,
  getCompleted,
  getPlace,
  getPlays,
  markChallengeUnlockSeen,
  statuses,
  takeJustCompleted,
  type LevelStatus,
  type SavedPlace,
} from "@/lib/progress";

type FaceProps = {
  item: ChallengeItem;
  index: number;
  status: LevelStatus | "closed";
  /** First round during the unlock moment: from locked to open, once. */
  unlocking?: boolean;
  /** This round was just finished: pop its tick. */
  justDone?: boolean;
  /** This round was just opened by finishing the previous one: draw its ring. */
  justOpened?: boolean;
  /** Bumped on each tap of a locked round, to wiggle its padlock again. */
  wiggle?: number;
};

function Face({ item, index, status, unlocking, justDone, justOpened, wiggle }: FaceProps) {
  const faded = status === "locked" || status === "closed";
  const face = (ring: boolean, ringDrawDelay?: number) =>
    item.narrator ? (
      <Avatar speaker={item.narrator} size={52} ring={ring} ringDrawDelay={ringDrawDelay} />
    ) : (
      <span className="wobbly-circle flex h-[52px] w-[52px] items-center justify-center border-[2.5px] border-ink bg-mat font-hand text-2xl font-bold">
        {index + 1}
      </span>
    );
  const badge = "wobbly-circle absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center border-2 border-ink bg-mat text-ink";

  if (unlocking) {
    return (
      <span className="relative shrink-0">
        {/* The locked look underneath; the open head fades in over it. */}
        <span className="absolute inset-0 opacity-45 grayscale" aria-hidden="true">
          {face(false)}
        </span>
        <span className="m-unlock-face relative block">{face(status === "current", 650)}</span>
        <span className={`${badge} m-unlock-flip`}>
          <span className="m-unlock-flip-out absolute inset-0 flex items-center justify-center">
            <LockDoodle className="h-3.5 w-3.5" />
          </span>
          <span className="m-unlock-flip-in absolute inset-0 flex items-center justify-center">
            <ZoomDoodle className="h-4 w-4" />
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`relative shrink-0 ${faded ? "opacity-45 grayscale" : ""}`}>
      {face(status === "current", justOpened ? 200 : undefined)}
      <span key={faded ? wiggle : undefined} className={`${badge} ${faded && wiggle ? "m-wiggle" : ""}`}>
        {status === "done" ? (
          <span className={`wobbly-circle flex h-full w-full items-center justify-center bg-gold text-white ${justDone ? "m-tick" : ""}`}>
            <CheckDoodle className="h-4 w-4" />
          </span>
        ) : faded ? (
          <LockDoodle className="h-3.5 w-3.5" />
        ) : (
          <ZoomDoodle className="h-4 w-4" />
        )}
      </span>
    </span>
  );
}

export default function ChallengeRoute({ items, levelIds }: { items: ChallengeItem[]; levelIds: string[] }) {
  const [completed, setCompleted] = useState<string[] | null>(null);
  const [places, setPlaces] = useState<Record<string, SavedPlace | null>>({});
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [hint, setHint] = useState<{ id: string; n: number } | null>(null);
  const [unlockMoment, setUnlockMoment] = useState(false);
  const [justDone, setJustDone] = useState<string | null>(null);

  useEffect(() => {
    const completedNow = getCompleted();
    const placesNow = Object.fromEntries(items.map((i) => [i.id, getPlace(i.id, i.nodeIds, 2)]));
    setCompleted(completedNow);
    setPlaces(placesNow);
    setPlays(Object.fromEntries(items.map((i) => [i.id, getPlays(i.id)])));

    // The unlock moment plays once: on the first visit with all five levels
    // done, and only if no round has been played yet (players who unlocked
    // the close-ups before motion existed don't get it out of the blue).
    const doneNow = new Set(completedNow);
    if (items.length > 0 && levelIds.every((id) => doneNow.has(id))) {
      const untouched = items.every((i) => !doneNow.has(i.id) && !placesNow[i.id]);
      if (untouched && !challengeUnlockSeen()) setUnlockMoment(true);
      markChallengeUnlockSeen();
    }
    const just = takeJustCompleted(items.map((i) => i.id));
    if (just) setJustDone(just);
  }, [items, levelIds]);

  if (items.length === 0) return null;
  const done = new Set(completed ?? []);
  const unlocked = completed !== null && levelIds.every((id) => done.has(id));
  const state = statuses(items.map((i) => i.id), completed ?? []);
  const justIndex = justDone ? items.findIndex((i) => i.id === justDone) : -1;
  const justOpenedIndex = justIndex >= 0 && state[justIndex + 1] === "current" ? justIndex + 1 : -1;

  return (
    <section aria-labelledby="challenge-heading" className={`mt-12 ${completed === null ? "invisible" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 id="challenge-heading" className="font-hand text-[2.1rem] font-bold leading-none">
          Close-Up Challenge
        </h2>
        {unlockMoment ? (
          <span className="m-unlock-mag relative h-10 w-10 shrink-0">
            <ZoomDoodle className="absolute inset-0 h-10 w-10 text-muted" />
            <ZoomDoodle className="m-unlock-mag-on absolute inset-0 h-10 w-10 text-ultramarine" />
          </span>
        ) : (
          <ZoomDoodle className={`h-10 w-10 shrink-0 ${unlocked ? "text-ultramarine" : "text-muted"}`} />
        )}
      </div>
      <UnderlineDoodle className="mt-1 h-3 w-44" />
      <p className="mt-3 text-muted">
        Two harder questions per work, on zoomed-in details of the real thing. About two minutes a round.
      </p>
      {!unlocked && (
        <p className="mt-2 flex items-center gap-2 font-hand text-xl">
          <LockDoodle className="h-5 w-5 shrink-0" /> Finish all five levels to unlock the close-ups.
        </p>
      )}
      {unlocked && unlockMoment && (
        // First visit only: the padlock opens and the line changes, in the same space (no layout shift).
        <p className="mt-2 flex items-center gap-2 font-hand text-xl">
          <LockDoodle className="h-5 w-5 shrink-0" opening />
          <span className="inline-grid">
            <span className="m-unlock-was [grid-area:1/1]" aria-hidden="true">
              Finish all five levels to unlock the close-ups.
            </span>
            <span className="m-unlock-now [grid-area:1/1]">Close-ups unlocked.</span>
          </span>
        </p>
      )}

      <ol className="mt-5 flex flex-col gap-4">
        {items.map((item, i) => {
          const s: LevelStatus | "closed" = unlocked ? state[i] : "closed";
          const open = s === "done" || s === "current";
          const place = open ? places[item.id] : null;
          const label = (
            <span className="min-w-0 flex-1">
              <span className={`block font-hand text-xl font-bold leading-tight ${open ? "" : "text-muted"}`}>
                {item.artworkTitle}
              </span>
              <span className="block text-sm text-muted">
                {item.title}
                {s === "done" && !place && <span className="sr-only"> (finished, tap to play the next pair)</span>}
                {place && <span className="sr-only"> (in progress, tap to continue)</span>}
                {!open && <span className="sr-only"> (locked)</span>}
              </span>
            </span>
          );
          return (
            <li key={item.id}>
              {open ? (
                <Link href={`/challenge/${item.id}/`} className="flex items-center gap-3">
                  <Face
                    item={item}
                    index={i}
                    status={s}
                    unlocking={unlockMoment && i === 0}
                    justDone={item.id === justDone}
                    justOpened={i === justOpenedIndex}
                  />
                  {label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setHint((h) => ({ id: item.id, n: (h?.n ?? 0) + 1 }))}
                  className="flex w-full items-center gap-3 text-left"
                  aria-describedby={`challenge-hint-${item.id}`}
                >
                  <Face item={item} index={i} status={s} wiggle={hint?.id === item.id ? hint.n : undefined} />
                  {label}
                </button>
              )}
              {place ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[64px]">
                  <Link href={`/challenge/${item.id}/`} className="btn-primary">
                    Continue
                  </Link>
                  <span className="font-hand text-lg text-muted">{place.answered} of 2 answered</span>
                </div>
              ) : s === "current" ? (
                <div className="mt-2 pl-[64px]">
                  <Link
                    href={`/challenge/${item.id}/`}
                    className={`btn-primary ${(unlockMoment && i === 0) || i === justOpenedIndex ? "m-rise" : ""}`}
                    style={unlockMoment && i === 0 ? ({ "--i": 6 } as CSSProperties) : undefined}
                  >
                    Start
                  </Link>
                </div>
              ) : (
                s === "done" &&
                item.pool.length > 2 && (
                  <p className="pl-[64px] font-hand text-lg text-muted">
                    Played {plays[item.id] ?? 1}× · tap for the next pair
                  </p>
                )
              )}
              <p id={`challenge-hint-${item.id}`} aria-live="polite" className="pl-[64px] font-hand text-lg text-muted">
                {hint?.id === item.id && (
                  <span key={hint.n} className="m-hint">
                    {unlocked ? "Finish the previous close-up first" : "Finish all five levels first"}
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
