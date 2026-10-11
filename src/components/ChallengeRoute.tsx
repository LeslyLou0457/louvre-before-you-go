"use client";

// The Close-Up Challenge on the home page, under the level route
// (PRODUCT.md "Close-Up Challenge"). Locked until all five levels are done,
// with one line saying why. Then one round per artwork in route order, like
// the levels: done (gold tick, replayable with the next pair of questions),
// current ("Start"), any round left mid-way ("Continue"), later ones locked.

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckDoodle, LockDoodle, UnderlineDoodle, ZoomDoodle } from "@/doodles";
import { Avatar } from "@/doodles/avatars";
import type { ChallengeItem } from "@/lib/challenge";
import { getCompleted, getPlace, getPlays, statuses, type LevelStatus, type SavedPlace } from "@/lib/progress";

function Face({ item, index, status }: { item: ChallengeItem; index: number; status: LevelStatus | "closed" }) {
  const faded = status === "locked" || status === "closed";
  return (
    <span className={`relative shrink-0 ${faded ? "opacity-45 grayscale" : ""}`}>
      {item.narrator ? (
        <Avatar speaker={item.narrator} size={52} ring={status === "current"} />
      ) : (
        <span className="wobbly-circle flex h-[52px] w-[52px] items-center justify-center border-[2.5px] border-ink bg-mat font-hand text-2xl font-bold">
          {index + 1}
        </span>
      )}
      <span className="wobbly-circle absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center border-2 border-ink bg-mat text-ink">
        {status === "done" ? (
          <span className="wobbly-circle flex h-full w-full items-center justify-center bg-gold text-white">
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
  const [hintFor, setHintFor] = useState<string | null>(null);

  useEffect(() => {
    setCompleted(getCompleted());
    setPlaces(Object.fromEntries(items.map((i) => [i.id, getPlace(i.id, i.nodeIds, 2)])));
    setPlays(Object.fromEntries(items.map((i) => [i.id, getPlays(i.id)])));
  }, [items]);

  if (items.length === 0) return null;
  const done = new Set(completed ?? []);
  const unlocked = completed !== null && levelIds.every((id) => done.has(id));
  const state = statuses(items.map((i) => i.id), completed ?? []);

  return (
    <section aria-labelledby="challenge-heading" className={`mt-12 ${completed === null ? "invisible" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 id="challenge-heading" className="font-hand text-[2.1rem] font-bold leading-none">
          Close-Up Challenge
        </h2>
        <ZoomDoodle className={`h-10 w-10 shrink-0 ${unlocked ? "text-ultramarine" : "text-muted"}`} />
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
                  <Face item={item} index={i} status={s} />
                  {label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintFor(item.id)}
                  className="flex w-full items-center gap-3 text-left"
                  aria-describedby={`challenge-hint-${item.id}`}
                >
                  <Face item={item} index={i} status={s} />
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
                  <Link href={`/challenge/${item.id}/`} className="btn-primary">
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
                {hintFor === item.id
                  ? unlocked
                    ? "Finish the previous close-up first"
                    : "Finish all five levels first"
                  : ""}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
