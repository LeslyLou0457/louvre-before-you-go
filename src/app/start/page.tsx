import type { Metadata } from "next";
import Link from "next/link";
import ChallengeRoute from "@/components/ChallengeRoute";
import Journey from "@/components/Journey";
import TabBar, { TAB_BAR_SPACE } from "@/components/TabBar";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { getChallenge } from "@/lib/challenge";
import { getJourney } from "@/lib/content";

export const metadata: Metadata = { title: "Start here · Louvre Before You Go" };

// The "Start here" trail (PRODUCT.md "Structure and navigation"): the 0.5
// level route and its Close-Up Challenge, unchanged, moved here from `/` when
// the cover became home. Same lesson ids, same progress keys.
export default function StartHere() {
  const journey = getJourney();
  return (
    <main className={`soft-fade pt-8 ${TAB_BAR_SPACE}`}>
      <header className="mb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Louvre Before You Go · 5 masterpieces</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="font-hand text-[2.6rem] font-bold leading-none">Start here</h1>
          <StarDoodle className="h-12 w-12 shrink-0" />
        </div>
        <UnderlineDoodle className="mt-1 h-3 w-48" />
        <p className="mt-3 text-muted">
          One small story a day. See it before you go; recognise it when you&apos;re there.
        </p>
      </header>

      <Journey items={journey} />

      <ChallengeRoute items={getChallenge()} levelIds={journey.map((j) => j.id)} />

      <footer className="mt-12 flex flex-wrap items-center gap-x-6 border-t border-line pt-4 text-sm">
        <Link href="/about/" className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline">
          About &amp; sources
        </Link>
      </footer>

      <TabBar active="cover" />
    </main>
  );
}
