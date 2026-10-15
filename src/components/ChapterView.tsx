"use client";

// One chapter (a module) or the appendix (PRODUCT.md "Structure and
// navigation", "Order" and "Status"). Works sit under room headings in the
// catalogue's module order; works not on view come last under "Not on view
// right now". A work with a level is a link to that level; any other work
// opens its museum label. The first unmet level is marked "Next up".
// Progress is read from the existing keys only (lib/book-progress).
// At the bottom, the chapter's close-up rounds in module order (PRODUCT.md
// "Close-ups per work"): each opens as soon as its work's level is met.
// A work with a level shows its narrator's head at the end of its row (still,
// like the heads on the trail card); works without a level show none.

import Link from "next/link";
import { useEffect, useState } from "react";
import LabelSheet from "./LabelSheet";
import TabBar, { TAB_BAR_SPACE } from "./TabBar";
import { PhotoTile, ProgressDots, StatusChip } from "./WorkBits";
import { BackDoodle, CheckDoodle, LockDoodle, NextDoodle, ZoomDoodle } from "@/doodles";
import { Avatar } from "@/doodles/avatars";
import { floorLabel, formatDate, isOffView, nextUpId, roundState, summary, workState, type Progress } from "@/lib/book";
import { useProgress } from "@/lib/book-progress";
import { FROM_CONTENTS, readChapterOrigin } from "@/lib/chapter-origin";
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
  // Back returns to where the chapter was opened from: the contents, or a wing and floor of the map.
  const [origin, setOrigin] = useState(FROM_CONTENTS);
  useEffect(() => setOrigin(readChapterOrigin()), []);

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
    <WorkRow key={w.id} chapterId={chapter.id} work={w} progress={progress} nextUp={w.id === nextUp} onOpen={() => setOpen(w)} />
  );

  return (
    <main className={`soft-fade ${TAB_BAR_SPACE}`}>
      <div className="sticky top-0 z-10 -mx-4 flex min-h-[52px] items-center gap-1.5 bg-paper px-2 py-1">
        <Link href={origin.href} aria-label={origin.label} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
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

      <CloseUps chapterId={chapter.id} works={chapter.works.filter((w) => w.round)} progress={progress} />

      <LabelSheet work={open} eyebrow={name} onClose={() => setOpen(null)} />
      <TabBar active={origin.tab} />
    </main>
  );
}

type RowProps = { chapterId: string; work: BookWork; progress: Progress; nextUp: boolean; onOpen: () => void };

function WorkRow({ chapterId, work, progress, nextUp, onOpen }: RowProps) {
  const state = workState(work, progress);
  const narrator = work.level?.narrator;
  const body = (
    <>
      <PhotoTile work={work} />
      <span className="min-w-0">
        <span className="block font-hand text-[1.3rem] font-bold leading-[1.05]">{work.title}</span>
        <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">
          {work.artist} · {work.date}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          <StatusChip
            work={work}
            state={state}
            place={work.level ? progress.places[work.level.id] : null}
            closeUpDone={!!work.round && progress.completed.has(work.round.id)}
          />
          {nextUp && (
            <span className="inline-flex items-center gap-0.5 font-hand text-lg font-bold leading-none text-ultramarine">
              <NextDoodle className="h-4 w-4" /> Next up
            </span>
          )}
        </span>
      </span>
      {narrator && (
        // Decorative: the artist is already named on the row.
        <span aria-hidden="true" className="pt-0.5">
          <Avatar speaker={narrator} size={40} />
        </span>
      )}
    </>
  );
  const cls =
    `grid min-h-16 w-full ${narrator ? "grid-cols-[72px_1fr_40px]" : "grid-cols-[72px_1fr]"} items-start gap-3 py-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine`;
  return (
    <li className="border-b-[1.5px] border-line">
      {work.level ? (
        // The level returns here when it is finished or left (lib/origin).
        <Link href={`/lesson/${work.level.id}/?from=${chapterId}`} className={cls}>
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

/** The chapter's close-up rounds, one per work that has one, in module order. */
function CloseUps({ chapterId, works, progress }: { chapterId: string; works: BookWork[]; progress: Progress }) {
  const [hint, setHint] = useState<{ id: string; n: number } | null>(null);
  if (works.length === 0) return null;
  return (
    <section className="mt-8" aria-labelledby="closeups">
      <div className="flex flex-wrap items-baseline gap-x-2 border-b-[1.5px] border-dashed border-[#b9b09f] pb-1.5">
        <h2 id="closeups" className="flex items-center gap-1.5 font-hand text-2xl font-bold leading-none">
          <ZoomDoodle className="h-6 w-6" /> Close-ups
        </h2>
        <span className="text-[12.5px] text-muted">harder questions on zoomed-in details; each opens once its level is met</span>
      </div>
      <ul>
        {works.map((w) => {
          const r = w.round!;
          const s = roundState(w, progress);
          const place = progress.places[r.id];
          const plays = progress.plays[r.id] ?? 0;
          const body = (
            <>
              <span
                className={`wobbly-circle flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink ${
                  s === "done" ? "bg-gold text-ink" : "bg-mat text-ink"
                } ${s === "locked" ? "opacity-45" : ""}`}
                aria-hidden="true"
              >
                {s === "locked" ? <LockDoodle className="h-5 w-5" /> : s === "done" ? <CheckDoodle className="h-6 w-6" /> : <ZoomDoodle className="h-6 w-6" />}
              </span>
              <span className="min-w-0">
                <span className={`block font-hand text-[1.3rem] font-bold leading-[1.05] ${s === "locked" ? "text-muted" : ""}`}>{w.title}</span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{r.title}</span>
                <span className="mt-2 flex flex-wrap items-center gap-1.5">
                  {s === "open" && (
                    <span className="chip chip-ready">
                      <ZoomDoodle /> Start
                    </span>
                  )}
                  {s === "cont" && (
                    <span className="chip chip-ready">
                      <ZoomDoodle /> Continue · {place?.answered ?? 0} of {r.roundSize}
                    </span>
                  )}
                  {s === "done" && (
                    // The only chip with a long hint: it may wrap so it never pushes the page sideways.
                    <span className="chip chip-met whitespace-normal py-1">
                      <CheckDoodle /> Close-up done{r.poolSize > r.roundSize ? ` · played ${Math.max(1, plays)}×, tap for the next questions` : ""}
                    </span>
                  )}
                  {s === "locked" && <span className="text-[13px] leading-snug text-muted">Meet the work first: finish its level</span>}
                </span>
              </span>
            </>
          );
          const cls =
            "grid min-h-16 w-full grid-cols-[48px_1fr] items-start gap-3 py-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine";
          return (
            <li key={r.id} className="border-b-[1.5px] border-line">
              {s === "locked" ? (
                <button
                  type="button"
                  className={cls}
                  aria-describedby={`closeup-hint-${r.id}`}
                  onClick={() => setHint((h) => ({ id: r.id, n: (h?.n ?? 0) + 1 }))}
                >
                  {body}
                </button>
              ) : (
                // The round returns here when it is finished or left (lib/origin).
                <Link href={`/challenge/${r.id}/?from=${chapterId}`} className={cls}>
                  {body}
                </Link>
              )}
              <p id={`closeup-hint-${r.id}`} aria-live="polite" className="pb-1 pl-[60px] font-hand text-lg text-muted">
                {hint?.id === r.id && (
                  <span key={hint.n} className="m-hint">
                    Finish the level of {w.title} first
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
