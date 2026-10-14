"use client";

// The sticker book on the cover (PRODUCT.md "Progress, 'Next up' and seals":
// "the sticker book on the cover shows all 100 works with honest counts").
// One mark per work, chapter by chapter, in module order; the same five
// states as the chapter dots. The whole book is one link to the contents,
// with its counts as the spoken name; the legend says the same in words, so
// state is never colour alone.

import Link from "next/link";
import { useMemo } from "react";
import { workState, type WorkState } from "@/lib/book";
import { useProgress } from "@/lib/book-progress";
import type { BookChapter } from "@/lib/catalogue";

const WORDS: [WorkState, string][] = [
  ["met", "met"],
  ["cont", "in progress"],
  ["ready", "ready"],
  ["soon", "coming soon"],
  ["off", "not on view"],
];

export default function StickerBook({ chapters }: { chapters: BookChapter[] }) {
  const all = useMemo(() => chapters.flatMap((c) => c.works), [chapters]);
  const progress = useProgress(all);
  const rows = chapters.map((c) => ({ chapter: c, states: c.works.map((w) => workState(w, progress)) }));
  const counts = new Map<WorkState, number>(WORDS.map(([s]) => [s, 0]));
  for (const r of rows) for (const s of r.states) counts.set(s, (counts.get(s) ?? 0) + 1);
  const spoken = WORDS.map(([s, word]) => `${counts.get(s)} ${word}`).join(", ");

  return (
    <section className="mt-7" aria-labelledby="sticker-title">
      <h2 id="sticker-title" className="font-hand text-[1.65rem] font-bold leading-none">
        Your sticker book
      </h2>
      <p className="mt-1 text-sm text-muted">One mark per work, chapter by chapter.</p>
      <Link
        href="/contents/"
        aria-label={`Your sticker book, all ${all.length} works: ${spoken}. Open the contents.`}
        className="mt-2 block py-1 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ultramarine"
      >
        <span className="grid gap-[5px]" aria-hidden="true">
          {rows.map(({ chapter, states }) => (
            <span key={chapter.id} className="grid grid-cols-[30px_1fr] items-center gap-1.5">
              <span className="text-right font-hand text-[1.05rem] font-bold leading-none tabular-nums text-muted">
                {chapter.number}
              </span>
              <span className="stickers">
                {states.length ? (
                  states.map((s, i) => <i key={i} className={s} />)
                ) : (
                  <span className="sticker-empty">{chapter.status === "rooms-closed" ? "rooms closed" : "no works yet"}</span>
                )}
              </span>
            </span>
          ))}
        </span>
      </Link>
      <p className="stickers-legend mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] leading-snug text-muted" aria-hidden="true">
        {WORDS.map(([s, word]) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <i className={s} />
            {counts.get(s)} {word}
          </span>
        ))}
      </p>
    </section>
  );
}
