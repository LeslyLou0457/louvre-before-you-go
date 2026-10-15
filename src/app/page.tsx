import Link from "next/link";
import StickerBook from "@/components/StickerBook";
import TabBar, { TAB_BAR_SPACE } from "@/components/TabBar";
import TrailCard from "@/components/TrailCard";
import { LouvreDoodle, UnderlineDoodle } from "@/doodles";
import { formatDate } from "@/lib/book";
import { getBook } from "@/lib/catalogue";
import { getChallenge } from "@/lib/challenge";
import { getJourney } from "@/lib/content";

// The cover, home since 0.6 build step 3 (PRODUCT.md "Structure and
// navigation"): the title, the cover copy, the way into the book, the
// "Start here" card and the sticker book. The 0.5 level route moved to
// /start/ unchanged.
export default function Cover() {
  const journey = getJourney();
  const book = getBook();
  const works = book.chapters.flatMap((c) => c.works);

  // "04, 09 and 10": the chapters holding a work with a level.
  const withLevel = book.chapters.filter((c) => !c.appendix && c.works.some((w) => w.level)).map((c) => c.id);
  const chapters = withLevel.length > 1 ? `${withLevel.slice(0, -1).join(", ")} and ${withLevel.at(-1)}` : withLevel.join("");

  const dates = works.map((w) => w.checkedOn).sort();
  const checked =
    dates[0] === dates.at(-1) ? `checked ${formatDate(dates[0])}` : `checked ${formatDate(dates[0])} to ${formatDate(dates.at(-1)!)}`;

  return (
    <main className={`soft-fade pt-6 ${TAB_BAR_SPACE}`}>
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">The Louvre · Paris</p>
            <h1 className="mt-1.5 font-hand text-[2.75rem] font-bold leading-[0.95]">
              Louvre
              <br />
              Before You Go
            </h1>
          </div>
          <LouvreDoodle className="h-12 w-16 shrink-0" />
        </div>
        <UnderlineDoodle className="mt-1 h-3 w-48" />
        <p className="mt-3 text-[16.5px] leading-[1.6] text-[#3d3a35]">
          The Louvre is home to treasures from across the world and across thousands of years. Meet 100 of its
          masterpieces, and the stories behind them, before you go.
        </p>
      </header>

      <div className="mt-5 grid gap-2.5">
        <Link href="/map/" className="btn-primary w-full">
          Open the map
        </Link>
        <Link href="/contents/" className="btn-option justify-center font-bold">
          Contents
        </Link>
      </div>

      <TrailCard items={journey} roundIds={getChallenge().map((r) => r.id)} chapters={chapters} />

      <StickerBook chapters={book.chapters} />

      <footer className="mt-7 border-t-[1.5px] border-line pt-3 text-[13px] leading-normal text-muted">
        <p>
          Rooms and display status from each work&apos;s collections.louvre.fr record, {checked}. Rooms change; check
          before you go.
        </p>
        <Link href="/about/" className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline">
          About &amp; sources
        </Link>
      </footer>

      <TabBar active="cover" />
    </main>
  );
}
