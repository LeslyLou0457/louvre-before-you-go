// The two helper cats (PRODUCT.md "Visit countdown and baguette progress"):
// TT, a grey-and-white American Shorthair kitten with a hint of tabby
// stripes, and Lulu, a Siamese (cream body, dark-brown points, blue eyes).
// Our own drawings, typed by hand: no AI images.
//
// Style (25 Oct 2026, the product owner: hand-drawn and natural, in the
// manner of a tea-shop poster doodle): loose, slightly wobbly single-weight
// ink lines with round caps, the wobble typed into the path points (no
// filters); chubby round shapes, big heads and tiny bodies; dot eyes, a tiny
// mouth, a little blush; flat crayon fills printed a touch off the line
// (the translate(1.8 1.4) group), like print misregistration.
//
// - TTKitten: TT, arms up, holding the countdown sign that sits above him.
// - LuluChew: Lulu's head, for the baguette progress bar.
// - LuluFull: Lulu sitting, belly round and full, for the cleared pages.
// - Baguette: the loaf the progress bar is made of.

import type { CSSProperties } from "react";

type DoodleProps = { className?: string; style?: CSSProperties; title?: string };

/** Named image when a title is given, decorative otherwise. */
const a11y = (title?: string) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const });

const INK_LINE = {
  fill: "none",
  stroke: "var(--color-ink)",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** TT, arms up to hold the sign (the sign itself is HTML just above). */
export function TTKitten({ className, style, title }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} {...a11y(title)}>
      <g transform="translate(1.8 1.4)">
      <path d="M33 80 C32 70 40 64 50 64 C60 64 68 70 67 80 C67 89 60 95 50 95 C40 95 33 89 33 80 Z" fill="#cbcbcf"/>
      <path d="M43 82 C43 76 57 76 57 82 C57 89 43 89 43 82Z" fill="#fbfaf6"/>
      <path d="M26 44 C25 31 36 22 50 22.5 C64 22 75 31 74 44 C75 57 64 66 50 66 C36 66.5 25 57 26 44 Z M30 32 C29 25 30 19 32.5 15 C37 17.5 40 20.5 42 23.5 Z M70 32 C71 25 70 19 67.5 15 C63 17.5 60 20.5 58 23.5 Z" fill="#cbcbcf"/>
      <path d="M39.5 53 C39.5 48 45 47.5 50 49.6 C55 47.5 60.5 48 60.5 53 C60.5 58.5 55.6 61 50 61 C44.4 61 39.5 58.5 39.5 53Z" fill="#fbfaf6"/>
      <ellipse cx="35" cy="53" rx="4" ry="2.7" fill="#f2a08c"/><ellipse cx="65" cy="53" rx="4" ry="2.7" fill="#f2a08c"/>
      <circle cx="22" cy="10" r="5" fill="#fbfaf6"/><circle cx="78" cy="10" r="5" fill="#fbfaf6"/></g>
      <path {...INK_LINE} d="M36 71 C28 62 22 40 21.6 15 M64 71 C72 62 78 40 78.4 15"/>
      <path {...INK_LINE} d="M33 80 C32.4 70.6 39.6 64.2 50.2 64 C60.4 63.8 67.6 70.4 67 80.2 C67.4 89.2 60 95.2 50 95 C40.2 95.4 32.8 89 33 80 Z M45 95 L45.4 90 M55 95 L54.6 90"/>
      <path {...INK_LINE} d="M26 44 C25.6 37.4 27.8 32.6 29.8 30.2 C29.2 24.6 30.2 19.4 32.6 15.2 C36.8 17.4 39.8 20.4 42.2 23.6 C44.6 22.8 47.2 22.4 50.2 22.4 C53.2 22.4 55.6 22.8 57.8 23.6 C60.2 20.4 63.2 17.4 67.4 15.2 C69.8 19.4 70.8 24.6 70.2 30.2 C72.4 32.8 74.4 37.6 74 44.2 C74.4 57.2 64 66.2 50 66 C36 66.4 25.6 57 26 44 Z"/>
      <path {...INK_LINE} d="M45.2 28.4 L46 32.4 M50.2 26.8 L50.2 31.6 M55.2 28.4 L54.4 32.4 M30 42.6 L34 43.4 M70 42.6 L66 43.4"/>
      <path {...INK_LINE} d="M17.6 10.6 C17 6.8 20 4.6 22.6 5 C25.6 5.4 27 8.6 25.6 11.6 C24.2 14.2 18.4 14.2 17.6 10.6Z M73.6 10.6 C73 6.8 76 4.6 78.6 5 C81.6 5.4 83 8.6 81.6 11.6 C80.2 14.2 74.4 14.2 73.6 10.6Z"/>
      <circle cx="42" cy="45" r="2.3" fill="var(--color-ink)"/><circle cx="58" cy="45" r="2.3" fill="var(--color-ink)"/>
      <path {...INK_LINE} d="M48.6 51 L51.6 51 L50.1 52.6 Z M47.2 54.8 Q48.7 56.6 50.1 54.6 Q51.6 56.6 53 54.8" strokeWidth="1.7"/>
    </svg>
  );
}

