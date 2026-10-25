// The two helper cats (PRODUCT.md "Visit countdown" and "Baguette progress"),
// our own drawings, typed by hand like the rest of this folder: black ink,
// one stroke weight, crayon fills. They are product helpers, never narrators
// of an artwork, and they never say an art fact.
//
// - SignKitten: a grey-and-white American Shorthair kitten (silver coat with
//   classic tabby swirls, white muzzle and paws), paws raised to hold up the
//   countdown sign that sits just above it.
// - SiameseChew: the Siamese cat's head (cream face, dark brown points, blue
//   eyes) chewing the end of the baguette, for the level progress bar.
// - SiameseFull: the same cat sitting, belly round, eyes shut happily, for
//   the level-cleared page.
// - Baguette: the loaf the progress bar is made of.

import type { CSSProperties } from "react";

type DoodleProps = { className?: string; style?: CSSProperties };

const INK = "var(--color-ink)";
const W = 2.5;
const line = { fill: "none", stroke: INK, strokeWidth: W, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const thin = (c: string, w = 1.4) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round" as const });

const GREY = "#c5c4c0";
const TABBY = "#5d5d5f";
const WHITE = "#f7f5ef";
const PINK = "#eba3ab";
const CREAM = "#f1e4c8";
const POINT = "#5a3e2e";
const BLUE = "#5f9bd6";
const CRUST = "#d79b52";
const CRUMB = "#f0cf8f";

/** The countdown kitten, paws up. The sign itself is HTML just above it. */
export function SignKitten({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 96 82" className={className} style={style} aria-hidden="true">
      {/* body, cut by the bottom edge */}
      <ellipse cx="48" cy="80" rx="27" ry="13" {...line} fill={GREY} />
      <path d="M40 72 Q48 78 56 72 L55 82 L41 82 Z" fill={WHITE} />
      {/* arms raised to the sign */}
      <path d="M33 66 Q24 40 26 9" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M63 66 Q72 40 70 9" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M33 66 Q24 40 26 9" fill="none" stroke={GREY} strokeWidth="6" strokeLinecap="round" />
      <path d="M63 66 Q72 40 70 9" fill="none" stroke={GREY} strokeWidth="6" strokeLinecap="round" />
      <path d="M25 40 l5 -1 M27 30 l5 -1 M71 40 l-5 -1 M69 30 l-5 -1" {...thin(TABBY, 1.6)} />
      <circle cx="26" cy="8" r="5.5" {...line} fill={WHITE} />
      <circle cx="70" cy="8" r="5.5" {...line} fill={WHITE} />
      {/* ears */}
      <path d="M27 38 L28.5 17 L42 28 Z" {...line} fill={GREY} />
      <path d="M69 38 L67.5 17 L54 28 Z" {...line} fill={GREY} />
      <path d="M30.5 32 L31 22.5 L37.5 28 Z M65.5 32 L65 22.5 L58.5 28 Z" fill={PINK} />
      {/* head */}
      <ellipse cx="48" cy="47" rx="25" ry="21" {...line} fill={GREY} />
      {/* classic tabby: the forehead M and cheek swirls */}
      <path d="M38.5 34 L41.5 28.5 L48 33.5 L54.5 28.5 L57.5 34" {...thin(TABBY, 1.8)} />
      <path d="M48 27 L48 32" {...thin(TABBY, 1.6)} />
      <path d="M24.5 46 Q30 43.5 33.5 47.5 M25 52 Q29.5 50.5 32 53" {...thin(TABBY, 1.6)} />
      <path d="M71.5 46 Q66 43.5 62.5 47.5 M71 52 Q66.5 50.5 64 53" {...thin(TABBY, 1.6)} />
      {/* white muzzle and chin */}
      <path d="M36.5 55 C36.5 48.5 42 47 48 49.5 C54 47 59.5 48.5 59.5 55 C59.5 61.5 54 65 48 65 C42 65 36.5 61.5 36.5 55 Z" fill={WHITE} />
      {/* crayon blush */}
      <circle cx="31" cy="56" r="3.6" fill="var(--color-coral)" opacity="0.35" />
      <circle cx="65" cy="56" r="3.6" fill="var(--color-coral)" opacity="0.35" />
      {/* eyes */}
      <circle cx="39" cy="45" r="4.4" fill="#d6a83a" />
      <circle cx="57" cy="45" r="4.4" fill="#d6a83a" />
      <circle cx="39.3" cy="45.4" r="2.5" fill={INK} />
      <circle cx="57.3" cy="45.4" r="2.5" fill={INK} />
      <circle cx="40.4" cy="44.2" r="0.9" fill="#fff" />
      <circle cx="58.4" cy="44.2" r="0.9" fill="#fff" />
      {/* nose and mouth */}
      <path d="M45.6 51.4 L50.4 51.4 L48 54 Z" fill={PINK} />
      <path d="M44.4 57 Q46.4 59 48 56.4 Q49.6 59 51.6 57" {...line} strokeWidth={1.6} />
      {/* whiskers */}
      <path d="M36 55 L26 53.5 M36 58 L27 59.5 M60 55 L70 53.5 M60 58 L69 59.5" {...thin("#8d8b86", 0.9)} />
    </svg>
  );
}

/** The Siamese cat's head, chewing the baguette end at its right edge. */
export function SiameseChew({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 44" className={className} style={style} aria-hidden="true">
      <path d="M8 18 L9 3 L20 11 Z" {...line} fill={POINT} strokeWidth={2} />
      <path d="M36 11 L44 4 L43 19 Z" {...line} fill={POINT} strokeWidth={2} />
      <ellipse cx="25" cy="24" rx="18" ry="16" {...line} fill={CREAM} strokeWidth={2} />
      {/* the dark mask over nose and mouth */}
      <ellipse cx="27" cy="29" rx="10" ry="8.5" fill={POINT} />
      <path d="M14 21 Q18 18.6 21 21.4" {...thin(BLUE, 3.2)} />
      <path d="M30 21 Q33.5 18.6 37 21.4" {...thin(BLUE, 3.2)} />
      <circle cx="18" cy="21.6" r="1.1" fill={INK} />
      <circle cx="34" cy="21.6" r="1.1" fill={INK} />
      <path d="M25.5 27 L28.5 27 L27 28.8 Z" fill={PINK} />
      {/* cheeks puffed round the bite */}
      <path d="M30 33 Q35 35 38 32" {...thin(CREAM, 1.4)} />
    </svg>
  );
}

/** The Siamese cat sitting, belly round and full, eyes shut with pleasure. */
export function SiameseFull({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 112" className={className} style={style} aria-hidden="true">
      {/* tail curling round the side */}
      <path d="M92 96 Q114 92 108 70 Q105 60 112 54" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M92 96 Q114 92 108 70 Q105 60 112 54" fill="none" stroke={POINT} strokeWidth="5.5" strokeLinecap="round" />
      {/* the round body and the fuller belly */}
      <ellipse cx="60" cy="78" rx="36" ry="30" {...line} fill={CREAM} />
      <ellipse cx="60" cy="83" rx="22" ry="19" fill="#f8efdc" />
      <path d="M50 76 Q60 72 70 76" {...thin("#e2cfa8", 1.4)} />
      {/* front paws */}
      <ellipse cx="46" cy="106" rx="8" ry="5" {...line} fill={POINT} strokeWidth={2} />
      <ellipse cx="74" cy="106" rx="8" ry="5" {...line} fill={POINT} strokeWidth={2} />
      {/* ears */}
      <path d="M36 32 L37 8 L52 20 Z" {...line} fill={POINT} />
      <path d="M84 32 L83 8 L68 20 Z" {...line} fill={POINT} />
      {/* head */}
      <ellipse cx="60" cy="35" rx="25" ry="21" {...line} fill={CREAM} />
      <ellipse cx="60" cy="42" rx="12" ry="10" fill={POINT} />
      {/* happy shut eyes, blue lashes of colour under them */}
      <path d="M43 32 Q48 27.5 53 32" {...line} strokeWidth={2.2} />
      <path d="M67 32 Q72 27.5 77 32" {...line} strokeWidth={2.2} />
      <circle cx="42" cy="40" r="3.4" fill="var(--color-coral)" opacity="0.35" />
      <circle cx="78" cy="40" r="3.4" fill="var(--color-coral)" opacity="0.35" />
      <path d="M57.8 38.6 L62.2 38.6 L60 41 Z" fill={PINK} />
      <path d="M56 44 Q58 46.4 60 43.8 Q62 46.4 64 44" fill="none" stroke={CREAM} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 42 L38 40.5 M48 45 L39 46.5 M72 42 L82 40.5 M72 45 L81 46.5" {...thin("#9a8f80", 0.9)} />
      {/* crumbs */}
      <circle cx="30" cy="100" r="2" {...line} fill={CRUMB} strokeWidth={1.2} />
      <circle cx="22" cy="104" r="1.5" {...line} fill={CRUMB} strokeWidth={1} />
      <circle cx="88" cy="106" r="1.8" {...line} fill={CRUMB} strokeWidth={1.1} />
    </svg>
  );
}

/** The baguette, stretched to the bar's width (the outline keeps its weight). */
export function Baguette({ className, style }: DoodleProps) {
  const ns = { vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 300 28" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path
        d="M4 14 C4 6 16 3 34 3 L266 3 C284 3 296 6 296 14 C296 22 284 25 266 25 L34 25 C16 25 4 22 4 14 Z"
        fill={CRUST}
        stroke={INK}
        strokeWidth={W}
        strokeLinejoin="round"
        {...ns}
      />
      <path d="M8 18 Q150 22 292 18" fill="none" stroke="#b87c3a" strokeWidth={1.2} {...ns} />
      {[30, 62, 94, 126, 158, 190, 222, 254].map((x) => (
        <path key={x} d={`M${x} 8 L${x + 16} 17`} fill="none" stroke={CRUMB} strokeWidth={2.4} strokeLinecap="round" {...ns} />
      ))}
    </svg>
  );
}
