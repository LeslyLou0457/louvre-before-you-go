"use client";

// The work's museum label as a sheet over the chapter page (PRODUCT.md
// "Structure and navigation", "Work"). A native modal <dialog>: it takes
// focus, keeps it inside, and closes with Escape, the close button or a tap
// outside. The label itself is the museum layer: print type, straight edges.
// Facts come only from content/modules.json; anything it doesn't hold is "TBD".

import { useEffect, useRef } from "react";
import { CloseDoodle } from "@/doodles";
import { DISPLAY_TEXT, floorLabel, formatDate, isOffView } from "@/lib/book";
import type { BookWork } from "@/lib/catalogue";

type Props = {
  work: BookWork | null;
  /** "Chapter 09" or "Appendix". */
  eyebrow: string;
  onClose: () => void;
};

export default function LabelSheet({ work, eyebrow, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (work && !d.open) d.showModal();
    if (!work && d.open) d.close();
  }, [work]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-0 mx-auto mt-auto max-h-[86dvh] w-full max-w-[640px] overflow-y-auto rounded-t-[22px] border-x-0 border-b-0 border-t-[2.5px] border-ink bg-paper px-4 pb-5 pt-2 text-ink backdrop:bg-ink/30"
    >
      {work && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">{eyebrow}</span>
            <button
              type="button"
              autoFocus
              onClick={() => ref.current?.close()}
              className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-3 focus-visible:outline-ultramarine"
              aria-label="Close"
            >
              <CloseDoodle className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-1 border border-line bg-mat px-3.5 py-3 text-sm leading-normal">
            <p>{work.artist}</p>
            <h2 id="sheet-title" className="text-base font-extrabold italic">
              {work.title}
            </h2>
            <p>{work.date}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-0.5">
              <dt className="text-muted">Medium</dt>
              <dd className="min-w-0">{work.level?.medium ?? "TBD"}</dd>
              <dt className="text-muted">Where</dt>
              <dd className="min-w-0">
                <Where work={work} />
              </dd>
              <dt className="text-muted">Status</dt>
              <dd className="min-w-0">
                {DISPLAY_TEXT[work.display]}, checked {formatDate(work.checkedOn)}
                {work.displayNote && <span className="block text-muted">{work.displayNote}</span>}
              </dd>
              <dt className="text-muted">Collection</dt>
              <dd className="min-w-0">
                {work.department} · {work.inventory}
              </dd>
            </dl>
            {work.museumUrl ? (
              <a
                href={work.museumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-11 items-center text-ultramarine underline"
              >
                View at the Louvre&nbsp;→
              </a>
            ) : (
              <p className="mt-2 text-muted">No Louvre collections record for this work.</p>
            )}
          </div>

          {isOffView(work) ? (
            <>
              <p className="mt-3.5 font-hand text-[1.35rem] font-bold leading-tight">
                Not on view right now, and not written yet.
              </p>
              <p className="text-sm text-muted">It stays in its chapter so the book is complete. Off-view works are written last.</p>
            </>
          ) : (
            <>
              <p className="mt-3.5 font-hand text-[1.35rem] font-bold leading-tight">This level isn&apos;t written yet.</p>
              <p className="text-sm text-muted">It will appear here when its story is ready and checked.</p>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}

/** "Denon · Level 1 · Room 711 (Salle des États)"; French room names carry lang="fr". */
function Where({ work }: { work: BookWork }) {
  const l = work.location;
  if (!l) return <>Not on view right now</>;
  return (
    <>
      {l.wingName} · Level {floorLabel(l.floor)} · {l.room ? `Room ${l.room}` : l.place}
      {l.room && l.roomName && (
        <>
          {" ("}
          <span lang="fr">{l.roomName}</span>
          {")"}
        </>
      )}
    </>
  );
}
