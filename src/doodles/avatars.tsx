// SPEAKER HEADS (hand-typed SVG, not AI art).
//
// Content files name an avatar per speaker (`speakers.<id>.avatar`). Each id
// maps to one drawing here; the ids are listed in src/lib/avatar-ids.ts so
// the content check can fail a speaker with no drawing. These are friendly
// flat heads typed by hand, not portraits. When a person's hand-drawn SVG
// arrives, replace the shapes for that id and keep the id.
//
// The style standard is Leonardo's head (the product owner's choice,
// 15 Oct 2026). Every head follows it:
// - Flat painted blocks of colour, no outlines, features as a few small dark
//   marks (PRODUCT.md "Design"). The ink line belongs to the frame (the
//   hand-drawn circle), never to the head.
// - One geometry on the 64×64 canvas: face ellipse at (32, 28), 13 × 14;
//   eyes at y 26, 11 apart; a playful coloured nose at (32, 31); the mouth
//   just under it, at y ≈ 37.5. Below the face, a beard or the shoulders.
// - Each artist gets one nose colour of their own and only documented
//   features (hair, beard, clothes), drawn simply:
//   leonardo   grey hair and a long beard, as in the portraits of him in
//              old age (Melzi's profile drawing, the Turin red-chalk head);
//   delacroix  dark hair with side whiskers, a thin moustache, a high white
//              collar and cravat, dark coat and the green waistcoat of his
//              Louvre self-portrait (c. 1837);
//   gericault  chestnut curls and side whiskers, clean-shaven, an open white
//              shirt collar under a dark coat (the Romantic portraits of him);
//   veronese   balding with dark hair at the sides, a dark full beard and
//              dark clothes, as in his presumed self-portraits (and the bald,
//              bearded player in white that tradition names as him);
//   guide      Lesly, the young museum guide who narrates works whose maker
//              is unknown or left no documented words: a kid with a bob, a
//              hair clip, rosy cheeks, and a lanyard with a guide's badge.
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
const TONGUE = "#e8836b";

type Drawing = {
  head: ReactNode;
  eyes: ReactNode;
  mouthClosed: ReactNode;
  mouthOpen: ReactNode;
};

/** Two dot eyes on the standard line. */
const eyes = (y = 26, r = 1.7, dx = 5.5) => (
  <>
    <circle cx={32 - dx} cy={y} r={r} fill={INK} />
    <circle cx={32 + dx} cy={y} r={r} fill={INK} />
  </>
);

/** A closed mouth: one short dark mark. */
const closed = (y: number, w = 5.2) => <rect x={32 - w / 2} y={y} width={w} height={1.5} rx={0.75} fill={INK} />;

/** An open mouth: a small dark "D" with a hint of tongue. */
const open = (y: number) => (
  <>
    <path d={`M28.8 ${y} Q32 ${y - 0.4} 35.2 ${y} Q34.9 ${y + 4.4} 32 ${y + 4.4} Q29.1 ${y + 4.4} 28.8 ${y} Z`} fill={INK} />
    <ellipse cx="32" cy={y + 3.3} rx="1.7" ry="0.85" fill={TONGUE} />
  </>
);

/** Neck and shoulders, behind the face. */
const bust = (skin: string, cloth: string) => (
  <>
    <path d="M27 38 L37 38 L37.5 48 L26.5 48 Z" fill={skin} />
    <path d="M7 64 Q8 50 25 46.5 L39 46.5 Q56 50 57 64 Z" fill={cloth} />
  </>
);

