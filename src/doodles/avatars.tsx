// PLACEHOLDER AVATARS (artist heads and doodled objects).
//
// Content files name an avatar per speaker (`speakers.<id>.avatar`). Each id
// maps to one drawing here. These are deliberately crude geometric stand-ins
// typed by hand, not portraits and not AI art. When the hand-drawn SVG
// arrives, replace the shapes for that id and keep the id.
//
// PRODUCT.md "Design":
// - Artists are flat painted heads: blocks of colour, no outlines, features as
//   a few small dark marks.
// - An artwork that speaks (a statue with no known maker) is a doodled object,
//   default a marble block on a plinth, never a drawing of the artwork.
// - The ink line belongs to the frame (the hand-drawn circle), never to the head.
//
// Layers (PRODUCT.md "Motion"; the full contract for the illustrator is in
// the project files, animation/PLAN.md §4). Motion moves boxes and named
// layers, never a particular drawing:
// - `head`: the whole drawing (required). Everything that moves together.
// - `eyes`: both eyes and nothing else (recommended); they blink.
// - `mouthClosed` / `mouthOpen`: optional pair, swapped while the head talks.
// A delivered SVG names these as `<g id="head">`, `<g id="eyes">`,
// `<g id="mouth-closed">`, `<g id="mouth-open">`; here they become
// `data-part` attributes, because ids must be unique on a page that shows the
// same head twice. Doodled objects have only `head`.

import type { CSSProperties, ReactNode } from "react";
import type { Speaker } from "@/lib/types";

const INK = "#1f1f1f";

type Drawing = {
  head: ReactNode;
  eyes?: ReactNode;
  mouthClosed?: ReactNode;
  mouthOpen?: ReactNode;
};

// All drawings share a 64×64 canvas, centred in the circle.
const AVATARS: Record<string, Drawing> = {
  leonardo: {
    head: (
      <>
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f4a7b9" />
        <path d="M18 20 Q32 7 46 20 L46 25 Q32 16 18 25 Z" fill="#8c8f9b" />
        <path d="M19 31 Q21 56 32 58 Q43 56 45 31 Q39 40 32 40 Q25 40 19 31 Z" fill="#d9d6cf" />
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#f08a3c" />
      </>
    ),
    eyes: (
      <>
        <circle cx="26.5" cy="26" r="1.7" fill={INK} />
        <circle cx="37.5" cy="26" r="1.7" fill={INK} />
      </>
    ),
  },
  delacroix: {
    head: (
      <>
        <ellipse cx="32" cy="33" rx="13" ry="16" fill="#f6c6a8" />
        <path d="M18 27 Q19 12 32 12 Q46 12 46 27 Q40 18 32 19 Q24 18 18 27 Z" fill="#2b2622" />
        <path d="M25 41 Q32 37 39 41 Q32 44 25 41 Z" fill="#2b2622" />
        <ellipse cx="32" cy="34" rx="2.8" ry="4.3" fill="#3f6fd8" />
      </>
    ),
    eyes: (
      <>
        <circle cx="26.5" cy="29" r="1.7" fill={INK} />
        <circle cx="37.5" cy="29" r="1.7" fill={INK} />
      </>
    ),
  },
  gericault: {
    head: (
      <>
        <ellipse cx="32" cy="34" rx="13" ry="15" fill="#f9d3c0" />
        <circle cx="22" cy="19" r="6.5" fill="#7a4a2a" />
        <circle cx="32" cy="15" r="7.5" fill="#7a4a2a" />
        <circle cx="42" cy="19" r="6.5" fill="#7a4a2a" />
        <path d="M19 25 L22.5 25 L22.5 40 Q19.5 36 19 31 Z M45 25 L41.5 25 L41.5 40 Q44.5 36 45 31 Z" fill="#7a4a2a" />
        <ellipse cx="32" cy="35" rx="2.8" ry="4.3" fill="#3fa37a" />
      </>
    ),
    eyes: (
      <>
        <circle cx="26.5" cy="30" r="1.7" fill={INK} />
        <circle cx="37.5" cy="30" r="1.7" fill={INK} />
      </>
    ),
  },
  // Doodled object (ink line + a crayon touch), for an artwork that speaks.
  // Only a `head` layer: the whole object lifts and chatters when it speaks.
  "marble-block": {
    head: (
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(32 34) scale(1.3) translate(-32 -33)">
        <path d="M22 17 L42 16.5 L42.5 38 L21.6 38.4 Z" fill="#fffdf8" />
        <path d="M27 22 Q31 26 29 31 M36 20 Q34 24 37 27" strokeWidth="1.3" stroke="#9a948a" />
        <path d="M17 38.5 L47 38 L46.5 44 L17.4 44.5 Z" fill="#f2c14e" />
        <path d="M20 44.5 L20.5 50 L43.6 49.6 L43.8 44.2" />
      </g>
    ),
  },
};

/** For a speaker whose avatar has no drawing yet: a plain painted face. */
const GENERIC: Drawing = {
  head: (
    <>
      <ellipse cx="32" cy="33" rx="13" ry="15" fill="#f4a7b9" />
      <ellipse cx="32" cy="34" rx="2.8" ry="4.3" fill="#e8836b" />
    </>
  ),
  eyes: (
    <>
      <circle cx="26.5" cy="29" r="1.7" fill={INK} />
      <circle cx="37.5" cy="29" r="1.7" fill={INK} />
    </>
  ),
};

