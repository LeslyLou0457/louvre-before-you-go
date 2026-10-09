"use client";

// Plays one level: story → question → branch → back to the main line, five
// times. A wrong pick is never shown as wrong (no red); it simply opens its
// branch. The player's spot is saved to localStorage as they go (lib/progress),
// so leaving or reloading mid-level resumes it, with a "Start over" link.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Artwork from "./Artwork";
import MuseumLabel from "./MuseumLabel";
import ProgressBar from "./ProgressBar";
import Stage from "./Stage";
import { CloseDoodle } from "@/doodles";
import { clearPlace, getPlace, markComplete, savePlace } from "@/lib/progress";
import type { Artwork as ArtworkT, Lesson, Speaker } from "@/lib/types";

type Props = {
  lesson: Lesson;
  artwork: ArtworkT;
  speakers: Record<string, Speaker>;
  imageAvailable: boolean;
  museumUrl?: string;
  questionCount: number;
};

export default function LessonPlayer({ lesson, artwork, speakers, imageAvailable, museumUrl, questionCount }: Props) {
  const router = useRouter();
  const [nodeId, setNodeId] = useState(lesson.start);
  const [answered, setAnswered] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  // `ready` is false until the saved spot has been read, so the first passage
  // doesn't flash before jumping to the saved one.
  const [ready, setReady] = useState(false);
  const [resumed, setResumed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Pick up where the player left off. A spot whose node no longer exists in
  // the content is ignored (getPlace returns null) and the level starts over.
  useEffect(() => {
    const place = getPlace(lesson.id, Object.keys(lesson.nodes), questionCount);
    if (place && (place.node !== lesson.start || place.answered > 0)) {
      setNodeId(place.node);
      setAnswered(place.answered);
      setPicked(place.picked);
      setResumed(true);
    }
    setReady(true);
  }, [lesson, questionCount]);

  // Save the spot after every step; nothing to keep while still on the first passage.
  useEffect(() => {
    if (!ready) return;
    if (nodeId === lesson.start && answered === 0) clearPlace(lesson.id);
    else savePlace(lesson.id, { node: nodeId, answered, picked });
  }, [ready, lesson, nodeId, answered, picked]);

  function startOver() {
    clearPlace(lesson.id);
    setNodeId(lesson.start);
    setAnswered(0);
    setPicked(null);
    setResumed(false);
  }

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

  const narrator = lesson.narrator ? speakers[lesson.narrator] : undefined;

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
        <div className={`flex flex-1 ${ready ? "" : "invisible"}`}>
          <ProgressBar current={current} answered={answered} total={questionCount} />
        </div>
      </header>

      {resumed && (
        <p className="-mt-1 mb-3 flex flex-wrap items-baseline gap-x-3 font-hand text-lg text-muted">
          Picked up where you left off.
          <button type="button" onClick={startOver} className="font-hand text-lg text-ultramarine underline">
            Start over
          </button>
        </p>
      )}

      {/* The museum: photo on its mat, printed label beside it. */}
      <section aria-label="Artwork" className="flex items-start gap-3">
        <Artwork
          image={artwork.image}
          title={artwork.title}
          artist={artwork.artist}
          available={imageAvailable}
          className="w-[56%] shrink-0"
        />
        <MuseumLabel artwork={artwork} museumUrl={museumUrl} small />
      </section>

      <section
        key={nodeId}
        ref={cardRef}
        tabIndex={-1}
        aria-live="polite"
        className={`soft-fade mt-4 flex flex-1 flex-col gap-4 outline-none ${ready ? "" : "invisible"}`}
      >
        {node.type === "question" ? (
          <>
            <Stage narrator={narrator} speakers={speakers} />
            <h2 className="font-hand text-[1.75rem] font-bold leading-tight">{node.text}</h2>
            <div className="flex flex-col gap-3">
              {node.choices.map((c) => (
                <button key={c.next + c.label} type="button" className="btn-option" onClick={() => choose(c.label, c.next)}>
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => go(node.next)} className="flex flex-1 flex-col gap-4 text-left">
            <Stage narrator={narrator} voice={node.voice} speakers={speakers} />
            {node.type === "branch" && picked && (
              <span className="flex flex-wrap items-center gap-2 font-hand text-lg text-muted">
                You picked
                <span className="btn-option min-h-0 w-auto border-ultramarine py-0.5 text-lg">{picked}</span>
              </span>
            )}
            <p>{node.text}</p>
            <span className="btn-primary mt-auto self-end">{node.next ? "Continue →" : "Finish level"}</span>
          </button>
        )}
      </section>
    </main>
  );
}