// All drawings share a 64×64 canvas, centred in the circle.
const AVATARS: Record<AvatarId, Drawing> = {
  // The standard. Unchanged except for the mouth, which now opens in the gap
  // between the nose and the beard.
  leonardo: {
    head: (
      <>
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f4a7b9" />
        <path d="M18 20 Q32 7 46 20 L46 25 Q32 16 18 25 Z" fill="#8c8f9b" />
        <path d="M19 31 Q21 56 32 58 Q43 56 45 31 Q39 40 32 40 Q25 40 19 31 Z" fill="#d9d6cf" />
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#f08a3c" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: closed(37.4),
    mouthOpen: open(36.9),
  },
  delacroix: {
    head: (
      <>
        {bust("#e9b08e", "#2b2e3b")}
        {/* green waistcoat, white high collar, black cravat */}
        <path d="M26 46.5 L32 60 L38 46.5 Z" fill="#4f8a4a" />
        <path d="M26.5 45.5 L32 52 L37.5 45.5 L36.2 42.8 L32 47.6 L27.8 42.8 Z" fill="#fffdf8" />
        <path d="M28.4 47.4 Q32 49.6 35.6 47.4 L34.8 50.4 Q32 49.2 29.2 50.4 Z" fill="#1d1b1a" />
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f6c6a8" />
        {/* dark hair, parted to one side, and side whiskers */}
        <path d="M18.2 26 Q16.5 11.5 31 11 Q46.5 10.5 46 25 Q43.5 18.5 37 17.5 Q30.5 16 25 18.5 Q20.5 20.5 18.2 26 Z" fill="#241f1c" />
        <path d="M18.4 23 L21.6 23 L21.8 35.5 Q19.4 33.5 18.8 30 Z M45.6 23 L42.4 23 L42.2 35.5 Q44.6 33.5 45.2 30 Z" fill="#241f1c" />
        {/* thin moustache */}
        <path d="M27.4 37 Q32 34.6 36.6 37 Q34.2 37.7 32 36.6 Q29.8 37.7 27.4 37 Z" fill="#241f1c" />
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#3f6fd8" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: closed(38.4, 4.6),
    mouthOpen: open(38.1),
  },
  gericault: {
    head: (
      <>
        {bust("#edbfa9", "#3b3631")}
        {/* open white shirt collar, no cravat */}
        <path d="M24.5 45.5 L32 57 L39.5 45.5 L36.5 44 L32 51 L27.5 44 Z" fill="#fffdf8" />
        <path d="M27.5 44 L32 51 L36.5 44 Z" fill="#edbfa9" />
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f9d3c0" />
        {/* chestnut curls and side whiskers */}
        <g fill="#7a4a2a">
          <circle cx="20.5" cy="20" r="5.8" />
          <circle cx="25.5" cy="14.8" r="6.2" />
          <circle cx="32" cy="12.6" r="6.4" />
          <circle cx="38.5" cy="14.8" r="6.2" />
          <circle cx="43.5" cy="20" r="5.8" />
          <circle cx="28.2" cy="19.4" r="3" />
          <circle cx="35.6" cy="19" r="2.8" />
          <path d="M18.6 23 L22 23 L22.2 37 Q19.6 35 19 31 Z M45.4 23 L42 23 L41.8 37 Q44.4 35 45 31 Z" />
        </g>
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#3fa37a" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: closed(37.4),
    mouthOpen: open(36.9),
  },
  veronese: {
    head: (
      <>
        {bust("#e8a888", "#232227")}
        {/* a narrow white collar at the neck of his dark clothes */}
        <path d="M24.6 46.4 Q32 50.4 39.4 46.4 L40.2 48.4 Q32 52.8 23.8 48.4 Z" fill="#fffdf8" />
        <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f7b89a" />
        {/* balding: hair only at the sides */}
        <path d="M18.6 31 Q17.4 21 21.8 17 Q21 23.5 22.6 31 Z M45.4 31 Q46.6 21 42.2 17 Q43 23.5 41.4 31 Z" fill="#3a2a20" />
        {/* dark full beard and moustache */}
        <path d="M19 30 Q19.5 49 32 52.5 Q44.5 49 45 30 Q41 39 36 39.6 Q32 40.4 28 39.6 Q23 39 19 30 Z" fill="#3a2a20" />
        <path d="M27 37 Q32 34.6 37 37 Q34.5 37.8 32 36.8 Q29.5 37.8 27 37 Z" fill="#3a2a20" />
        <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#7b62c9" />
      </>
    ),
    eyes: eyes(),
    mouthClosed: closed(38.1, 4.6),
    mouthOpen: open(37.9),
  },
  // Lesly, the young museum guide: same style, a child's proportions (rounder
  // face, bigger eyes, narrower shoulders), and a lanyard with a guide's badge.
  guide: {
    head: (
      <>
        {/* bob, behind the face */}
        <path d="M17 38 Q14 13 32 12.2 Q50 13 47 38 Q45 40.5 42 39.5 L22 39.5 Q19 40.5 17 38 Z" fill="#4a2f25" />
        <path d="M28 38 L36 38 L36.4 46 L27.6 46 Z" fill="#efae90" />
        <path d="M10 64 Q11 50 25 46 L39 46 Q53 50 54 64 Z" fill="#2f9e8f" />
        {/* lanyard and badge */}
        <path d="M26.2 46.3 L28.2 45.9 L32.6 53 L31 53.6 Z M37.8 46.3 L35.8 45.9 L31.4 53 L33 53.6 Z" fill="#d9483b" />
        <rect x="27.8" y="52.4" width="8.4" height="6.6" rx="0.8" fill="#fffdf8" />
        <rect x="27.8" y="52.4" width="8.4" height="1.9" fill="#f2c14e" />
        <rect x="29.4" y="55.6" width="5.2" height="0.9" fill={INK} />
        <rect x="29.4" y="57.2" width="3.4" height="0.9" fill={INK} />
        <ellipse cx="32" cy="28.5" rx="13.5" ry="13.5" fill="#fbc3a6" />
        {/* fringe and hair clip */}
        <path d="M18.6 25 Q18.6 13.4 32 13.3 Q45.4 13.4 45.4 25 Q41 21.8 36.4 22.4 Q33.2 20.4 30 22 Q24 20.8 18.6 25 Z" fill="#4a2f25" />
        <rect x="38.4" y="17.6" width="6.4" height="2.6" rx="1.3" fill="#f2c14e" transform="rotate(-22 41.6 18.9)" />
        {/* rosy cheeks */}
        <circle cx="23.6" cy="32.6" r="2.4" fill="#f4978e" />
        <circle cx="40.4" cy="32.6" r="2.4" fill="#f4978e" />
        <ellipse cx="32" cy="31.4" rx="2.4" ry="3.2" fill="#e8836b" />
      </>
    ),
    eyes: eyes(27, 2, 5.2),
    mouthClosed: <path d="M28.8 36.4 Q32 40.2 35.2 36.4 Q32 38.4 28.8 36.4 Z" fill={INK} />,
    mouthOpen: open(36.3),
  },
};

/** For a speaker whose avatar has no drawing yet: a plain painted face on the standard geometry. */
const GENERIC: Drawing = {
  head: (
    <>
      {bust("#e8949f", "#8c8f9b")}
      <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f4a7b9" />
      <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#e8836b" />
    </>
  ),
  eyes: eyes(),
  mouthClosed: closed(37.4),
  mouthOpen: open(36.9),
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
