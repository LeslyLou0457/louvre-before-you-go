// PLACEHOLDER DOODLES.
//
// Every doodle in the app lives in this folder, one small component each, so
// a hand-drawn SVG can replace them one at a time without touching the pages.
// These are simple shapes typed by hand as stand-ins (PRODUCT.md: doodles are
// drawn by a person, never AI-generated). One black ink line, one stroke
// weight, a little crayon colour.
//
// To swap one: keep the component name and props, replace the <svg> inside.
//
// Motion (PRODUCT.md "Motion"): lines that "draw themselves" (underline,
// route, ring, wavy mark) are open stroked paths with pathLength="1" and the
// `m-draw` class from src/app/motion.css. A hand-drawn replacement keeps them
// as open stroked paths; a filled shape still works, it just fades instead.
// The padlock's shackle is its own path (data-part="shackle") so it can swing open.

import type { CSSProperties } from "react";

type DoodleProps = { className?: string; title?: string; style?: CSSProperties };

const ink = "var(--color-ink)";
const stroke = {
  fill: "none",
  stroke: ink,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({
  className,
  style,
  title,
  viewBox,
  children,
}: DoodleProps & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

/** Close / exit cross. */
export function CloseDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M5 5.5 Q12 12 18.5 19 M18.8 5 Q12 11.5 5.2 18.6" {...stroke} />
    </Svg>
  );
}

/** Back arrow. */
export function BackDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M20 12.5 Q12 11.6 4.5 12 M10 6 Q7 9 4.5 12 Q7.2 15 10.2 18" {...stroke} />
    </Svg>
  );
}

/** Tick for a finished level. */
export function CheckDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M4.5 12.8 Q7.5 15.5 9.6 18.2 Q14 10 19.6 5.4" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Small padlock for a locked level. `opening`: the shackle swings open once. */
export function LockDoodle(p: DoodleProps & { opening?: boolean }) {
  const { opening, ...rest } = p;
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <path
        data-part="shackle"
        className={opening ? "m-unlock-shackle" : undefined}
        d="M8 11 V8.2 Q8 4.6 12 4.5 Q16 4.6 16.1 8.3 V11"
        {...stroke}
        stroke="currentColor"
      />
      <path d="M6 11.2 Q12 10.6 18.2 11 Q18.6 15.5 18 19.6 Q12 20.2 5.8 19.5 Q5.5 15 6 11.2 Z" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Star sticker with a crayon fill. */
export function StarDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 48 48" {...p}>
      <path
        d="M24 5 L29.5 17.5 L43 18.6 L32.6 27.5 L35.8 41 L24 33.8 L12.4 41.2 L15.5 27.6 L5 18.4 L18.6 17.4 Z"
        fill="var(--color-crayon)"
        stroke={ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * The cover's sticker: the Louvre, our own flat drawing (hand-typed, not
 * traced from any image). The glass pyramid in front of a simple palace
 * front (cream walls, blue-grey roofs, the domed centre pavilion and two end
 * pavilions), a loose pale-blue swash of sky behind, and one ink line for
 * the ground, like the other doodles. No text.
 */
export function LouvreDoodle(p: DoodleProps) {
  const wall = "#efdcbb";
  const roof = "#8297c2";
  const win = "#4f5566";
  return (
    <Svg viewBox="0 0 64 48" {...p}>
      {/* sky swash */}
      <path d="M5 17 C10 9.5 24 6.5 38 7.2 C48 7.6 58 9.6 59.4 14.4 C57 15.8 52 14.6 47 15.6 C40 17 33 15.4 26 16.6 C18 18 10 20.6 5 17 Z" fill="#c4dcf2" />
      <path d="M12 11.6 C20 9.6 30 9 37 9.6 M41 11 C47 10.8 53 11.6 56.6 13" fill="none" stroke="#fffdf8" strokeWidth="1.2" strokeLinecap="round" />
      {/* end pavilions */}
      <path d="M5.4 19 L7.6 12.8 L13.4 12.8 L15.6 19 Z M48.4 19 L50.6 12.8 L56.4 12.8 L58.6 19 Z" fill={roof} />
      <rect x="6" y="19" width="9" height="19.4" fill={wall} />
      <rect x="49" y="19" width="9" height="19.4" fill={wall} />
      {/* main wing and roof */}
      <path d="M14 23.4 L15.6 19.6 L48.4 19.6 L50 23.4 Z" fill={roof} />
      <rect x="15" y="23.4" width="34" height="15" fill={wall} />
      {/* domed centre pavilion */}
      <rect x="27" y="15.6" width="10" height="8" fill={wall} />
      <path d="M27.6 15.8 Q32 9.4 36.4 15.8 Z" fill={roof} />
      <rect x="31.2" y="9.6" width="1.6" height="1.6" fill={win} />
      {/* windows */}
      <g fill={win}>
        {[8, 11.4, 51, 54.4].map((x) => (
          <g key={x}>
            <rect x={x} y="22" width="1.6" height="2.8" rx="0.8" />
            <rect x={x} y="27.4" width="1.6" height="2.8" rx="0.8" />
            <rect x={x} y="32.8" width="1.6" height="2.8" rx="0.8" />
          </g>
        ))}
        {[17, 20, 23, 39.4, 42.4, 45.4].map((x) => (
          <g key={x}>
            <rect x={x} y="26" width="1.6" height="2.8" rx="0.8" />
            <rect x={x} y="31.4" width="1.6" height="2.8" rx="0.8" />
          </g>
        ))}
      </g>
      {/* the glass pyramid */}
      <path d="M17.6 38.6 L32 18.6 L46.4 38.6 Z" fill="#9db4da" />
      <path d="M27.4 25 L36.6 25 M22.8 31.6 L41.2 31.6 M24.8 38.6 L36.6 25 M39.2 38.6 L27.4 25 M32 38.6 L41.2 31.6 M32 38.6 L22.8 31.6" fill="none" stroke="#e8f0fa" strokeWidth="0.75" strokeLinecap="round" />
      <path d="M28.8 38.6 L32 35.2 L35.2 38.6 Z" fill="#3c4357" />
      {/* the ground: one ink line */}
      <path d="M2.5 39 Q20 38.2 32 38.8 T61.5 38.6" {...stroke} strokeWidth={2.2} />
    </Svg>
  );
}

/** Hand-drawn underline under a headline. `draw`: it draws itself once, left to right. */
export function UnderlineDoodle(p: DoodleProps & { draw?: boolean }) {
  const { draw, ...rest } = p;
  return (
    <Svg viewBox="0 0 200 12" {...rest}>
      <path
        d="M3 8 Q50 3 100 6.5 T197 5"
        {...stroke}
        stroke="var(--color-coral)"
        strokeWidth={3}
        {...(draw ? { pathLength: 1, className: "m-draw", style: { "--d": "450ms", "--dl": "250ms" } as CSSProperties } : {})}
      />
    </Svg>
  );
}

/**
 * Squiggly vertical route segment between two journey nodes. `draw`: the
 * dashed (locked) line redraws itself as solid ink, once, when the level
 * below has just been unlocked.
 */
export function RouteDoodle(p: DoodleProps & { dashed?: boolean; draw?: boolean }) {
  const { dashed, draw, ...rest } = p;
  const d = "M12 2 Q4 14 12 28 T12 54";
  return (
    <Svg viewBox="0 0 24 56" {...rest}>
      <path
        d={d}
        {...stroke}
        strokeDasharray={dashed || draw ? "2 7" : undefined}
        stroke={dashed || draw ? "var(--color-muted)" : ink}
      />
      {draw && (
        <path d={d} {...stroke} pathLength={1} className="m-draw" style={{ "--d": "450ms", "--dl": "200ms" } as CSSProperties} />
      )}
    </Svg>
  );
}

/** Little magnifier, shown on the "tap to zoom" hint. */
export function ZoomDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M10.5 4.5 Q16.5 4.6 16.4 10.4 Q16.3 16.4 10.4 16.3 Q4.6 16.2 4.6 10.5 Q4.6 4.5 10.5 4.5 Z" {...stroke} stroke="currentColor" />
      <path d="M15 15.2 Q17.6 17.4 19.6 19.8" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Little clock on the "Coming soon" chip. */
export function ClockDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M12 4 Q20 4.2 20 12 Q19.8 20 12 20 Q4 19.8 4 12 Q4.2 4 12 4 Z M12 7.5 L12 12.4 L15 14.2" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Play triangle on the "Play" and "Continue" chips. */
export function PlayDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M8 5.5 Q8.3 12 8 18.5 Q13.5 15.5 18.5 12 Q13.4 8.4 8 5.5 Z" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Crossed-out eye on the "not on view" chips. */
export function EyeOffDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M3 12 Q12 4 21 12 Q12 20 3 12 Z M5 19 L19 5" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Small arrow for "Next up". */
export function NextDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M8.5 5 Q13 9 16 12 Q13 15 8.6 19" {...stroke} stroke="currentColor" />
    </Svg>
  );
}

