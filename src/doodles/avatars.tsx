// SPEAKER HEADS (hand-typed SVG, not AI art).
//
// Content files name an avatar per speaker (`speakers.<id>.avatar`). Each id
// maps to one drawing here; the ids are listed in src/lib/avatar-ids.ts so
// the content check can fail a speaker with no drawing. These are friendly
// flat heads typed by hand, not portraits. When a person's hand-drawn SVG
// arrives, replace the shapes for that id and keep the id.
//
// Style (PRODUCT.md "Design", in the manner of After Hours, never its
// drawings): flat painted heads, blocks of colour with no outlines, head
// only. Leonardo's head is the benchmark (the product owner's favourite):
// - slightly irregular, hand-painted shapes, not perfect geometric circles;
// - skin in varied flat tones (pink, peach, ochre, orange);
// - like a child's drawing (the HeyTea reference): each head has its own face
//   shape, a slight tilt and uneven placement, and one or two documented
//   traits exaggerated so it is recognisable at a glance from its silhouette
//   alone, even at 44 px (hair, beard, whiskers, skin, freckles, a bow);
// - features as a few thin dark brush marks: dot eyes, line brows, a small
//   line mouth; simple ear blobs; the nose one flat shape in a deeper tone of
//   the skin or a warm terracotta (Leonardo keeps his orange one);
// - little or no neck (Lesly keeps a short one for her guide's badge).
// The ink line belongs to the frame (the hand-drawn circle), never to the
// head's outline.
//   leonardo   the original head, with its long flowing grey hair and long
//              pale beard exaggerated: the old sage;
//   delacroix  olive skin, a tall mass of dark wavy hair swept up, strong
//              side whiskers, heavy brows, a thin moustache (his self-portraits);
//   gericault  pale and young, a long face under a big auburn mop of curls,
//              long side whiskers, clean-shaven (the portraits of him);
//   veronese   ochre skin, a tall bald dome, dark tufts at the sides and a big
//              bushy dark beard (his presumed self-portraits, and the bald,
//              bearded player in white that tradition names as him);
//   guide      Lesly, the young museum guide who narrates works whose maker is
//              unknown or left no documented words: an elegant young woman
//              with long flowing hair, a big baby-blue bow, freckles across
//              her nose and a baby-blue lanyard with a guide's badge.
//
// Layers (PRODUCT.md "Motion"; the full contract for the illustrator is in
// the project files, animation/PLAN.md §4). Motion moves boxes and named
// layers, never a particular drawing:
// - `head`: the whole drawing (required). Everything that moves together.
// - `eyes`: both eyes and nothing else; they blink.
// - `mouthClosed` / `mouthOpen`: swapped about six times a second while the
//   head talks (src/app/motion.css). Every head has both.
// A delivered SVG names these as `<g id="head">`, `<g id="eyes">`,
// `<g id="mouth-closed">`, `<g id="mouth-open">`; here they become
// `data-part` attributes, because ids must be unique on a page that shows the
// same head twice.

import type { CSSProperties, ReactNode } from "react";
import type { AvatarId } from "@/lib/avatar-ids";
import type { Speaker } from "@/lib/types";

const INK = "#1f1f1f";
const LIP = "#b8433a";
const MOUTH = "#5e1f1b";
const BABY_BLUE = "#a9d3f2";

type Drawing = {
  /** Degrees the whole head leans, for a livelier, less rigid pose. */
  tilt?: number;
  head: ReactNode;
  eyes: ReactNode;
  mouthClosed: ReactNode;
  mouthOpen: ReactNode;
};

/** Thin brush marks (brows, lines in the face). */
const brush = (d: string, color = INK, w = 1.1) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);

/** Two small dot eyes. */
const dots = (y: number, l = 26.6, r = 37.4, size = 1.25) => (
  <>
    <circle cx={l} cy={y} r={size} fill={INK} />
    <circle cx={r} cy={y} r={size} fill={INK} />
  </>
);

/** A closed mouth: one small brush line. */
const line = (d: string, color = LIP) => brush(d, color, 1.2);

