import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { getLevel, getLevels, museumLink } from "@/lib/content";

// Static export: one page per level, generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getLevels().map((l) => ({ id: l.lesson.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const level = getLevel((await params).id);
  return { title: level ? `${level.artwork.title} · Louvre Before You Go` : "Louvre Before You Go" };
}

export default async function LessonPage({ params }: Params) {
  const level = getLevel((await params).id);
  if (!level) notFound();
  return (
    <LessonPlayer
      lesson={level.lesson}
      artwork={level.artwork}
      speakers={level.speakers}
      imageAvailable={level.imageAvailable}
      museumUrl={museumLink(level)}
      questionCount={level.questionCount}
    />
  );
}
