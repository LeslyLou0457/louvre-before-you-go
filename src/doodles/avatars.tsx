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

import type { Speaker } from "@/lib/types";

const INK = "#1f1f1f";

// All drawings share a 64×64 canvas, centred in the circle.
const AVATARS: Record<string, React.ReactNode> = {
  leonardo: (
    <>
      <ellipse cx="32" cy="28" rx="13" ry="14" fill="#f4a7b9" />
      <path d="M18 20 Q32 7 46 20 L46 25 Q32 16 18 25 Z" fill="#8c8f9b" />
      <path d="M19 31 Q21 56 32 58 Q43 56 45 31 Q39 40 32 40 Q25 40 19 31 Z" fill="#d9d6cf" />
      <ellipse cx="32" cy="31" rx="3" ry="4.6" fill="#f08a3c" />
      <circle cx="26.5" cy="26" r="1.7" fill={INK} />
      <circle cx="37.5" cy="26" r="1.7" fill={INK} />
    </>
  ),
  delacroix: (
    <>
      <ellipse cx="32" cy="33" rx="13" ry="16" fill="#f6c6a8" />
      <path d="M18 27 Q19 12 32 12 Q46 12 46 27 Q40 18 32 19 Q24 18 18 27 Z" fill="#2b2622" />
      <path d="M25 41 Q32 37 39 41 Q32 44 25 41 Z" fill="#2b2622" />
      <ellipse cx="32" cy="34" rx="2.8" ry="4.3" fill="#3f6fd8" />
      <circle cx="26.5" cy="29" r="1.7" fill={INK} />
      <circle cx="37.5" cy="29" r="1.7" fill={INK} />
    </>
  ),
  gericault: (
    <>
      <ellipse cx="32" cy="34" rx="13" ry="15" fill="#f9d3c0" />
      <circle cx="22" cy="19" r="6.5" fill="#7a4a2a" />
      <circle cx="32" cy="15" r="7.5" fill="#7a4a2a" />
      <circle cx="42" cy="19" r="6.5" fill="#7a4a2a" />
      <path d="M19 25 L22.5 25 L22.5 40 Q19.5 36 19 31 Z M45 25 L41.5 25 L41.5 40 Q44.5 36 45 31 Z" fill="#7a4a2a" />
      <ellipse cx="32" cy="35" rx="2.8" ry="4.3" fill="#3fa37a" />
      <circle cx="26.5" cy="30" r="1.7" fill={INK} />
      <circle cx="37.5" cy="30" r="1.7" fill={INK} />
    </>
  ),
  // Doodled object (ink line + a crayon touch), for an artwork that speaks.
  "marble-block": (
    <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(32 34) scale(1.3) translate(-32 -33)">
      <path d="M22 17 L42 16.5 L42.5 38 L21.6 38.4 Z" fill="#fffdf8" />
      <path d="M27 22 Q31 26 29 31 M36 20 Q34 24 37 27" strokeWidth="1.3" stroke="#9a948a" />
      <path d="M17 38.5 L47 38 L46.5 44 L17.4 44.5 Z" fill="#f2c14e" />
      <path d="M20 44.5 L20.5 50 L43.6 49.6 L43.8 44.2" />
    </g>
  ),
};

/** For a speaker whose avatar has no drawing yet: a plain painted face. */
const GENERIC = (
  <>
    <ellipse cx="32" cy="33" rx="13" ry="15" fill="#f4a7b9" />
    <ellipse cx="32" cy="34" rx="2.8" ry="4.3" fill="#e8836b" />
    <circle cx="26.5" cy="29" r="1.7" fill={INK} />
    <circle cx="37.5" cy="29" r="1.7" fill={INK} />
  </>
);

type Props = {
  speaker: Pick<Speaker, "name" | "avatar">;
  size?: number;
  /** Ultramarine ring for "you are here" (the current level). */
  ring?: boolean;
  className?: string;
};

/** A speaker's avatar inside a hand-drawn ink circle. */
export function Avatar({ speaker, size = 56, ring = false, className = "" }: Props) {
  const drawing = AVATARS[speaker.avatar] ?? GENERIC;
  const clipId = `clip-${speaker.avatar}`;
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
          <path d="M32 3.5 Q59.5 3 60.5 32 Q60 60.5 32 60.5 Q3.5 60.8 3.5 32 Q3.2 3.8 32 3.5 Z" />
        </clipPath>
      </defs>
      <path d="M32 3.5 Q59.5 3 60.5 32 Q60 60.5 32 60.5 Q3.5 60.8 3.5 32 Q3.2 3.8 32 3.5 Z" fill="#fffdf8" />
      <g clipPath={`url(#${clipId})`}>{drawing}</g>
      <path
        d="M32 3.5 Q59.5 3 60.5 32 Q60 60.5 32 60.5 Q3.5 60.8 3.5 32 Q3.2 3.8 31 3.6"
        fill="none"
        stroke={ring ? "var(--color-ultramarine)" : INK}
        strokeWidth={ring ? 4.5 : 2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