/** An open mouth: a small dark oval with a lip-coloured rim. */
const oval = (cx: number, cy: number, rx = 2.1, ry = 1.7) => (
  <>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={LIP} />
    <ellipse cx={cx} cy={cy + 0.1} rx={rx - 0.7} ry={ry - 0.6} fill={MOUTH} />
  </>
);

// All drawings share a 64×64 canvas, centred in the circle.
const AVATARS: Record<AvatarId, Drawing> = {
  // The benchmark: the original head (face, cap, beard, orange nose, eyes),
  // with his long flowing grey hair and long beard exaggerated so he reads at
  // a glance as the old sage.
  leonardo: {
    head: (
      <>
        <path d="M18.6 21 C14.6 28 13.8 39 15.2 49 C15.8 54.6 14.6 58.4 13 61.6 L22.4 61.6 C21.2 52 20.6 40 21.2 29 Z M45.4 21 C49.4 28 50.2 39 48.8 49 C48.2 54.6 49.4 58.4 51 61.6 L41.6 61.6 C42.8 52 43.4 40 42.8 29 Z" fill="#8c8f9b" />
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f4a7b9" />
        <path d="M18 20 Q32 7 46 20 L46 25 Q32 16 18 25 Z" fill="#8c8f9b" />
        <path d="M19 31 Q17.6 50 23.6 58.4 Q27.6 63.4 32 64.6 Q36.4 63.4 40.4 58.4 Q46.4 50 45 31 Q39 40 32 40 Q25 40 19 31 Z" fill="#d9d6cf" />
        {brush("M26.6 45 Q25.4 51 27.4 57", "#bdb9b1", 1)}
        {brush("M37.4 45 Q38.6 51 36.6 57", "#bdb9b1", 1)}
        {brush("M32 47 L32 60", "#bdb9b1", 1)}
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#f08a3c" />
      </>
    ),
    eyes: (
      <>
        <circle cx="26.5" cy="26" r="1.7" fill={INK} />
        <circle cx="37.5" cy="26" r="1.7" fill={INK} />
      </>
    ),
    mouthClosed: line("M29.8 37.7 Q32 38.6 34.2 37.5"),
    mouthOpen: oval(32, 38.1, 2, 1.6),
  },
  // Olive skin, a tall mass of dark wavy hair swept up, strong side whiskers,
  // heavy straight brows, a thin moustache.
  delacroix: {
    tilt: -4,
    head: (
      <>
        <ellipse cx="19.8" cy="33" rx="2.4" ry="3.4" fill="#c49660" />
        <ellipse cx="44.4" cy="33" rx="2.4" ry="3.4" fill="#c49660" />
        <path d="M32 15.5 C39 15.2 43.6 20 44 28 C44.4 37 42.6 46 37.6 50.6 C35 53 29.6 53 27 50.4 C22 45.6 20 37 20.2 28.4 C20.4 20.4 25 15.8 32 15.5 Z" fill="#dcb27e" />
        <path d="M19.6 31 C16 22 17 13 23 8.6 C27 7 33 6 38.6 7.2 C44.6 8.6 48.6 13 48 18.6 C47.6 22.4 46 25.6 44.4 28 C43.4 23.6 40.4 20.4 36 19.6 C34.2 22 30.6 22.8 27.4 21.8 C24.6 23 22 26 21.4 31 Z" fill="#231b18" />
        {brush("M23.4 13 Q29.6 8.2 36 10 Q41.4 11.4 44.4 15.6", "#4c3c34", 1.3)}
        {brush("M21.6 19.6 Q25 15.6 30 15.4", "#4c3c34", 1.1)}
        <path d="M20.4 26 C19 32 19.6 39.4 22.8 45.6 C23.8 42 23.6 36 24 30 Z M43.8 26 C45.2 32 44.6 39.4 41.4 45.6 C40.4 42 40.6 36 40.2 30 Z" fill="#231b18" />
        {brush("M23.6 28.8 L29.6 27.9", "#231b18", 2.1)}
        {brush("M34.6 27.7 L40.6 28.5", "#231b18", 2.1)}
        <path d="M32.6 29 L35.8 39.8 Q33 41 30.4 40 Z" fill="#b07a46" />
        <path d="M28 42.6 Q30.6 41.2 32.6 42 Q34.6 41.2 37 42.6 Q34.6 43.2 32.6 42.8 Q30.6 43.2 28 42.6 Z" fill="#231b18" />
      </>
    ),
    eyes: (
      <>
        <ellipse cx="26.8" cy="31.4" rx="1.5" ry="1.05" fill={INK} />
        <ellipse cx="37.6" cy="31.2" rx="1.5" ry="1.05" fill={INK} />
      </>
    ),
    mouthClosed: line("M30 45.2 Q32.4 46 35 45", "#9c3b30"),
    mouthOpen: oval(32.4, 45.5),
  },
  // Pale and young, a long face under a big auburn mop of curls falling on the
  // forehead, long side whiskers, clean-shaven.
  gericault: {
    tilt: 3,
    head: (
      <>
        <g fill="#b4572c">
          <circle cx="16" cy="25" r="6" />
          <circle cx="18.4" cy="17" r="6.2" />
          <circle cx="24.6" cy="12" r="6.6" />
          <circle cx="32.4" cy="10.4" r="6.6" />
          <circle cx="40.2" cy="11.8" r="6.6" />
          <circle cx="46.2" cy="17" r="6.2" />
          <circle cx="48.4" cy="25" r="5.6" />
          <circle cx="15.8" cy="32" r="4.8" />
          <circle cx="48.4" cy="32" r="4.6" />
        </g>
        <path d="M32 15 C39.4 14.8 44 20 44.2 28.6 C44.4 37.6 42.4 46 37.4 50.6 C34.8 52.8 29.4 52.8 26.8 50.6 C21.8 46 19.8 37.6 20 28.6 C20.2 20 24.8 15.2 32 15 Z" fill="#f7dccd" />
        <g fill="#b4572c">
          <circle cx="24.6" cy="17.4" r="3.8" />
          <circle cx="31" cy="15.4" r="4.2" />
          <circle cx="37.6" cy="16.6" r="3.6" />
          <circle cx="42.4" cy="20" r="2.8" />
          <path d="M20.4 27 L23 27 L23.8 44.6 Q20.8 41.4 20.4 36 Z M43.6 27 L41 27 L40.2 44.6 Q43.2 41.4 43.6 36 Z" />
        </g>
        {brush("M24.8 27.6 Q27.2 26.4 29.6 27.2", "#8a3c1c", 1.3)}
        {brush("M34.8 27.2 Q37.2 26.4 39.6 27.6", "#8a3c1c", 1.3)}
        <path d="M32.2 29.6 L34.6 37.8 Q32.4 38.8 30 38 Z" fill="#e09e8a" />
        <ellipse cx="25.6" cy="37.6" rx="2" ry="1.2" fill="#f2b6a6" />
        <ellipse cx="38.8" cy="37.6" rx="2" ry="1.2" fill="#f2b6a6" />
      </>
    ),
    eyes: dots(30.6, 27.2, 37.2),
    mouthClosed: line("M29.6 42.6 Q32.2 43.6 34.8 42.2"),
    mouthOpen: oval(32.2, 43),
  },
  // Ochre skin, a tall bald dome with a shine, bushy dark tufts at the sides
  // and a big bushy beard.
  veronese: {
    tilt: -3,
    head: (
      <>
        <ellipse cx="18.4" cy="34" rx="2.6" ry="3.6" fill="#d98c4c" />
        <ellipse cx="45.6" cy="34" rx="2.6" ry="3.6" fill="#d98c4c" />
        <path d="M32 9.5 C40.5 9.3 45.6 17 45.6 27.5 C45.6 37 43.4 45 38 49 C35 51.2 29 51.2 26 49 C20.6 45 18.4 37 18.4 27.5 C18.4 17 23.5 9.7 32 9.5 Z" fill="#eea25f" />
        <ellipse cx="27.6" cy="15.4" rx="4.4" ry="2.2" fill="#f6bf86" transform="rotate(-24 27.6 15.4)" />
        <path d="M18.4 33.6 C16.6 31.4 16.8 27.6 18.8 26 C18.4 24.4 19.8 23.2 21.4 23.8 C21.4 27 21.8 30.4 21.8 33.6 Z M45.6 33.6 C47.4 31.4 47.2 27.6 45.2 26 C45.6 24.4 44.2 23.2 42.6 23.8 C42.6 27 42.2 30.4 42.2 33.6 Z" fill="#3a2a22" />
        {brush("M23.2 26.8 Q26.4 25 29.4 26.4", "#2f211b", 1.9)}
        {brush("M34.6 26.4 Q37.6 25 40.8 26.8", "#2f211b", 1.9)}
        <path d="M32 28 L35.2 37.4 Q32.4 38.8 29.4 37.6 Z" fill="#c9743a" />
        <path d="M17.6 33 C16 42 17.4 50.6 22.4 55.8 C25.6 59.2 28.8 59.8 32 61.4 C35.2 59.8 38.4 59.2 41.6 55.8 C46.6 50.6 48 42 46.4 33 C44.6 38.4 41.6 41.6 38 42.6 C35 41.4 29 41.4 26 42.6 C22.4 41.6 19.4 38.4 17.6 33 Z" fill="#2f211b" />
        {brush("M24 48 Q25 52 23.6 55.4", "#4a372d", 1)}
        {brush("M40 48 Q39 52 40.4 55.4", "#4a372d", 1)}
        <path d="M26.4 41.2 Q32 37.8 37.6 41.2 Q34.8 42.3 32 41.4 Q29.2 42.3 26.4 41.2 Z" fill="#2f211b" />
      </>
    ),
    eyes: dots(29.8),
    mouthClosed: line("M29.8 44.6 Q32 45.4 34.4 44.4", "#d0573f"),
    mouthOpen: oval(32, 44.9),
  },
  // Lesly, the young museum guide: elegant and pretty, long flowing hair, a
  // big baby-blue bow, freckles across her nose, a baby-blue lanyard and badge.
  guide: {
    tilt: 4,
    head: (
      <>
        <path d="M16.4 30 C15 17 22 10.6 32 10.6 C42 10.6 49 17 47.6 30 C47 38 50 44 48.4 51 C47.4 56 49.6 59 51 61.6 L40.6 61.6 C41 56 40.4 52 40.4 49 L23.6 49 C23.6 52 23 56 23.4 61.6 L13 61.6 C14.4 59 16.6 56 15.6 51 C14 44 17 38 16.4 30 Z" fill="#5a3426" />
        <path d="M28.4 43.6 L35.6 43.6 L35.9 52 L28.1 52 Z" fill="#ecae98" />
        <path d="M28.2 45.2 L29.8 44.8 L32.8 51.2 L31.4 51.8 Z M35.8 45.2 L34.2 44.8 L31.2 51.2 L32.6 51.8 Z" fill={BABY_BLUE} />
        <path d="M27.4 50.6 Q32 50 36.6 50.6 L36.4 57.8 Q32 58.4 27.6 57.8 Z" fill={BABY_BLUE} />
        <path d="M28.8 52.8 L35.2 52.8 L35.1 56.4 L28.9 56.4 Z" fill="#fffdf8" />
        <path d="M32 14.8 C39.8 14.6 44.6 19.8 44.6 27.4 C44.6 35.4 42 42.4 37.2 46 C34.6 48 29.4 48 26.8 46 C22 42.4 19.4 35.4 19.4 27.4 C19.4 19.8 24.2 15 32 14.8 Z" fill="#f8cbb5" />
        <path d="M19.2 30 C18 19 24 12.6 33 12.4 C41.4 12.2 46.4 18.4 44.8 28.6 C43 23 39.6 19.6 35 18.8 C30.4 23 25 24.6 19.2 30 Z" fill="#5a3426" />
        {brush("M37 21.6 Q41 23.6 43.4 28", "#7a4a37", 1)}
        {/* big baby-blue bow */}
        <path d="M22.6 13.2 C18.6 7.4 12.4 9.2 14 13.8 C15.2 16.8 20 15.8 22.6 14.4 Z M23.6 13.4 C26.8 7.4 32.8 8.6 31.6 13.4 C30.8 16.6 26 15.8 23.6 14.4 Z M22.2 15 L19.4 21.2 L21.6 20.4 L23 22.2 L23.6 15.4 Z" fill={BABY_BLUE} />
        <ellipse cx="23.1" cy="14" rx="2" ry="1.8" fill="#86bde6" />
        {brush("M23.8 26.4 Q26.6 25 29.4 26", "#5a3426", 1)}
        {brush("M34.6 26 Q37.4 25 40.2 26.4", "#5a3426", 1)}
        <path d="M32.2 30 L33.8 35.4 Q32.2 36.2 30.6 35.6 Z" fill="#e5937f" />
        <g fill="#b87a5c">
          <circle cx="27.4" cy="35" r="0.6" />
          <circle cx="28.9" cy="36.3" r="0.55" />
          <circle cx="26.2" cy="36.6" r="0.55" />
          <circle cx="36.6" cy="35" r="0.6" />
          <circle cx="35.1" cy="36.3" r="0.55" />
          <circle cx="37.8" cy="36.6" r="0.55" />
        </g>
        <ellipse cx="24.2" cy="38.2" rx="2.2" ry="1.2" fill="#f4a8a4" />
        <ellipse cx="39.8" cy="38.2" rx="2.2" ry="1.2" fill="#f4a8a4" />
      </>
    ),
    eyes: (
      <>
        <ellipse cx="26.6" cy="29.6" rx="1.6" ry="1.2" fill={INK} />
        <ellipse cx="37.4" cy="29.6" rx="1.6" ry="1.2" fill={INK} />
        {brush("M24.4 28.8 Q26.6 27.6 28.6 28.6", INK, 0.8)}
        {brush("M35.4 28.6 Q37.4 27.6 39.6 28.8", INK, 0.8)}
      </>
    ),
    mouthClosed: <path d="M29 40.8 Q30.6 39.8 32 40.6 Q33.4 39.8 35 40.8 Q32 43 29 40.8 Z" fill="#cf5f6a" />,
    mouthOpen: (
      <>
        <ellipse cx="32" cy="41.2" rx="2.5" ry="1.9" fill="#cf5f6a" />
        <ellipse cx="32" cy="41.3" rx="1.6" ry="1.1" fill={MOUTH} />
      </>
    ),
  },
};

