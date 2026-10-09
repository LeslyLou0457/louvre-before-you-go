import Link from "next/link";
import Journey from "@/components/Journey";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { getJourney } from "@/lib/content";

export default function Home() {
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

      <Journey items={getJourney()} />

      <footer className="mt-12 border-t border-line pt-4 text-sm">
        <Link href="/about/" className="font-hand text-lg text-ultramarine underline">
          About &amp; sources
        </Link>
      </footer>
    </main>
  );
}
