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
// - one big characterful hair, beard or whisker shape that is the identity,
//   from the person's documented appearance only;
// - features as a few thin dark brush marks: dot eyes, line brows, a small
//   line mouth; simple ear blobs; the nose one flat shape in a deeper tone of
//   the skin or a warm terracotta (Leonardo keeps his orange one);
// - little or no neck (Lesly keeps a short one for her guide's badge).
// The ink line belongs to the frame (the hand-drawn circle), never to the
// head's outline.
//   leonardo   grey hair and a long pale beard (the original head, unchanged);
//   delacroix  dark hair swept up, side whiskers and a thin moustache, as in
//              his self-portraits;
//   gericault  chestnut curls and side whiskers, clean-shaven, as in the
//              portraits of him;
//   veronese   balding with dark hair at the sides and a dark full beard, as in
//              his presumed self-portraits (and the bald, bearded player in
//              white that tradition names as him);
//   guide      Lesly, the young museum guide who narrates works whose maker is
//              unknown or left no documented words: an elegant young woman
//              with long dark hair, a baby-blue bow and a baby-blue lanyard
//              with a guide's badge.
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
  // The benchmark: the original head, unchanged; only the mouth layers are new.
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
    mouthClosed: line("M29.8 37.7 Q32 38.6 34.2 37.5"),
    mouthOpen: oval(32, 38.1, 2, 1.6),
  },
  delacroix: {
    head: (
      <>
        <ellipse cx="18.6" cy="31" rx="2.6" ry="3.6" fill="#e3a074" />
        <ellipse cx="45.4" cy="31" rx="2.6" ry="3.6" fill="#e3a074" />
        <path d="M32 14.4 C39.8 14.2 45 19.4 45.2 27.4 C45.4 35.6 43 43.6 37.6 47.8 C34.8 50 29.4 50 26.6 47.6 C21.2 43.2 18.8 35.4 19 27.6 C19.2 19.6 24.4 14.6 32 14.4 Z" fill="#f2b48a" />
        {/* dark hair swept up to one side, side whiskers */}
        <path d="M18.2 28 C16.4 19 21 11.4 30.4 10.8 C38.6 10.2 45.4 13 46.8 20.2 C47.2 23 46.6 25.6 45.6 27.6 C44.2 22.4 40.2 19.6 35 19.2 C29 18.6 23.8 20.6 20.6 24.4 L20.2 35 C18.8 33 18.2 30.6 18.2 28 Z" fill="#2b2421" />
        <path d="M44 23.4 C45.6 24.6 46.2 27 45.8 35 C44.8 34.2 44.2 32.6 44 30.4 Z" fill="#2b2421" />
        {brush("M23.8 25.8 Q26.4 24.4 29.2 25.4", "#2b2421", 1.2)}
        {brush("M34.8 25.2 Q37.6 24.2 40.2 25.8", "#2b2421", 1.2)}
        <path d="M31.8 26.8 L34.6 35.4 Q32.2 36.8 29.4 35.8 Z" fill="#d68456" />
        {/* thin moustache */}
        <path d="M27.4 38.8 Q30 37.2 32 38.2 Q34 37.2 36.6 38.8 Q34 39.5 32 39 Q30 39.5 27.4 38.8 Z" fill="#2b2421" />
      </>
    ),
    eyes: dots(28.6),
    mouthClosed: line("M29.8 41.6 Q32 42.3 34.2 41.4"),
    mouthOpen: oval(32, 41.9),
  },
  gericault: {
    head: (
      <>
        <ellipse cx="18.4" cy="31.4" rx="2.6" ry="3.6" fill="#e99d8f" />
        <ellipse cx="45.6" cy="31.4" rx="2.6" ry="3.6" fill="#e99d8f" />
        <path d="M32 15 C40 14.8 45.2 20 45.2 28 C45.2 36.4 42.6 44.2 37.4 48 C34.6 50 29.4 50 26.6 48 C21.4 44 18.8 36.4 18.8 28.2 C18.8 20.2 24 15.2 32 15 Z" fill="#f4b3a6" />
        {/* chestnut curls, a bumpy cloud, and side whiskers */}
        <path d="M18.4 28 C15.4 25 16 20 19.6 18.6 C18.8 14.4 23 11.4 26.6 12.8 C28.2 9.8 33.2 9.4 35.2 11.8 C38.8 10.2 42.8 12.6 42.8 16 C46.2 16.6 47.8 21 46 24.4 C47 26.4 46.6 28 45.8 29.6 C44.6 25 41.6 21.6 37.2 21.6 C35.2 19.8 31 19.6 29 21.4 C25 20.6 21 23.2 19.8 28.6 Z" fill="#8a4b2c" />
        <path d="M19.6 26 L21 37.4 Q19 36 18.6 32 Z M44.4 26 L43 37.4 Q45 36 45.4 32 Z" fill="#8a4b2c" />
        {brush("M23.8 26.4 Q26.4 25.2 29 26", "#5e3320", 1.2)}
        {brush("M35 26 Q37.6 25.2 40.2 26.6", "#5e3320", 1.2)}
        <path d="M32.2 27.4 L34.8 36 Q32.4 37.2 29.8 36.2 Z" fill="#d77a68" />
      </>
    ),
    eyes: dots(29.2),
    mouthClosed: line("M29.6 40.6 Q32.2 41.6 34.6 40.2"),
    mouthOpen: oval(32, 41),
  },
  veronese: {
    head: (
      <>
        <ellipse cx="18.6" cy="31" rx="2.6" ry="3.6" fill="#df9356" />
        <ellipse cx="45.4" cy="31" rx="2.6" ry="3.6" fill="#df9356" />
        <path d="M32 14 C40 13.8 45.2 19.2 45.2 27.4 C45.2 35.6 42.8 43.4 37.6 47.6 C34.8 49.8 29.2 49.8 26.4 47.6 C21.2 43.4 18.8 35.6 18.8 27.6 C18.8 19.4 24 14.2 32 14 Z" fill="#f0a96e" />
        {/* balding: dark hair only at the sides; a dark full beard */}
        <path d="M18.2 31 C17 25 18.4 20.4 21.2 18.4 C20.6 22 21.4 26 21.8 31 Z M45.8 31 C47 25 45.6 20.4 42.8 18.4 C43.4 22 42.6 26 42.2 31 Z" fill="#3b2a22" />
        {brush("M28 18.8 Q32 17.8 36 18.8", "#cf8650", 1)}
        <path d="M18.6 31 C18.4 41 22 49.6 28 52.6 C30.6 54 33.4 54 36 52.6 C42 49.6 45.6 41 45.4 31 C44 36 41.6 39.2 38 40.6 C35 39.2 29 39.2 26 40.6 C22.4 39.2 20 36 18.6 31 Z" fill="#3b2a22" />
        {brush("M23.8 25.4 Q26.4 24 29 25", "#3b2a22", 1.3)}
        {brush("M35 25 Q37.6 24 40.2 25.4", "#3b2a22", 1.3)}
        <path d="M31.8 26.4 L34.8 35.4 Q32.2 36.8 29.2 35.6 Z" fill="#cf7a45" />
        <path d="M27 38.8 Q32 36.2 37 38.8 Q34.5 39.8 32 39 Q29.5 39.8 27 38.8 Z" fill="#3b2a22" />
      </>
    ),
    eyes: dots(28.2),
    mouthClosed: line("M29.6 41.8 Q32 42.6 34.4 41.6", "#c9533f"),
    mouthOpen: oval(32, 42.1),
  },
  // Lesly, the young museum guide: elegant, with baby blue as her colour.
  guide: {
    head: (
      <>
        {/* long dark hair, behind the face */}
        <path d="M17 30 C15.4 18 22 11.6 32 11.6 C42 11.6 48.6 18 47 30 C46.4 38 48.8 46 46.6 54.4 C44 56.4 41 55 40.4 50.4 L23.6 50.4 C23 55 20 56.4 17.4 54.4 C15.2 46 17.6 38 17 30 Z" fill="#3f2a24" />
        {/* a short neck, with the baby-blue lanyard and badge */}
        <path d="M28.4 44 L35.6 44 L35.9 52.6 L28.1 52.6 Z" fill="#e9a994" />
        <path d="M28.2 45.6 L29.8 45.2 L32.8 51.6 L31.4 52.2 Z M35.8 45.6 L34.2 45.2 L31.2 51.6 L32.6 52.2 Z" fill={BABY_BLUE} />
        <path d="M27.6 51 Q32 50.4 36.4 51 L36.2 58 Q32 58.6 27.8 58 Z" fill={BABY_BLUE} />
        <path d="M28.9 53.2 L35.1 53.2 L35 56.6 L29 56.6 Z" fill="#fffdf8" />
        <path d="M32 14.8 C39.6 14.6 44.6 19.6 44.8 27.4 C45 35.2 42.6 42.4 37.6 46.4 C34.6 48.6 29.4 48.6 26.4 46.4 C21.4 42.4 19 35.2 19.2 27.4 C19.4 19.8 24.4 15 32 14.8 Z" fill="#f7c3ad" />
        {/* side-parted hair over the forehead */}
        <path d="M19.2 29.4 C18.2 19 24 13.2 32.6 13 C40.8 12.8 46 18.4 44.8 28.4 C42.6 22.2 38.4 18.8 33.4 18.4 C29.6 21.6 24.2 23.4 19.2 29.4 Z" fill="#3f2a24" />
        {/* baby-blue bow */}
        <path d="M39.6 14.4 C41.4 9.6 46.6 10 46.2 13.6 C45.8 15.6 42.6 15.8 40.8 15.2 Z M40.4 15.8 C42.4 16.8 45.4 19.4 43.8 21.4 C42.2 22.4 40.2 19.2 39.8 16.8 Z M37.2 13.4 C35.4 10.2 32.4 11.2 33.2 13.6 C33.8 15 36.2 15.2 38 14.8 Z" fill={BABY_BLUE} />
        <ellipse cx="39.2" cy="15" rx="1.7" ry="1.5" fill="#7fb7e2" />
        {brush("M23.6 26 Q26.4 24.6 29.2 25.6", "#3f2a24", 1)}
        {brush("M34.8 25.6 Q37.6 24.6 40.4 26", "#3f2a24", 1)}
        <path d="M32 28.6 L33.8 35.4 Q32 36.4 30.2 35.6 Z" fill="#e3907e" />
        <ellipse cx="24.4" cy="36" rx="2.4" ry="1.4" fill="#f2a6a2" />
        <ellipse cx="39.6" cy="36" rx="2.4" ry="1.4" fill="#f2a6a2" />
      </>
    ),
    eyes: (
      <>
        <ellipse cx="26.6" cy="29.4" rx="1.5" ry="1.15" fill={INK} />
        <ellipse cx="37.4" cy="29.4" rx="1.5" ry="1.15" fill={INK} />
        {/* a short lash line along the top of each eye */}
        {brush("M24.6 28.6 Q26.6 27.6 28.4 28.4", INK, 0.7)}
        {brush("M35.6 28.4 Q37.4 27.6 39.4 28.6", INK, 0.7)}
      </>
    ),
    mouthClosed: <path d="M29 40.6 Q30.6 39.6 32 40.4 Q33.4 39.6 35 40.6 Q32 42.8 29 40.6 Z" fill="#cf5f6a" />,
    mouthOpen: (
      <>
        <ellipse cx="32" cy="41" rx="2.5" ry="1.9" fill="#cf5f6a" />
        <ellipse cx="32" cy="41.1" rx="1.6" ry="1.1" fill={MOUTH} />
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
          {d.head}
          <g data-part="eyes">{d.eyes}</g>
          <g data-part="mouth-closed">{d.mouthClosed}</g>
          <g data-part="mouth-open">{d.mouthOpen}</g>
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
