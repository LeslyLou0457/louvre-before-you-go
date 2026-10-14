"use client";

// The "Start here" card on the cover (PRODUCT.md "Structure and navigation":
// "the 'Start here' card (continue where you left off)"). The five narrators
// in route order with the trail's own states (gold tick when met, ultramarine
// ring on the level to play next), one button straight into that level, and
// the heads as the way into the whole trail at /start/. Read from the
// existing progress keys only; nothing new is stored. Heads stay still here:
// motion for the new screens is build step 5.

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckDoodle } from "@/doodles";
import { Avatar } from "@/doodles/avatars";
import type { JourneyItem } from "@/lib/content";
import { getCompleted, getPlace, statuses, type SavedPlace } from "@/lib/progress";

type Props = {
  items: JourneyItem[];
  /** Close-up round ids, in route order. */
  roundIds: string[];
  /** "04, 09 and 10": the chapters these five also sit in. */
  chapters: string;
};

export default function TrailCard({ items, roundIds, chapters }: Props) {
  const [completed, setCompleted] = useState<string[] | null>(null);
  const [places, setPlaces] = useState<Record<string, SavedPlace | null>>({});

  useEffect(() => {
    setCompleted(getCompleted());
    setPlaces(Object.fromEntries(items.map((i) => [i.id, getPlace(i.id, i.nodeIds, i.questionCount)])));
  }, [items]);

  const done = completed ?? [];
  const state = statuses(items.map((i) => i.id), done);
  const met = state.filter((s) => s === "done").length;
  const roundsDone = roundIds.filter((id) => done.includes(id)).length;
  // A level left mid-way comes first (as on the trail, locked levels have no place); then the next unmet one.
  const resumeAt = items.findIndex((it, i) => state[i] !== "locked" && places[it.id]);
  const nextAt = state.indexOf("current");
  const target = resumeAt >= 0 ? resumeAt : nextAt;
  const started = met > 0 || resumeAt >= 0;

  const action =
    target >= 0
      ? {
          href: `/lesson/${items[target].id}/?from=cover`,
          text: `${resumeAt >= 0 ? "Continue" : "Start"} · ${items[target].artworkTitle}`,
        }
      : { href: "/start/", text: roundsDone < roundIds.length ? "Close-ups on the trail" : "Open the trail" };

  const closeUps =
    met < items.length && roundsDone === 0
      ? "Close-up rounds open once all five are met."
      : `Close-up rounds: ${roundsDone} of ${roundIds.length} done.`;

  return (
    <section aria-labelledby="trail-title" className="wobbly-alt mt-6 border-2 border-ink bg-mat p-3.5">
      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Start here · {items.length} masterpieces</p>
      <h2 id="trail-title" className="mt-0.5 font-hand text-[1.6rem] font-bold leading-[1.05]">
        {started ? "Pick up where you left off" : "Five masterpieces to start with"}
      </h2>

      <Link
        href="/start/"
        aria-label={`Open the Start here trail: ${met} of ${items.length} met`}
        className="my-2.5 flex flex-wrap gap-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine"
      >
        {items.map((it, i) => (
          <span key={it.id} className={`relative h-14 w-14 shrink-0 ${state[i] === "locked" ? "opacity-45 grayscale" : ""}`} aria-hidden="true">
            {it.narrator ? (
              <Avatar speaker={it.narrator} size={56} ring={i === target} />
            ) : (
              <span className="wobbly-circle flex h-14 w-14 items-center justify-center border-[2.5px] border-ink bg-mat font-hand text-2xl font-bold">
                {i + 1}
              </span>
            )}
            {state[i] === "done" && (
              <span className="wobbly-circle absolute -bottom-0.5 -right-0.5 flex h-[22px] w-[22px] items-center justify-center border-2 border-ink bg-gold text-ink">
                <CheckDoodle className="h-4 w-4" />
              </span>
            )}
          </span>
        ))}
      </Link>

      <Link href={action.href} className={`btn-primary max-w-full ${completed ? "" : "invisible"}`}>
        {action.text}
      </Link>
      <p className="mt-2 text-[13px] leading-snug text-muted">
        {met} of {items.length} met · {closeUps} These five also sit in chapters {chapters}.
      </p>
    </section>
  );
}
