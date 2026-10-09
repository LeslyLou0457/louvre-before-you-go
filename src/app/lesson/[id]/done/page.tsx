import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MuseumLabel from "@/components/MuseumLabel";
import { StarDoodle, UnderlineDoodle } from "@/doodles";
import { getLevel, getLevels, museumLink } from "@/lib/content";

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
  const next = getLevels()[level.index + 1];

  return (
    <main className="soft-fade flex min-h-dvh flex-col gap-6 py-8">
      {/* The small, still celebration: stickers, no motion, no confetti. */}
      <div className="flex items-end justify-center gap-2" aria-hidden="true">
        <StarDoodle className="h-10 w-10 -rotate-12" />
        <StarDoodle className="h-16 w-16" />
        <StarDoodle className="h-10 w-10 rotate-12" />
      </div>
      <div className="text-center">
        <h1 className="font-hand text-[2.4rem] font-bold leading-none">Level cleared!</h1>
        <UnderlineDoodle className="mx-auto mt-1 h-3 w-40" />
      </div>

      <section className="wobbly-alt border-[2.5px] border-ink bg-mat px-5 py-4">
        <h2 className="font-hand text-2xl font-bold">One thing to remember today</h2>
        <p className="mt-2">{level.lesson.takeaway}</p>
      </section>

      {/* Wrapped so the label keeps its own height instead of stretching to fill the column. */}
      <div>
        <MuseumLabel artwork={level.artwork} museumUrl={museumLink(level)} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        {next ? (
          <p className="text-center font-hand text-xl">
            Unlocked: <span className="font-bold">{next.artwork.title}</span>
          </p>
        ) : (
          <p className="text-center font-hand text-xl">That was the last one. You&apos;re ready for the Louvre.</p>
        )}
        <Link href="/" className="btn-primary w-full">
          Back to the journey
        </Link>
        {next && (
          <Link href={`/lesson/${next.lesson.id}/`} className="font-hand text-lg text-ultramarine underline">
            Start the next level now
          </Link>
        )}
      </div>
    </main>
  );
}
