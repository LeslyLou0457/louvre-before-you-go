"use client";

// Plays one level: story → question → branch → back to the main line, five
// times. A wrong pick is never shown as wrong (no red); it simply opens its
// branch. State lives only in memory, so leaving mid-level restarts it.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Artwork from "./Artwork";
import Line from "./Line";
import MuseumLabel from "./MuseumLabel";
import ProgressBar from "./ProgressBar";
import { CloseDoodle } from "@/doodles";
import { ArtistHead, findHead } from "@/doodles/heads";
import { markComplete } from "@/lib/progress";
import type { Artwork as ArtworkT, Lesson } from "@/lib/types";

type Props = {
  lesson: Lesson;
  artwork: ArtworkT;
  imageAvailable: boolean;
  museumUrl?: string;
  questionCount: number;
};

export default function LessonPlayer({ lesson, artwork, imageAvailable, museumUrl, questionCount }: Props) {
  const router = useRouter();
  const [nodeId, setNodeId] = useState(lesson.start);
  const [answered, setAnswered] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const node = lesson.nodes[nodeId];
  const onQuestion = node.type === "question";
  const current = Math.min(answered + (onQuestion ? 1 : 0), questionCount) || 1;

  // Bring the new passage into view on small screens.
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, [nodeId]);

  function go(next: string | undefined) {
    if (next) {
      setNodeId(next);
      if (lesson.nodes[next]?.type !== "branch") setPicked(null);
      return;
    }
    markComplete(lesson.id);
    router.push(`/lesson/${lesson.id}/done/`);
  }

  function choose(label: string, next: string) {
    setAnswered((n) => n + 1);
    setPicked(label);
    go(next);
  }

  const questionHead = onQuestion ? findHead(node.speaker) : null;

  return (
    <main className="flex min-h-dvh flex-col pb-6">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-paper py-3">
        <Link
          href="/"
          aria-label="Exit level"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mat"
        >
          <CloseDoodle className="h-6 w-6" />
        </Link>
        <ProgressBar current={current} answered={answered} total={questionCount} />
      </header>

      <section aria-label="Artwork" className="flex flex-col gap-3">
        <Artwork
          image={artwork.image}
          title={artwork.title}
          artist={artwork.artist}
          available={imageAvailable}
        />
        <MuseumLabel artwork={artwork} museumUrl={museumUrl} compact />
      </section>

      <section
        key={nodeId}
        ref={cardRef}
        tabIndex={-1}
        aria-live="polite"
        className="soft-fade mt-5 flex flex-1 flex-col gap-4 outline-none"
      >
        {node.type === "question" ? (
          <>
            <div className="flex items-start gap-3">
              {questionHead && <ArtistHead head={questionHead} size={48} />}
              <h2 className="font-hand text-[1.75rem] font-bold leading-tight">{node.text}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {node.choices.map((c) => (
                <button key={c.next + c.label} type="button" className="btn-option" onClick={() => choose(c.label, c.next)}>
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => go(node.next)}
            className="flex flex-1 flex-col gap-4 text-left"
          >
            {node.type === "branch" && picked && (
              <span className="font-hand text-lg text-muted">You picked: {picked}</span>
            )}
            <Line text={node.text} speaker={node.speaker} />
            <span className="btn-primary mt-auto self-end">{node.next ? "Continue →" : "Finish level"}</span>
          </button>
        )}
      </section>
    </main>
  );
}
