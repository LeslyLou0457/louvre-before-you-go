"use client";

// One chapter (a module) or the appendix (PRODUCT.md "Structure and
// navigation", "Order" and "Status"). Works sit under room headings in the
// catalogue's module order; works not on view come last under "Not on view
// right now". A work with a level is a link to that level; any other work
// opens its museum label. The first unmet level is marked "Next up".
// Progress is read from the existing keys only (lib/book-progress).

import Link from "next/link";
import { useState } from "react";
import LabelSheet from "./LabelSheet";
import { PhotoTile, ProgressDots, StatusChip } from "./WorkBits";
import { BackDoodle, NextDoodle } from "@/doodles";
import { floorLabel, formatDate, isOffView, nextUpId, summary, workState, type Progress } from "@/lib/book";
import { useProgress } from "@/lib/book-progress";
import type { BookChapter, BookWork } from "@/lib/catalogue";

type Group = { key: string; works: BookWork[] };

/** Consecutive on-view works sharing a room (or a numberless place), in module order. */
function roomGroups(works: BookWork[]): Group[] {
  const groups: Group[] = [];
  for (const w of works) {
    const key = w.location?.room ?? w.location?.place ?? "TBD";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.works.push(w);
    else groups.push({ key, works: [w] });
  }
  return groups;
}

export default function ChapterView({ chapter }: { chapter: BookChapter }) {
  const progress = useProgress(chapter.works);
  const [open, setOpen] = useState<BookWork | null>(null);

  const states = chapter.works.map((w) => workState(w, progress));
  const nextUp = nextUpId(chapter.works, states);
  const onView = chapter.works.filter((w) => !isOffView(w));
  const offView = chapter.works.filter((w) => isOffView(w));
  const name = chapter.appendix ? "Appendix" : `Chapter ${chapter.id}`;
  const closed = chapter.status === "rooms-closed";

  const meta = [
    chapter.wingsFloors || (closed ? "Rooms closed" : ""),
    chapter.roomRange ? `${chapter.roomRange.includes("–") ? "Rooms" : "Room"} ${chapter.roomRange}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const row = (w: BookWork) => (
    <WorkRow key={w.id} work={w} progress={progress} nextUp={w.id === nextUp} onOpen={() => setOpen(w)} />
  );

  return (
    <main className="soft-fade pb-10">
      <div className="sticky top-0 z-10 -mx-4 flex min-h-[52px] items-center gap-1.5 bg-paper px-2 py-1">
        <Link href="/contents/" aria-label="Back to contents" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
          <BackDoodle className="h-[26px] w-[26px]" />
        </Link>
        <span className="min-w-0 flex-1 truncate font-hand text-[1.4rem] font-bold">{name}</span>
      </div>

      <header className="pt-2">
        <p className="font-hand text-[3.75rem] font-bold leading-[0.8] text-ultramarine" aria-hidden="true">
          {chapter.number}
        </p>
        <h1 className="mb-1 mt-1.5 font-hand text-[1.95rem] font-bold leading-[1.02] [text-wrap:balance]">
          <span className="sr-only">{name}: </span>
          {chapter.title}
        </h1>
        {meta && <p className="text-sm text-muted">{meta}</p>}
        {chapter.works.length > 0 && (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm leading-normal">
            <ProgressDots states={states} />
            <span className="text-muted">{summary(states)}</span>
          </p>
        )}
        {chapter.works.length > 0 && (
          <p className="wobbly-alt mt-3 bg-stage px-3 py-2.5 text-[13.5px] leading-normal text-[#3d3a35]">
            {chapter.appendix
              ? "Works that fit no chapter: the Gallery of Five Continents (room and display not confirmed) and drawings seen by appointment only."
              : "Listed by room number, like page numbers. It is not a walking route: stairs, passages and closed rooms can change the way. Check on the day."}
          </p>
        )}
      </header>

      {closed && (
        <div className="wobbly-alt mt-5 border-2 border-dashed border-[#a8a091] p-4">
          <p className="font-hand text-[1.4rem] font-bold leading-tight">These rooms are closed for now.</p>
          <p className="mt-1.5 text-sm text-muted">
            {chapter.closedNote}
            {chapter.checkedOn && <> when we checked on {formatDate(chapter.checkedOn)}</>}. No work on our list hangs
            there right now; this chapter keeps its number and gets its works when the rooms reopen.
          </p>
        </div>
      )}

      {roomGroups(onView).map((g, i) => {
        const l = g.works[0].location;
        const numbered = !!l?.room;
        return (
          <section key={g.key} className="mt-5" aria-labelledby={`room-${i}`}>
            <div className="flex flex-wrap items-baseline gap-x-2 border-b-[1.5px] border-dashed border-[#b9b09f] pb-1.5">
              <h2 id={`room-${i}`} className="font-hand text-2xl font-bold leading-none">
                {numbered ? `Room ${g.key}` : g.key}
              </h2>
              {l && (
                <span className="text-[12.5px] text-muted">
                  {numbered && l.roomName && (
                    <>
                      <span lang="fr">{l.roomName}</span> ·{" "}
                    </>
                  )}
                  {l.wingName} · Level {floorLabel(l.floor)}
                </span>
              )}
            </div>
            <ul>{g.works.map(row)}</ul>
          </section>
        );
      })}

      {offView.length > 0 && (
        <section className="mt-5" aria-labelledby="room-off">
          <div className="flex flex-wrap items-baseline gap-x-2 border-b-[1.5px] border-dashed border-[#b9b09f] pb-1.5">
            <h2 id="room-off" className="font-hand text-2xl font-bold leading-none">
              Not on view right now
            </h2>
            <span className="text-[12.5px] text-muted">listed last, with the reason</span>
          </div>
          <ul>{offView.map(row)}</ul>
        </section>
      )}

      <LabelSheet work={open} eyebrow={name} onClose={() => setOpen(null)} />
    </main>
  );
}

function WorkRow({ work, progress, nextUp, onOpen }: { work: BookWork; progress: Progress; nextUp: boolean; onOpen: () => void }) {
  const state = workState(work, progress);
  const body = (
    <>
      <PhotoTile work={work} />
      <span className="min-w-0">
        <span className="block font-hand text-[1.3rem] font-bold leading-[1.05]">{work.title}</span>
        <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">
          {work.artist} · {work.date}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          <StatusChip work={work} state={state} place={work.level ? progress.places[work.level.id] : null} />
          {nextUp && (
            <span className="inline-flex items-center gap-0.5 font-hand text-lg font-bold leading-none text-ultramarine">
              <NextDoodle className="h-4 w-4" /> Next up
            </span>
          )}
        </span>
      </span>
    </>
  );
  const cls =
    "grid min-h-16 w-full grid-cols-[72px_1fr] items-start gap-3 py-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine";
  return (
    <li className="border-b-[1.5px] border-line">
      {work.level ? (
        <Link href={`/lesson/${work.level.id}/`} className={cls}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onOpen} className={cls} aria-haspopup="dialog">
          {body}
        </button>
      )}
    </li>
  );
}