/** Lulu's head, chewing the baguette end. */
export function LuluChew({ className, style, title }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 44" className={className} style={style} {...a11y(title)}>
      <g transform="translate(1.8 1.4)">
      <path d="M6 25 C5.5 15 13 9 24 9.5 C35 9 42.5 15 42 25 C42.5 35 35 41 24 41 C13 41.5 5.5 35 6 25Z" fill="#f3e6c9"/>
      <path d="M8.5 16 C8 11 9 6.5 11 4 C14 5.6 16.4 8 18 10Z M39.5 16 C40 11 39 6.5 37 4 C34 5.6 31.6 8 30 10Z" fill="#5a3e2e"/>
      <path d="M17 29 C17 25 21 24 24 25.6 C27 24 31 25 31 29 C31 33.5 28 36 24 36 C20 36 17 33.5 17 29Z" fill="#7a5a44"/>
      <ellipse cx="11.5" cy="30" rx="3" ry="2" fill="#f2a08c"/><ellipse cx="36.5" cy="30" rx="3" ry="2" fill="#f2a08c"/></g>
      <path {...INK_LINE} strokeWidth="1.8" d="M6 25 C5.6 20 7.2 17.2 8.4 15.8 C8 11 9 7 11 4.2 C14 5.8 16.4 7.8 18 10 C20 9.6 22 9.4 24.2 9.4 C26.2 9.4 28.2 9.6 30 10 C31.6 7.8 34 5.8 37 4.2 C39 7 40 11 39.6 15.8 C40.8 17.4 42.2 20 42 25.2 C42.4 35 35 41.2 24 41 C13 41.4 5.6 35 6 25Z"/>
      <circle cx="17" cy="23" r="1.9" fill="#4f8fd6"/><circle cx="31" cy="23" r="1.9" fill="#4f8fd6"/>
      <circle cx="17.2" cy="23.2" r="0.9" fill="var(--color-ink)"/><circle cx="31.2" cy="23.2" r="0.9" fill="var(--color-ink)"/>
      <path {...INK_LINE} stroke="#f3e6c9" strokeWidth="1.3" d="M22.4 28.6 L25.6 28.6 L24 30.2Z M21.6 32.6 Q24 34.6 26.6 32.4"/>
    </svg>
  );
}

