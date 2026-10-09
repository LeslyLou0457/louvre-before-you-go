import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoundCleared from "@/components/RoundCleared";
import { getRound, getRounds, mergeLines } from "@/lib/challenge";
import { museumLink, getLevel } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRounds().map((r) => ({ id: r.lesson.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const round = getRound((await params).id);
  return { title: round ? `Close-up cleared: ${round.artwork.title} · Louvre Before You Go` : "Louvre Before You Go" };
}

export default async function ChallengeDonePage({ params }: Params) {
  const round = getRound((await params).id);
  if (!round) notFound();
  const next = getRounds()[round.index + 1];
  const level = getLevel(round.levelId);
  return (
    <RoundCleared
      id={round.lesson.id}
      pool={round.lesson.pool}
      roundSize={round.lesson.roundSize}
      merges={mergeLines(round)}
      artwork={round.artwork}
      museumUrl={level ? museumLink(level) : undefined}
      next={next ? { id: next.lesson.id, title: next.artwork.title } : undefined}
    />
  );
}
