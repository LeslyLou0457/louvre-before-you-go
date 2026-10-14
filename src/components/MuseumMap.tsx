"use client";

// The map and the wing pages (PRODUCT.md "The map", "Structure and
// navigation": Map → Wing → Floor → Module). The drawing comes ready-made
// from src/doodles/map.ts; this component only makes it work:
// - the three wings are real buttons (role="button", keyboard, spoken name);
// - tapping one zooms the drawing to it with one CSS transform, fades the
//   other wings, and shows its floors, top floor first; picking a floor lists
//   its chapters, each a link to the chapter;
// - the URL follows: /map/denon/#level-1, so a wing and floor can be linked,
//   and the lists below hold everything the map does.
//
// Motion (PRODUCT.md "Motion" and its map exception): the ink draws itself on
// the first map visit of a session; the zoom is a compositor transform, and
// the chosen wing lifts only after the zoom lands; the idle loops pause while
// zoomed. Reduced motion: nothing moves and the zoom is instant (map.css).

import Link from "next/link";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProgressDots } from "./WorkBits";
import { NextDoodle } from "@/doodles";
import type { Box } from "@/doodles/map";
import { floorLabel, workState } from "@/lib/book";
import { useProgress } from "@/lib/book-progress";
import type { MapData, MapWing } from "@/lib/map-data";
import { withBase } from "@/lib/paths";
import type { WingId } from "@/lib/types";

/** The ink draws itself once per session: later visits (client-side) show it drawn. */
let drawnThisSession = false;

const reduceMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/** The floor with the most works on view: the one a wing opens on. */
function bestFloor(w: MapWing): number {
  return w.floors.reduce((best, f) => (f.works > best.works ? f : best), w.floors[0]).floor;
}

function floorFromHash(w: MapWing): number | null {
  const h = typeof window === "undefined" ? "" : window.location.hash.slice(1);
  return w.floors.find((f) => f.anchor === h)?.floor ?? null;
}