const CIRCLE = "M32 3.5 Q59.5 3 60.5 32 Q60 60.5 32 60.5 Q3.5 60.8 3.5 32 Q3.2 3.8 32 3.5 Z";
const CIRCLE_OPEN = "M32 3.5 Q59.5 3 60.5 32 Q60 60.5 32 60.5 Q3.5 60.8 3.5 32 Q3.2 3.8 31 3.6";

type Props = {
  speaker: Pick<Speaker, "name" | "avatar">;
  size?: number;
  /** Ultramarine ring for "you are here" (the current level). */
  ring?: boolean;
  /** Draw the ring on, once, after this many ms (PRODUCT.md "Motion"). */
  ringDrawDelay?: number;
  className?: string;
};

/** A speaker's avatar inside a hand-drawn ink circle. */
export function Avatar({ speaker, size = 56, ring = false, ringDrawDelay, className = "" }: Props) {
  const d = AVATARS[speaker.avatar] ?? GENERIC;
  const clipId = `clip-${speaker.avatar}`;
  const drawRing = ring && ringDrawDelay !== undefined;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={speaker.name}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={CIRCLE} />
        </clipPath>
      </defs>
      <path d={CIRCLE} fill="#fffdf8" />
      <g clipPath={`url(#${clipId})`}>
        <g data-part="head">
          {d.head}
          {d.eyes && <g data-part="eyes">{d.eyes}</g>}
          {d.mouthClosed && <g data-part="mouth-closed">{d.mouthClosed}</g>}
          {d.mouthOpen && <g data-part="mouth-open">{d.mouthOpen}</g>}
        </g>
      </g>
      {(!ring || drawRing) && (
        <path d={CIRCLE_OPEN} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      )}
      {ring && (
        <path
          d={CIRCLE_OPEN}
          fill="none"
          stroke="var(--color-ultramarine)"
          strokeWidth={4.5}
          strokeLinecap="round"
          {...(drawRing
            ? { pathLength: 1, className: "m-draw", style: { "--d": "500ms", "--dl": `${ringDrawDelay}ms` } as CSSProperties }
            : {})}
        />
      )}
    </svg>
  );
}

export type Mood = "hop" | "tilt";

/** How long a head talks for a line: 60 ms a word, 0.8 to 1.8 s. */
export function talkMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.min(1800, Math.max(800, words * 60));
}

/** A stable pseudo-random number in [0, 1) from a string (same on server and client). */
function phase(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

type HeadProps = Props & {
  /** Rise into place (first screen of a visit, or a new speaker). */
  enter?: boolean;
  /** Reaction to the answer just picked. */
  mood?: Mood;
  /** The line being spoken, if any: the head lifts and chatters while it is new. */
  talk?: string;
  /** Idle float (and blink). Off for heads that should stay still. */
  float?: boolean;
  /** The box around the head (layout classes go here, not on the SVG). */
  boxClassName?: string;
};

/**
 * A head that can move (PRODUCT.md "Motion"). Three nested boxes, each owning
 * one transform, so entrance, reaction/talk and idle float never fight:
 * .hd (enter) › .hd-mood (hop, tilt, talk) › .hd-idle (float) › the SVG.
 * All motion is CSS (src/app/motion.css) and switches off with reduced motion.
 */
export function Head({ enter, mood, talk, float = true, boxClassName = "", ...avatar }: HeadProps) {
  const t = talk ? talkMs(talk) : 0;
  const talkDelay = enter ? 200 : 80; // after a reaction, motion.css starts the talk itself
  const p = phase(avatar.speaker.avatar);
  const style = t
    ? ({ "--talk": `${t}ms`, "--talk-delay": `${talkDelay}ms`, "--talk-n": Math.round(t / 166) } as CSSProperties)
    : undefined;
  return (
    <span
      className={`hd ${enter ? "m-enter" : ""} ${boxClassName}`}
      data-mood={mood}
      data-talk={t ? "" : undefined}
    >
      <span className="hd-mood" style={style}>
        <span
          className={`hd-idle ${float ? "m-float" : ""}`}
          style={
            float
              ? ({ animationDelay: `${-(p * 3.6).toFixed(2)}s`, "--blink-delay": `${-(p * 5.2).toFixed(2)}s` } as CSSProperties)
              : undefined
          }
        >
          <Avatar {...avatar} />
        </span>
      </span>
      {mood === "hop" && (
        <svg className="m-sparkle" viewBox="0 0 26 26" aria-hidden="true">
          <g fill="none" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 18 L2 21" pathLength={1} className="m-draw" style={{ "--d": "220ms", "--dl": "140ms" } as CSSProperties} />
            <path d="M12 9 L12 2" pathLength={1} className="m-draw" style={{ "--d": "220ms", "--dl": "200ms" } as CSSProperties} />
            <path d="M18 14 L24 11" pathLength={1} className="m-draw" style={{ "--d": "220ms", "--dl": "260ms" } as CSSProperties} />
          </g>
          <circle cx="18.5" cy="4.5" r="2.2" fill="var(--color-crayon)" stroke="var(--color-ink)" strokeWidth="1.2" />
        </svg>
      )}
    </span>
  );
}
