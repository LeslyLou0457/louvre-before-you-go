// SPEAKER HEADS (hand-typed SVG, not AI art).
//
// Content files name an avatar per speaker (`speakers.<id>.avatar`). Each id
// maps to one drawing here; the ids are listed in src/lib/avatar-ids.ts so
// the content check can fail a speaker with no drawing. These are friendly
// flat heads typed by hand, not portraits. When a person's hand-drawn SVG
// arrives, replace the shapes for that id and keep the id.
//
// The style follows the product owner's choices (15 Oct 2026):
// - Leonardo's way: just a head, no neck, shoulders or clothes. Who it is
//   comes from personal features only: hairstyle, beard, moustache (and, for
//   later speakers, glasses or a hat), from documented appearance.
// - Cute and round: a round face, round eyes with a small highlight, soft
//   blush, a small smile; no coloured nose (only a faint skin-tone dot).
// - One soft, warm palette that sits on the beige page and stage: warm skin
//   tones, muted greys and browns for hair. Flat blocks of colour, no
//   outlines (PRODUCT.md "Design"); the ink line belongs to the frame.
// - One geometry on the 64×64 canvas: face at (32, 30), about 14 × 14.5;
//   eyes at y 30, 11 apart; blush at y 34.5; mouth at y ≈ 39–42.
//   leonardo   long grey hair and a big soft beard, as in the portraits of
//              him in old age (Melzi's profile drawing, the Turin red-chalk head);
//   delacroix  dark hair swept up, side whiskers and a thin moustache, as in
//              his self-portraits;
//   gericault  chestnut curls and side whiskers, clean-shaven, as in the
//              portraits of him;
//   veronese   balding with dark hair at the sides and a dark full beard, as in
//              his presumed self-portraits (and the bald, bearded player in
//              white that tradition names as him);
//   guide      Lesly, the young museum guide who narrates works whose maker is
//              unknown or left no documented words: long soft waves in a low
//              ponytail with a baby-blue ribbon, lashes, rosy cheeks, and a
//              baby-blue lanyard with a guide's badge (the one head that shows
//              a little neck, so the badge has somewhere to hang).
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
const MOUTH = "#3a2522";
const TONGUE = "#ef8f86";
const BLUSH = "#f3a8a0";
const BABY_BLUE = "#a8d2f0";

type Drawing = {
  head: ReactNode;
  eyes: ReactNode;
  mouthClosed: ReactNode;
  mouthOpen: ReactNode;
};

/** Two round eyes with a small highlight. */
const eyes = (y = 30, dx = 5.5, r = 2) => (
  <>
    <circle cx={32 - dx} cy={y} r={r} fill={INK} />
    <circle cx={32 + dx} cy={y} r={r} fill={INK} />
    <circle cx={32 - dx + 0.7} cy={y - 0.7} r={0.65} fill="#fff" />
    <circle cx={32 + dx + 0.7} cy={y - 0.7} r={0.65} fill="#fff" />
  </>
);

/** Soft blush and a faint skin-tone nose: the only marks on the face besides eyes and mouth. */
const cheeks = (nose: string, y = 34.5, dx = 8.2) => (
  <>
    <ellipse cx={32 - dx} cy={y} rx="2.6" ry="1.7" fill={BLUSH} />
    <ellipse cx={32 + dx} cy={y} rx="2.6" ry="1.7" fill={BLUSH} />
    <ellipse cx="32" cy={y - 0.4} rx="1.3" ry="0.9" fill={nose} />
  </>
);

/** A closed mouth: a small smile. */
const smile = (y: number, w = 5) => (
  <path d={`M${32 - w / 2} ${y} Q32 ${y + 2.6} ${32 + w / 2} ${y} Q32 ${y + 1.3} ${32 - w / 2} ${y} Z`} fill={MOUTH} />
);

/** An open mouth: a small round "D" with a hint of tongue. */
const open = (y: number) => (
  <>
    <path d={`M29 ${y} Q32 ${y - 0.4} 35 ${y} Q34.7 ${y + 4.2} 32 ${y + 4.2} Q29.3 ${y + 4.2} 29 ${y} Z`} fill={MOUTH} />
    <ellipse cx="32" cy={y + 3.1} rx="1.6" ry="0.85" fill={TONGUE} />
  </>
);

