import Link from "next/link";
import ChallengeRoute from "@/components/ChallengeRoute";
import Journey from "@/components/Journey";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { getChallenge } from "@/lib/challenge";
import { getJourney } from "@/lib/content";

export default function Home() {
  const journey = getJourney();
  return (
    <main className="soft-fade py-8">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-hand text-[2.6rem] font-bold leading-none">
            Louvre
            <br />
            Before You Go
          </h1>
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
        {/* 0.6 build step 2: the contents page, linked here for testing until the cover becomes home (step 3). */}
        <Link href="/contents/" className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline">
          Contents: all 100 works
        </Link>
        <Link href="/about/" className="font-hand text-lg text-ultramarine underline">
          About &amp; sources
        </Link>
      </footer>
    </main>
  );
}
