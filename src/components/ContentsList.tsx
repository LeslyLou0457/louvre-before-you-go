"use client";

// The contents page (PRODUCT.md "Structure and navigation", "Contents"): the
// 15 chapters and the appendix, each with its wings and floors, its progress
// and its room range on the right like page numbers in a book, and a wing
// filter. The whole row is the link to the chapter.

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProgressDots } from "./WorkBits";
import { summary, workState } from "@/lib/book";
import { useProgress } from "@/lib/book-progress";
import type { Book } from "@/lib/catalogue";
import type { WingId } from "@/lib/types";

export default function ContentsList({ book }: { book: Book }) {
  const all = useMemo(() => book.chapters.flatMap((c) => c.works), [book]);
  const progress = useProgress(all);
  const [wing, setWing] = useState<WingId | null>(null);

  const chapters = book.chapters.filter((c) => !wing || c.wings.includes(wing));

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by wing">
        {[{ id: null, name: "All" }, ...book.wings].map((w) => (
          <button
            key={w.name}
            type="button"
            aria-pressed={wing === w.id}
            onClick={() => setWing(w.id)}
            className={`wobbly min-h-11 border-2 border-ink px-3.5 font-hand text-[1.2rem] font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine ${
              wing === w.id ? "bg-ultramarine text-white" : "bg-mat"
            }`}
          >
            {w.name}
          </button>
        ))}
      </div>

      <ol className="mt-3">
        {chapters.map((c) => {
          const states = c.works.map((w) => workState(w, progress));
          const closed = c.status === "rooms-closed";
          const page = closed ? "closed" : c.roomRange || "—";
          return (
            <li key={c.id} className="border-t-[1.5px] border-line first:border-t-0">
              <Link
                href={`/chapter/${c.id}/`}
                className="grid min-h-16 w-full grid-cols-[40px_1fr] gap-2.5 py-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine"
              >
                <span
                  className={`font-hand text-[1.75rem] font-bold leading-none tabular-nums ${closed ? "text-muted" : "text-ultramarine"}`}
                >
                  <span className="sr-only">{c.appendix ? "Appendix" : "Chapter"} </span>
                  <span aria-hidden={c.appendix}>{c.number}</span>
                </span>
                <span className="min-w-0">
                  <span className="flex min-w-0 items-baseline gap-1.5">
                    <span className={`min-w-0 font-hand text-[1.3rem] font-bold leading-[1.05] ${closed ? "text-muted" : ""}`}>
                      {c.title}
                    </span>
                    <span aria-hidden="true" className="min-w-3 flex-1 -translate-y-1 border-b-2 border-dotted border-[#a8a091]" />
                    <span className="whitespace-nowrap font-hand text-[1.2rem] font-bold tabular-nums">
                      <span className="sr-only">{closed ? ", rooms " : c.roomRange ? ", rooms " : ""}</span>
                      {page === "—" ? <span aria-hidden="true">—</span> : page}
                    </span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] leading-snug text-muted">
                    <span>{c.wingsFloors || (closed ? "Rooms closed" : "")}</span>
                    <ProgressDots states={states} />
                    <span>{c.works.length ? summary(states) : "0 works"}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