/** Empty picture frame on the "Photo comes with the level" placeholder tile. Never a drawing of an artwork. */
export function PictureDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path
        d="M4 5.5 Q12 5 20 5.6 Q20.4 12 19.8 18.6 Q12 19 4.2 18.5 Q3.7 12 4 5.5 Z M7.5 15.5 L10.5 11.5 L13 14 L15 12 L17 15.5"
        {...stroke}
        strokeWidth={1.8}
        stroke="currentColor"
      />
    </Svg>
  );
}

/** Open book, the "Cover" tab. */
export function CoverDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M4 5.5 Q8 4 12 6.5 Q16 4 20 5.5 L20 19 Q16 17.6 12 19.6 Q8 17.6 4 19 Z M12 6.5 L12 19.6" {...stroke} strokeWidth={2.2} stroke="currentColor" />
    </Svg>
  );
}

/** Three lines with dots, the "Contents" tab. */
export function ContentsDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path
        d="M4 6.2 L5.5 6.2 M9 6 Q14 6.4 20 6 M4 12.1 L5.5 12.1 M9 12 Q14 12.3 20 11.9 M4 18 L5.5 18 M9 18 Q14 17.7 20 18.1"
        {...stroke}
        strokeWidth={2.2}
        stroke="currentColor"
      />
    </Svg>
  );
}

/** Folded map, the "Map" tab. */
export function MapDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M3.5 6 L9 4 L15 6.2 L20.5 4.2 L20.5 18 L15 20 L9 17.8 L3.5 19.8 Z M9 4 L9 17.8 M15 6.2 L15 20" {...stroke} strokeWidth={2.2} stroke="currentColor" />
    </Svg>
  );
}