// All drawings share a 64×64 canvas, centred in the circle.
const AVATARS: Record<AvatarId, Drawing> = {
  leonardo: {
    head: (
      <>
        {/* long hair, behind the face */}
        <path d="M16.5 31 Q15 14 32 13.5 Q49 14 47.5 31 L48.5 45 Q44.5 49 41 44 L23 44 Q19.5 49 15.5 45 Z" fill="#b7b1ad" />
        <ellipse cx="32" cy="30" rx="14" ry="14.5" fill="#f6cbb7" />
        <path d="M18 26.5 Q18.5 14.5 32 14.5 Q45.5 14.5 46 26.5 Q40.5 20.5 32 21 Q23.5 20.5 18 26.5 Z" fill="#b7b1ad" />
        {cheeks("#e8ae98")}
        {/* big soft beard and moustache */}
        <path d="M18.4 34.5 Q18 51 25 55.5 Q32 60 39 55.5 Q46 51 45.6 34.5 Q42.5 41 37.5 41.6 Q34.5 40.4 32 41.8 Q29.5 40.4 26.5 41.6 Q21.5 41 18.4 34.5 Z" fill="#e2ddd7" />
        <path d="M26 40.6 Q32 36.8 38 40.6 Q35 41.8 32 40.2 Q29 41.8 26 40.6 Z" fill="#cfc9c2" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: smile(42.4, 4.6),
    mouthOpen: open(42),
  },
  delacroix: {
    head: (
      <>
        <ellipse cx="32" cy="30" rx="14" ry="14.5" fill="#f4c6ad" />
        {/* dark hair swept up, side whiskers */}
        <path d="M17.6 29 Q15 13 31 12.4 Q48 12.4 46.6 28 Q44.2 20.6 38 19.6 Q31 17.6 25 21 Q20.2 23.6 17.6 29 Z" fill="#4b3b34" />
        <ellipse cx="27.5" cy="15.6" rx="8.4" ry="4.6" fill="#4b3b34" />
        <path d="M17.8 25 L21.6 25 L21.8 37.5 Q18.8 35.5 18.2 31.5 Z M46.2 25 L42.4 25 L42.2 37.5 Q45.2 35.5 45.8 31.5 Z" fill="#4b3b34" />
        {cheeks("#e6aa92", 34.5, 7.6)}
        {/* thin moustache */}
        <path d="M27.4 39 Q32 36.6 36.6 39 Q34.2 39.8 32 38.7 Q29.8 39.8 27.4 39 Z" fill="#4b3b34" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: smile(40.6, 4.4),
    mouthOpen: open(40.3),
  },
  gericault: {
    head: (
      <>
        <ellipse cx="32" cy="30" rx="14" ry="14.5" fill="#f8d2be" />
        {/* chestnut curls and side whiskers */}
        <g fill="#9a6a4c">
          <circle cx="19.6" cy="22.4" r="5.4" />
          <circle cx="23.6" cy="16.6" r="5.8" />
          <circle cx="30" cy="13.8" r="6" />
          <circle cx="36.6" cy="14.4" r="5.8" />
          <circle cx="42.4" cy="18" r="5.6" />
          <circle cx="45" cy="23.6" r="4.6" />
          <circle cx="27.4" cy="20.4" r="3.2" />
          <circle cx="34.6" cy="20" r="3" />
          <path d="M17.8 25 L21.8 25 L22 37.5 Q19 35.5 18.4 31.5 Z M46.2 25 L42.2 25 L42 37.5 Q45 35.5 45.6 31.5 Z" />
        </g>
        {cheeks("#ebb39c", 34.5, 7.6)}
      </>
    ),
    eyes: eyes(),
    mouthClosed: smile(38.8),
    mouthOpen: open(38.4),
  },
  veronese: {
    head: (
      <>
        <ellipse cx="32" cy="30" rx="14" ry="14.5" fill="#f2bfa3" />
        {/* balding: soft tufts at the sides */}
        <path d="M18 32 Q16.4 22 21.6 17.6 Q22.6 20 21.4 23 Q23.4 27 22.4 32 Z M46 32 Q47.6 22 42.4 17.6 Q41.4 20 42.6 23 Q40.6 27 41.6 32 Z" fill="#5b4336" />
        {cheeks("#e2a68b", 34.2, 7.8)}
        {/* dark full beard and moustache */}
        <path d="M18.4 33.5 Q18 50 32 54 Q46 50 45.6 33.5 Q42.4 41 37.4 41.6 Q32 43.2 26.6 41.6 Q21.6 41 18.4 33.5 Z" fill="#5b4336" />
        <path d="M27 39.2 Q32 36.6 37 39.2 Q34.5 40 32 38.9 Q29.5 40 27 39.2 Z" fill="#5b4336" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: smile(40.2, 4.4),
    mouthOpen: open(39.9),
  },
  // Lesly, the young museum guide: elegant and sweet, with baby blue as her colour.
  guide: {
    head: (
      <>
        {/* long soft waves, behind the face and neck */}
        <path d="M16 30 Q15 12.5 32 12.4 Q49 12.5 48 30 Q50 37 47.6 42 Q50.4 47.6 46.8 52 Q44.4 54.4 42.6 51.6 Q41.4 48 42 44 L22 44 Q22.6 48 21.4 51.6 Q19.6 54.4 17.2 52 Q13.6 47.6 16.4 42 Q14 37 16 30 Z" fill="#8a5c45" />
        {/* a little neck, with the baby-blue lanyard and badge */}
        <path d="M28 41 L36 41 L36.3 49.5 L27.7 49.5 Z" fill="#f2c2ac" />
        <path d="M27.8 42.6 L29.4 42.2 L32.8 48.8 L31.4 49.4 Z M36.2 42.6 L34.6 42.2 L31.2 48.8 L32.6 49.4 Z" fill={BABY_BLUE} />
        <rect x="27.4" y="48.2" width="9.2" height="7.8" rx="1.6" fill={BABY_BLUE} />
        <rect x="28.5" y="50.4" width="7" height="4.6" rx="0.8" fill="#fffdf8" />
        <rect x="29.7" y="52.2" width="4.6" height="1" rx="0.5" fill="#7d8796" />
        <ellipse cx="32" cy="30.5" rx="13.4" ry="14" fill="#fad3c2" />
        {/* side-parted waves over the forehead */}
        <path d="M18.4 30 Q16.6 14.6 31 13.6 Q46.4 13.2 46 28 Q43 20.6 37.6 19.4 Q33 22.6 26.6 22.4 Q21.6 23.6 18.4 30 Z" fill="#8a5c45" />
        {/* baby-blue ribbon */}
        <path d="M42 15.4 Q46.4 10.6 48.4 14.2 Q47.8 17.4 43.6 17.4 Z M43.4 17.6 Q47.6 19.6 46.4 22.8 Q43.4 22.8 42.4 18.6 Z" fill={BABY_BLUE} />
        <circle cx="43" cy="17.2" r="1.6" fill="#86bde6" />
        {cheeks("#eeb7a2", 35, 7.8)}
      </>
    ),
    eyes: (
      <>
        <ellipse cx="26.6" cy="30.4" rx="2" ry="2.3" fill={INK} />
        <ellipse cx="37.4" cy="30.4" rx="2" ry="2.3" fill={INK} />
        <circle cx="27.3" cy="29.6" r="0.7" fill="#fff" />
        <circle cx="38.1" cy="29.6" r="0.7" fill="#fff" />
        {/* lashes */}
        <path d="M24.8 29.6 Q23.2 29.2 22.6 27.8 Q24 28.7 25.2 28.8 Z M25.6 28.5 Q24.7 27.6 24.7 26.4 Q25.6 27.5 26.4 27.9 Z M39.2 29.6 Q40.8 29.2 41.4 27.8 Q40 28.7 38.8 28.8 Z M38.4 28.5 Q39.3 27.6 39.3 26.4 Q38.4 27.5 37.6 27.9 Z" fill={INK} />
      </>
    ),
    mouthClosed: smile(38.6, 5.2),
    mouthOpen: open(38.2),
  },
};

/** For a speaker whose avatar has no drawing yet: a plain face on the standard geometry. */
const GENERIC: Drawing = {
  head: (
    <>
      <ellipse cx="32" cy="30" rx="14" ry="14.5" fill="#f6cbb7" />
      {cheeks("#e8ae98")}
    </>
  ),
  eyes: eyes(),
  mouthClosed: smile(39),
  mouthOpen: open(38.6),
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
