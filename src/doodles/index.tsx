// PLACEHOLDER DOODLES.
//
// Every doodle in the app lives in this folder, one small component each, so
// a hand-drawn SVG can replace them one at a time without touching the pages.
// These are simple shapes typed by hand as stand-ins (PRODUCT.md: doodles are
// drawn by a person, never AI-generated). One black ink line, one stroke
// weight, a little crayon colour.
//
// To swap one: keep the component name and props, replace the <svg> inside.

type DoodleProps = { className?: string; title?: string };

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
  title,
  viewBox,
  children,
}: DoodleProps & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
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

/** Small padlock for a locked level. */
export function LockDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 24 24" {...p}>
      <path d="M8 11 V8.2 Q8 4.6 12 4.5 Q16 4.6 16.1 8.3 V11" {...stroke} stroke="currentColor" />
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

/** Hand-drawn underline under a headline. */
export function UnderlineDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 200 12" {...p}>
      <path d="M3 8 Q50 3 100 6.5 T197 5" {...stroke} stroke="var(--color-coral)" strokeWidth={3} />
    </Svg>
  );
}

/** Squiggly vertical route segment between two journey nodes. */
export function RouteDoodle(p: DoodleProps & { dashed?: boolean }) {
  const { dashed, ...rest } = p;
  return (
    <Svg viewBox="0 0 24 56" {...rest}>
      <path
        d="M12 2 Q4 14 12 28 T12 54"
        {...stroke}
        strokeDasharray={dashed ? "2 7" : undefined}
        stroke={dashed ? "var(--color-muted)" : ink}
      />
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
