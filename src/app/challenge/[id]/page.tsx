import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengePlayer from "@/components/ChallengePlayer";
import { getRound, getRounds } from "@/lib/challenge";

// Static export: one page per Close-Up Challenge round, generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getRounds().map((r) => ({ id: r.lesson.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const round = getRound((await params).id);
  return { title: round ? `Close-up: ${round.artwork.title} · Louvre Before You Go` : "Louvre Before You Go" };
}

export default async function ChallengePage({ params }: Params) {
  const round = getRound((await params).id);
  if (!round) notFound();
  return (
    <ChallengePlayer lesson={round.lesson} artwork={round.artwork} speakers={round.speakers} zoomImage={round.zoomImage} />
  );
}