/** For a speaker whose avatar has no drawing yet: a plain painted face. */
const GENERIC: Drawing = {
  head: (
    <>
      <ellipse cx="18.6" cy="31" rx="2.6" ry="3.6" fill="#e9949f" />
      <ellipse cx="45.4" cy="31" rx="2.6" ry="3.6" fill="#e9949f" />
      <path d="M32 15 C40 14.8 45.2 20 45.2 28 C45.2 36.4 42.6 44.2 37.4 48 C34.6 50 29.4 50 26.6 48 C21.4 44 18.8 36.4 18.8 28.2 C18.8 20.2 24 15.2 32 15 Z" fill="#f4a7b9" />
      <path d="M32 27.4 L34.6 36 Q32.2 37.2 29.6 36.2 Z" fill="#e07a6a" />
    </>
  ),
  eyes: dots(29),
  mouthClosed: line("M29.6 41 Q32 41.9 34.4 40.8"),
  mouthOpen: oval(32, 41.3),
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
  const d = (AVATARS as Record<string, Drawing>)[speaker.avatar] ?? GENERIC;
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
          <g transform={d.tilt ? `rotate(${d.tilt} 32 34)` : undefined}>
            {d.head}
            <g data-part="eyes">{d.eyes}</g>
            <g data-part="mouth-closed">{d.mouthClosed}</g>
            <g data-part="mouth-open">{d.mouthOpen}</g>
          </g>
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
