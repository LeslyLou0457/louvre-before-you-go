import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MuseumLabel from "@/components/MuseumLabel";
import ClearedNext, { type ChapterLevels } from "@/components/ClearedNext";
import type { CSSProperties } from "react";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { Head } from "@/doodles/avatars";
import { getBook } from "@/lib/catalogue";
import { getRoundForLevel } from "@/lib/challenge";
import { getLevel, getLevels, museumLink, narratorOf, nextTrailLevel } from "@/lib/content";
import { isTrailLevel } from "@/lib/trail";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLevels().map((l) => ({ id: l.lesson.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const level = getLevel((await params).id);
  return { title: level ? `Level cleared: ${level.artwork.title} · Louvre Before You Go` : "Louvre Before You Go" };
}

export default async function DonePage({ params }: Params) {
  const level = getLevel((await params).id);
  if (!level) notFound();
  // The next trail level, used when the level is played on the trail; the
  // chapter's levels, used for chapter levels and for trail levels opened
  // from a chapter (ClearedNext picks by the URL's `?from` and progress).
  const trail = isTrailLevel(level.lesson.id);
  const nextTrail = nextTrailLevel(level);
  const chapters: ChapterLevels[] = getBook()
    .chapters.map((c) => ({
      id: c.id,
      levels: c.works.flatMap((w) => (w.level ? [{ levelId: w.level.id, title: w.title }] : [])),
    }))
    .filter((c) => c.levels.length > 0);
  const chapter = chapters.find((c) => c.levels.some((l) => l.levelId === level.lesson.id));
  const narrator = narratorOf(level);

  return (
    <main className="soft-fade flex min-h-dvh flex-col gap-6 py-8">
      {/* The small celebration (PRODUCT.md "Motion"): the narrator hops once,
          the stars pop in, the underline draws itself. No confetti. Buttons work at once. */}
      {narrator && (
        <div className="flex justify-center">
          <Head speaker={narrator} size={52} mood="hop" />
        </div>
      )}
      <div className="flex items-end justify-center gap-2" aria-hidden="true">
        <StarDoodle className="m-star h-10 w-10 -rotate-12" style={{ "--i": 1 } as CSSProperties} />
        <StarDoodle className="m-star h-16 w-16" style={{ "--i": 0 } as CSSProperties} />
        <StarDoodle className="m-star h-10 w-10 rotate-12" style={{ "--i": 2 } as CSSProperties} />
      </div>
      <div className="text-center">
        <h1 className="font-hand text-[2.4rem] font-bold leading-none">Level cleared!</h1>
        <UnderlineDoodle className="mx-auto mt-1 h-3 w-40" draw />
      </div>

      <section className="m-takeaway wobbly-alt border-[2.5px] border-ink bg-mat px-5 py-4">
        <h2 className="font-hand text-2xl font-bold">One thing to remember today</h2>
        <p className="mt-2">{level.lesson.takeaway}</p>
      </section>

      {/* Wrapped so the label keeps its own height instead of stretching to fill the column. */}
      <div>
        <MuseumLabel artwork={level.artwork} museumUrl={museumLink(level)} />
      </div>

      <ClearedNext
        levelId={level.lesson.id}
        trail={trail}
        trailNext={nextTrail ? { title: nextTrail.artwork.title, href: `/lesson/${nextTrail.lesson.id}/` } : undefined}
        chapter={chapter}
        chapters={chapters}
        hasRound={!!getRoundForLevel(level.lesson.id)}
      />
    </main>
  );
}
