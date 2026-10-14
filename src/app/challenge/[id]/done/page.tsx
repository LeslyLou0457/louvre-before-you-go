import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoundCleared from "@/components/RoundCleared";
import { getRound, getRounds, getTrailRounds, mergeLines } from "@/lib/challenge";
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
  // The trail's rounds go on to the next trail round; a chapter's round returns to its chapter.
  const trail = getTrailRounds();
  const at = trail.findIndex((r) => r.lesson.id === round.lesson.id);
  const next = at >= 0 ? trail[at + 1] : undefined;
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
      onTrail={at >= 0}
      narrator={round.lesson.narrator ? round.speakers[round.lesson.narrator] : undefined}
    />
  );
}
