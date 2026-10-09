"use client";

// Close-Up Challenge cleared page: repeats the merge lines of the two
// questions just played (the pair is worked out from the play counter, which
// moved on when the round was finished), then points to the next round.

import Link from "next/link";
import { useEffect, useState } from "react";
import MuseumLabel from "./MuseumLabel";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { getPlays } from "@/lib/progress";
import { roundPair } from "@/lib/rotation";
import type { Artwork } from "@/lib/types";

type Props = {
  id: string;
  pool: string[];
  roundSize: number;
  /** Merge line per pool question (intro id). */
  merges: Record<string, string>;
  artwork: Artwork;
  museumUrl?: string;
  next?: { id: string; title: string };
};

export default function RoundCleared({ id, pool, roundSize, merges, artwork, museumUrl, next }: Props) {
  const [pair, setPair] = useState<string[] | null>(null);

  useEffect(() => {
    setPair(roundPair(pool, Math.max(0, getPlays(id) - 1), roundSize));
  }, [id, pool, roundSize]);

  return (
    <main className="soft-fade flex min-h-dvh flex-col gap-6 py-8">
      <div className="flex items-end justify-center gap-2" aria-hidden="true">
        <StarDoodle className="h-10 w-10 -rotate-12" />
        <StarDoodle className="h-16 w-16" />
        <StarDoodle className="h-10 w-10 rotate-12" />
      </div>
      <div className="text-center">
        <h1 className="font-hand text-[2.4rem] font-bold leading-none">Close-up cleared!</h1>
        <UnderlineDoodle className="mx-auto mt-1 h-3 w-40" />
      </div>

      <section className={`wobbly-alt border-[2.5px] border-ink bg-mat px-5 py-4 ${pair ? "" : "invisible"}`}>
        <h2 className="font-hand text-2xl font-bold">What you saw up close</h2>
        <ul className="mt-2 flex flex-col gap-3">
          {(pair ?? []).map((q) => (
            <li key={q} className="flex gap-2">
              <StarDoodle className="mt-1.5 h-4 w-4 shrink-0" />
              <span>{merges[q]}</span>
            </li>
          ))}
        </ul>
      </section>

      <div>
        <MuseumLabel artwork={artwork} museumUrl={museumUrl} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        {next ? (
          <p className="text-center font-hand text-xl">
            Next close-up: <span className="font-bold">{next.title}</span>
          </p>
        ) : (
          <p className="text-center font-hand text-xl">That was the last close-up. You&apos;ve looked hard at all five.</p>
        )}
        <Link href="/" className="btn-primary w-full">
          Back to the journey
        </Link>
        {next && (
          <Link href={`/challenge/${next.id}/`} className="font-hand text-lg text-ultramarine underline">
            Start the next close-up now
          </Link>
        )}
        {pool.length > roundSize && (
          <p className="text-center font-hand text-lg text-muted">Play this one again for a different pair of close-ups.</p>
        )}
      </div>
    </main>
  );
}