/** Lulu sitting, belly round and full, eyes shut happily. */
export function LuluFull({ className, style, title }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} {...a11y(title)}>
      {/* body first, then the head over it */}
      <g transform="translate(1.8 1.4)">
      <path d="M80 82 C93 82 95 70 88 62" fill="none" stroke="#5a3e2e" strokeWidth="6" strokeLinecap="round"/>
      <path d="M22 74 C21 58 34 50 50 50 C66 50 79 58 78 74 C79 88 66 96 50 96 C34 96.5 21 88 22 74 Z" fill="#f3e6c9"/>
      <path d="M33 77 C33 65 67 65 67 77 C67 88 33 88 33 77Z" fill="#fbf4e3"/>
      <ellipse cx="38" cy="94" rx="7" ry="3.6" fill="#5a3e2e"/><ellipse cx="62" cy="94" rx="7" ry="3.6" fill="#5a3e2e"/>
      </g>
      <path {...INK_LINE} d="M79.6 82.4 C92.4 82.4 95.2 71 88.4 62.2"/>
      <path {...INK_LINE} d="M22 74 C21.6 60 33.6 50.4 50.2 50.2 C66.4 50 78.4 59.4 78 74.2 C78.4 88.4 66.2 96.2 50 96 C33.8 96.4 21.6 88.2 22 74 Z"/>
      <path {...INK_LINE} d="M44 70 Q50 73 56 70" strokeWidth="1.6"/>
      <path {...INK_LINE} d="M31.6 94.4 C31 91 35 89.6 38.4 90 C42.4 90.4 44.8 92.6 44.2 95 M56 95 C55.4 92.6 57.8 90.4 61.8 90 C65.2 89.6 69 91 68.4 94.4"/>
      <g transform="translate(1.8 1.4)">
      <path d="M24 34 C23 20 35 11 50 11.5 C65 11 77 20 76 34 C77 48 65 56 50 56 C35 56.5 23 48 24 34 Z" fill="#f3e6c9"/>
      <path d="M27 24 C26 16 27.5 9 30.5 5 C35 7.5 38.5 11 41 14 Z M73 24 C74 16 72.5 9 69.5 5 C65 7.5 61.5 11 59 14 Z" fill="#5a3e2e"/>
      <path d="M41 42 C41 37 46 35.5 50 37.5 C54 35.5 59 37 59 42 C59 48 55 51 50 51 C45 51 41 48 41 42Z" fill="#7a5a44"/>
      <ellipse cx="31" cy="42" rx="4.4" ry="2.8" fill="#f2a08c"/><ellipse cx="69" cy="42" rx="4.4" ry="2.8" fill="#f2a08c"/>
      </g>
      <path {...INK_LINE} d="M24 34 C23.6 27.4 25.8 22.6 27.4 20.4 C26.6 14.8 27.8 9.4 30.6 5.2 C35 7.6 38.6 10.8 41.2 14 C44 12.4 47 11.6 50.2 11.6 C53.4 11.6 56.2 12.4 58.8 14 C61.4 10.8 65 7.6 69.4 5.2 C72.2 9.4 73.4 14.8 72.6 20.4 C74.4 22.8 76.4 27.6 76 34.2 C76.4 48.2 65 56.2 50 56 C35 56.4 23.6 48 24 34 Z"/>
      <path {...INK_LINE} d="M36 31 Q40 27 44 31 M56 31 Q60 27 64 31" strokeWidth="2"/>
      <path {...INK_LINE} d="M48.6 39.6 L51.6 39.6 L50.1 41.2 Z M47.4 44 Q48.8 45.8 50.1 43.8 Q51.4 45.8 52.8 44" strokeWidth="1.6" stroke="#f3e6c9"/>
      <circle cx="14" cy="92" r="1.6" fill="#e9c27a"/><circle cx="19" cy="95" r="1.1" fill="#e9c27a"/><circle cx="87" cy="94" r="1.4" fill="#e9c27a"/>
    </svg>
  );
}

/** The baguette, stretched to the bar's width (the line keeps its weight). */
export function Baguette({ className, style, title }: DoodleProps) {
  return (
    <svg viewBox="0 0 300 28" preserveAspectRatio="none" className={className} style={style} {...a11y(title)}>
      <g transform="translate(1.8 1.4)"><path d="M5 15 C4 7 15 4 34 4.5 C110 3 190 5 266 3.5 C284 3.6 296 7 295 14 C296 21 284 24.5 266 24.5 C190 25.5 110 23.5 34 25 C15 24.6 4 22 5 15Z" fill="#e2a95e"/></g>
      <path {...INK_LINE} vectorEffect="non-scaling-stroke" d="M5 15 C4 7 15 4 34 4.5 C110 3 190 5 266 3.5 C284 3.6 296 7 295 14 C296 21 284 24.5 266 24.5 C190 25.5 110 23.5 34 25 C15 24.6 4 22 5 15Z"/>
      <path {...INK_LINE} vectorEffect="non-scaling-stroke" d="M40 9 Q47 13 52 18 M90 8.5 Q97 13 102 17.5 M140 9 Q147 13.4 152 18 M190 8.6 Q197 13 202 17.6 M240 9 Q247 13 252 17.8"/>
    </svg>
  );
}
