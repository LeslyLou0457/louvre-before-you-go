"use client";

// Plays one Close-Up Challenge round (PRODUCT.md "Close-Up Challenge"): two
// questions from the artwork's pool, picked by the play counter (play k shows
// pool items 2k and 2k+1). Each question is the usual loop, intro → question
// → branch (with its correction card on a wrong pick) → merge line, while the
// zoomed crop and the "see where" thumbnail stay on screen. The spot is saved
// like a level's, so leaving or reloading resumes it.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Artwork from "./Artwork";
import Correction from "./Correction";
import Locator from "./Locator";
import ProgressBar from "./ProgressBar";
import Stage from "./Stage";
import { CloseDoodle } from "@/doodles";
import { clearPlace, finishRound, getPlace, getPlays, savePlace } from "@/lib/progress";
import { roundPair } from "@/lib/rotation";
import type { Artwork as ArtworkT, ChallengeLesson, LessonNode, Speaker, StoryNode, ZoomImage } from "@/lib/types";

type Props = {
  lesson: ChallengeLesson;
  artwork: ArtworkT;
  speakers: Record<string, Speaker>;
  zoomImage: ZoomImage;
};

/** Every node id of one question: intro, question, its branches, merge line. */
function family(nodes: Record<string, LessonNode>, start: string): string[] {
  const q = nodes[`${start}q`];
  const branches = q?.type === "question" ? q.choices.map((c) => c.next) : [];
  return [start, `${start}q`, ...branches, `${start}m`];
}

export default function ChallengePlayer({ lesson, artwork, speakers, zoomImage }: Props) {
  const router = useRouter();
  const [pair, setPair] = useState<string[]>(() => roundPair(lesson.pool, 0, lesson.roundSize));
  const [nodeId, setNodeId] = useState(lesson.pool[0]);
  const [answered, setAnswered] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [resumed, setResumed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const total = pair.length;

  // Which pair this play shows, then pick up a saved spot inside that pair.
  useEffect(() => {
    const p = roundPair(lesson.pool, getPlays(lesson.id), lesson.roundSize);
    setPair(p);
    const ids = p.flatMap((s) => family(lesson.nodes, s));
    const place = getPlace(lesson.id, ids, p.length);
    if (place && (place.node !== p[0] || place.answered > 0)) {
      setNodeId(place.node);
      setAnswered(place.answered);
      setPicked(place.picked);
      setResumed(true);
    } else {
      setNodeId(p[0]);
    }
    setReady(true);
  }, [lesson]);

  useEffect(() => {
    if (!ready) return;
    if (nodeId === pair[0] && answered === 0) clearPlace(lesson.id);
    else savePlace(lesson.id, { node: nodeId, answered, picked });
  }, [ready, lesson, pair, nodeId, answered, picked]);

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, [nodeId]);

  const qIndex = Math.max(
    0,
    pair.findIndex((s) => family(lesson.nodes, s).includes(nodeId)),
  );
  const start = pair[qIndex];
  const zoom = useMemo(() => (lesson.nodes[start] as StoryNode).zoom!, [lesson, start]);
  const node = lesson.nodes[nodeId];
  const onQuestion = node.type === "question";
  const isMerge = nodeId === `${start}m`;
  const lastQuestion = qIndex === total - 1;
  const current = Math.min(answered + (onQuestion ? 1 : 0), total) || 1;
  const question = lesson.nodes[`${start}q`];
  const sources = question?.type === "question" ? (question.sources ?? []) : [];
  const narrator = lesson.narrator ? speakers[lesson.narrator] : undefined;

  // Crop shape decides the layout: wide crops get the full width.
  const cropAspect = (zoom.w * zoomImage.width) / (zoom.h * zoomImage.height);
  const wide = cropAspect > 1.25;

  function startOver() {
    clearPlace(lesson.id);
    setNodeId(pair[0]);
    setAnswered(0);
    setPicked(null);
    setResumed(false);
  }

  function go(next: string | undefined) {
    if (next) {
      setNodeId(next);
      if (lesson.nodes[next]?.type !== "branch") setPicked(null);
      return;
    }
    if (!lastQuestion) {
      setNodeId(pair[qIndex + 1]);
      setPicked(null);
      return;
    }
    finishRound(lesson.id);
    router.push(`/challenge/${lesson.id}/done/`);
  }

  function choose(label: string, next: string) {
    setAnswered((n) => n + 1);
    setPicked(label);
    go(next);
  }

  const crop = (
    <Artwork
      key={zoom.image}
      image={zoom.image}
      title={`${artwork.title} (detail)`}
      artist={artwork.artist}
      alt={`${artwork.title}, detail: ${zoom.label}`}
      available
      maxHeightClass={wide ? "max-h-[24dvh]" : "max-h-[34dvh]"}
      className={wide ? "w-full" : "w-[60%] shrink-0"}
    />
  );
  const locator = (
    <Locator
      overview={zoomImage.overview}
      width={zoomImage.width}
      height={zoomImage.height}
      zoom={zoom}
      title={artwork.title}
      maxHeightClass={wide ? "max-h-[13dvh]" : "max-h-[19dvh]"}
    />
  );
  const caption = (
    <p className="text-[13px] leading-snug text-muted">
      Detail of <i className="text-ink">{artwork.title}</i>
      <br />
      {zoom.label}
    </p>
  );

  return (
    <main className="flex min-h-dvh flex-col pb-6">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-paper py-3">
        <Link
          href="/"
          aria-label="Exit round"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mat"
        >
          <CloseDoodle className="h-6 w-6" />
        </Link>
        <div className={`flex flex-1 ${ready ? "" : "invisible"}`}>
          <ProgressBar current={current} answered={answered} total={total} />
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

      {/* The museum: the zoomed crop on its mat, and where it sits in the whole work. */}
      <section aria-label="Artwork detail" className={ready ? "" : "invisible"}>
        {wide ? (
          <>
            {crop}
            <div className="mt-2 flex items-start gap-3">
              <div className="w-[38%] shrink-0">{locator}</div>
              <div className="min-w-0 flex-1 pt-1">{caption}</div>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-3">
            {crop}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {locator}
              {caption}
            </div>
          </div>
        )}
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
          <>
            <button type="button" onClick={() => go(node.next)} className="flex flex-col gap-4 text-left">
              <Stage narrator={narrator} speakers={speakers} />
              {qIndex === 0 && nodeId === start && (
                <span className="font-hand text-xl font-bold leading-tight text-muted">{lesson.title}</span>
              )}
              {node.type === "branch" && picked && (
                <span className="flex flex-wrap items-center gap-2 font-hand text-lg text-muted">
                  You picked
                  <span className="btn-option min-h-0 w-auto border-ultramarine py-0.5 text-lg">{picked}</span>
                </span>
              )}
              <p>{node.text}</p>
              {node.type === "branch" && node.correction && <Correction correction={node.correction} />}
            </button>
            {isMerge && sources.length > 0 && (
              <div className="border-t border-line pt-2 text-sm leading-snug">
                <h3 className="font-hand text-lg font-bold">Sources</h3>
                <ul className="mt-1 flex flex-col gap-1">
                  {sources.map((s) => (
                    <li key={s.url + s.title}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ultramarine underline">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="button" onClick={() => go(node.next)} className="btn-primary mt-auto self-end">
              {node.next ? "Continue →" : lastQuestion ? "Finish round" : "Next close-up →"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