export default function MuseumMap({ data, initialWing }: { data: MapData; initialWing: WingId | null }) {
  const { drawing, wings } = data;
  const [wing, setWing] = useState<WingId | null>(initialWing);
  const [floor, setFloor] = useState<number | null>(() => {
    const w = wings.find((x) => x.id === initialWing);
    return w ? bestFloor(w) : null;
  });
  // Server render and a fresh load: draw in. A later client-side visit in the same session: already drawn.
  const [drawn] = useState(() => typeof window !== "undefined" && drawnThisSession);
  const wingRef = useRef<WingId | null>(initialWing);
  const boxRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const all = useMemo(() => data.chapters.flatMap((c) => c.works), [data.chapters]);
  const progress = useProgress(all);

  const current = wings.find((w) => w.id === wing) ?? null;

  // Zoom with a CSS transform on the whole drawing: the compositor scales it, nothing is redrawn per frame.
  const zoomTo = useCallback(
    (box: Box | null, instant: boolean) => {
      const z = zoomRef.current, c = boxRef.current;
      if (!z || !c) return;
      const [vx, vy, vw, vh] = drawing.viewBox;
      let t = "none";
      if (box) {
        const pad = 8;
        const bw = box.x1 - box.x0 + pad * 2, bh = box.y1 - box.y0 + pad * 2;
        const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
        const k = Math.min(2.1, vw / bw, vh / bh);
        const tx = Math.min(0, Math.max(vw - vw * k, vw / 2 - (cx - vx) * k));
        const ty = Math.min(0, Math.max(vh - vh * k, vh / 2 - (cy - vy) * k));
        t = `translate(${((tx / vw) * 100).toFixed(3)}%, ${((ty / vh) * 100).toFixed(3)}%) scale(${k.toFixed(4)})`;
      }
      const quick = instant || reduceMotion();
      // While the camera moves, every other map animation holds still, so each frame is only a compositor transform.
      if (!quick) c.classList.add("zooming");
      z.style.transition = quick ? "none" : "";
      z.style.willChange = "transform";
      z.style.transform = t;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        z.style.willChange = "auto";
        c.classList.remove("zooming");
      }, quick ? 30 : 600);
    },
    [drawing.viewBox],
  );

  // Mark the chosen wing in the drawing (its banner and labels too) and frame it.
  const frame = useCallback(
    (id: WingId | null, instant: boolean) => {
      const name = wings.find((w) => w.id === id)?.name ?? null;
      const z = zoomRef.current;
      if (!z) return;
      z.querySelectorAll<HTMLElement | SVGElement>("[data-w]").forEach((el) => {
        el.classList.toggle("dim", !!name && el.dataset.w !== name);
        el.classList.toggle("sel", el.dataset.w === name);
        if (el.getAttribute("role") === "button") el.setAttribute("aria-pressed", String(el.dataset.w === name));
      });
      boxRef.current?.classList.toggle("zoomed", !!name);
      zoomTo(name ? drawing.boxes[name] : null, instant);
    },
    [wings, drawing.boxes, zoomTo],
  );

  const choose = useCallback(
    (id: WingId | null, instant = false, fromHash = false) => {
      const w = wings.find((x) => x.id === id) ?? null;
      const f = w ? ((fromHash ? floorFromHash(w) : null) ?? bestFloor(w)) : null;
      wingRef.current = id;
      // Start the camera first; the lists below re-render in a transition, in small slices, so the zoom keeps its frames.
      frame(id, instant);
      startTransition(() => {
        setWing(id);
        setFloor(f);
      });
      try {
        const anchor = w?.floors.find((x) => x.floor === f)?.anchor;
        window.history.replaceState(window.history.state, "", withBase(w ? `/map/${w.id}/#${anchor}` : "/map/"));
      } catch {
        // The map still works; the address just doesn't follow.
      }
    },
    [wings, frame],
  );

  // First paint: the draw-in once per session, then the wing the page was opened on, framed at once.
  useEffect(() => {
    drawnThisSession = true;
    if (initialWing) choose(initialWing, true, true);
  }, [initialWing, choose]);

  // Wings and banners in the drawing are its buttons.
  useEffect(() => {
    const z = zoomRef.current;
    if (!z) return;
    const byName = (n: string | undefined) => wings.find((w) => w.name === n)?.id ?? null;
    const onClick = (e: Event) => {
      const el = (e.target as Element).closest<SVGElement>(".wing, .bn");
      if (!el) return;
      const id = byName(el.dataset.w);
      // Tapping the chosen wing again goes back to all three.
      choose(wingRef.current === id ? null : id);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = (e.target as Element).closest<SVGElement>(".wing");
      if (!el || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      choose(byName(el.dataset.w));
    };
    z.addEventListener("click", onClick);
    z.addEventListener("keydown", onKey);
    return () => {
      z.removeEventListener("click", onClick);
      z.removeEventListener("keydown", onKey);
    };
  }, [wings, choose]);

  const pickFloor = (f: number) => {
    setFloor(f);
    const anchor = current?.floors.find((x) => x.floor === f)?.anchor;
    try {
      window.history.replaceState(window.history.state, "", `#${anchor}`);
    } catch {
      // ignore
    }
  };

  const [vx, vy, vw, vh] = drawing.viewBox;
  const shown = current?.floors.find((f) => f.floor === floor) ?? null;

  return (
    <>
      <header className="pt-6">
        <h1 className="font-hand text-[2.15rem] font-bold leading-none">{current ? `${current.name} wing` : "Three wings"}</h1>
        <p className="mt-1 text-sm leading-normal text-muted" aria-live="polite">
          {current ? "Pick a level, then a chapter." : "Tap a wing to zoom in and see its levels."}
        </p>
      </header>

      <div className="-mx-4 mt-2.5">
        <div ref={boxRef} className={`lmap${drawn ? " drawn" : ""}`} style={{ aspectRatio: `${vw} / ${vh}`, ["--u" as string]: `calc(100cqw / ${vw})` }}>
          <div ref={zoomRef} className="mapz">
            <svg
              viewBox={`${vx} ${vy} ${vw} ${vh}`}
              role="group"
              aria-label="Schematic map of the Louvre's three wings. Each wing is a button."
              dangerouslySetInnerHTML={{ __html: drawing.svg }}
            />
            <div className="mlabels" aria-hidden="true" dangerouslySetInnerHTML={{ __html: drawing.labels }} />
          </div>
        </div>
        <p className="mt-1 flex justify-between gap-2 px-4 text-[12.5px] leading-snug text-muted">
          <span>Schematic, not to scale</span>
          <span>Start: the Pyramid</span>
        </p>
      </div>

      {!current ? (
        <>
          <ul className="mt-3 grid gap-2.5">
            {wings.map((w, i) => (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => choose(w.id)}
                  className="wobbly-alt m-rise grid min-h-16 w-full grid-cols-[1fr_auto] items-center gap-2.5 border-2 border-ink bg-mat px-3.5 py-2.5 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine"
                  style={{ ["--i" as string]: i }}
                >
                  <span>
                    <span className="block font-hand text-[1.6rem] font-bold leading-none">{w.name}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      Levels {[...w.floors].reverse().map((f) => floorLabel(f.floor)).join(", ")} · {w.chapters} chapters · {w.works} works
                    </span>
                  </span>
                  <NextDoodle className="h-[22px] w-[22px]" />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] leading-normal text-muted">
            {data.offMap} works aren&apos;t on the map: not on view right now (storage, loan, appointment, a closed room) or
            their room isn&apos;t confirmed. They keep their place in their chapters and the appendix.
          </p>
          <Link href="/contents/" className="inline-flex min-h-11 items-center font-hand text-lg text-ultramarine underline">
            All 100 in Contents
          </Link>
        </>
      ) : (
        <>
          <div className="mt-3 flex items-baseline justify-between gap-2.5">
            <h2 className="font-hand text-[2rem] font-bold leading-none">Levels</h2>
            <button type="button" onClick={() => choose(null)} className="min-h-11 text-sm font-bold text-ultramarine underline">
              All wings
            </button>
          </div>
          <div className="mt-2.5 grid gap-1.5" role="group" aria-label={`${current.name} levels, top floor first`}>
            {current.floors.map((f, i) => {
              const on = f.floor === floor;
              const nch = f.chapters.length;
              return (
                <button
                  key={f.floor}
                  id={f.anchor}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pickFloor(f.floor)}
                  className={`wobbly m-rise grid min-h-[52px] w-full grid-cols-[84px_1fr_auto] items-center gap-2.5 border-2 border-ink px-3 py-1.5 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine ${
                    on ? "bg-ultramarine text-white" : "bg-mat"
                  }`}
                  style={{ ["--i" as string]: i }}
                >
                  <span className="whitespace-nowrap font-hand text-[1.4rem] font-bold leading-none">Level {floorLabel(f.floor)}</span>
                  <span className={`text-sm leading-snug ${on ? "text-[#dfe4f5]" : "text-muted"}`}>
                    {nch} chapter{nch > 1 ? "s" : ""} · {f.works} work{f.works > 1 ? "s" : ""}
                  </span>
                  <span className="text-sm">{f.rooms}</span>
                </button>
              );
            })}
          </div>

          {shown && (
            <ul className="mt-3.5 grid gap-2.5" aria-label={`Chapters on ${current.name}, Level ${floorLabel(shown.floor)}`}>
              {shown.chapters.map((ch, i) => {
                const chapter = data.chapters.find((c) => c.id === ch.id)!;
                const states = chapter.works.map((w) => workState(w, progress));
                return (
                  <li key={`${shown.floor}-${ch.id}`}>
                    <Link
                      href={`/chapter/${ch.id}/?from=map-${current.id}&floor=${shown.floor}`}
                      className="wobbly-alt grid min-h-[72px] w-full grid-cols-[46px_1fr_auto] items-center gap-2.5 border-2 border-ink bg-mat px-3 py-2.5 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ultramarine"
                    >
                      <span className="text-center font-hand text-[1.9rem] font-bold leading-none tabular-nums">
                        <span className="sr-only">Chapter </span>
                        {ch.id}
                      </span>
                      <span className="m-rise min-w-0" style={{ ["--i" as string]: i }}>
                        <span className="block font-hand text-[1.3rem] font-bold leading-[1.05]">{ch.title}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
                          {ch.rooms} · {ch.here} here
                          {ch.also.length > 0 && <> · also on {ch.also.join("; ")}</>}
                        </span>
                        <span className="mt-1 block">
                          <ProgressDots states={states} />
                        </span>
                      </span>
                      <NextDoodle className="h-[22px] w-[22px]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-2.5 text-[12.5px] leading-normal text-muted">
            Levels with no work from the 100 on view are not shown. Room order is not a walking route; check on the day.
          </p>
        </>
      )}
    </>
  );
}
