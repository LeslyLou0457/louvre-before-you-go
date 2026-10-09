// PLACEHOLDER ARTIST HEADS.
//
// Flat painted heads: blocks of colour, no outlines (PRODUCT.md "Design").
// These are deliberately crude geometric stand-ins typed by hand, not
// portraits and not AI art. Replace each one with the hand-drawn SVG when it
// arrives: keep the key in HEADS and swap the shapes inside.
//
// Lines in content can carry an optional "speaker" (e.g. "Leonardo da Vinci");
// findHead() matches it to a head by name. Works with no known maker get no
// head; their lines are plain narration.

type Shapes = React.ReactNode;

type Head = {
  /** Display name for the speech bubble. */
  name: string;
  /** Names and short forms that point at this head (lower case). */
  aliases: string[];
  shapes: Shapes;
};

// All heads share a 64×64 canvas sitting in a white circle.
const HEADS: Record<string, Head> = {
  leonardo: {
    name: "Leonardo da Vinci",
    aliases: ["leonardo da vinci", "leonardo", "da vinci", "leonardo-da-vinci"],
    shapes: (
      <>
        <ellipse cx="32" cy="27" rx="14" ry="15" fill="#f4a7b9" />
        <path d="M17 18 Q32 4 47 18 L47 24 Q32 14 17 24 Z" fill="#8c8f9b" />
        <path d="M18 30 Q20 58 32 60 Q44 58 46 30 Q40 40 32 40 Q24 40 18 30 Z" fill="#d9d6cf" />
        <ellipse cx="32" cy="30" rx="3.2" ry="5" fill="#f08a3c" />
        <circle cx="26" cy="25" r="1.8" fill="#1f1f1f" />
        <circle cx="38" cy="25" r="1.8" fill="#1f1f1f" />
      </>
    ),
  },
  delacroix: {
    name: "Eugène Delacroix",
    aliases: ["eugène delacroix", "eugene delacroix", "delacroix", "eugene-delacroix"],
    shapes: (
      <>
        <ellipse cx="32" cy="32" rx="14" ry="17" fill="#f6c6a8" />
        <path d="M17 26 Q18 10 32 10 Q47 10 47 26 Q40 17 32 18 Q24 17 17 26 Z" fill="#2b2622" />
        <path d="M24 40 Q32 36 40 40 Q32 43 24 40 Z" fill="#2b2622" />
        <ellipse cx="32" cy="33" rx="3" ry="4.5" fill="#2a3f8f" />
        <circle cx="26" cy="28" r="1.8" fill="#1f1f1f" />
        <circle cx="38" cy="28" r="1.8" fill="#1f1f1f" />
      </>
    ),
  },
  gericault: {
    name: "Théodore Géricault",
    aliases: ["théodore géricault", "theodore gericault", "géricault", "gericault", "theodore-gericault"],
    shapes: (
      <>
        <ellipse cx="32" cy="33" rx="14" ry="16" fill="#f9d3c0" />
        <circle cx="21" cy="17" r="7" fill="#7a4a2a" />
        <circle cx="32" cy="13" r="8" fill="#7a4a2a" />
        <circle cx="43" cy="17" r="7" fill="#7a4a2a" />
        <path d="M17 24 L21 24 L21 40 Q18 36 17 30 Z M47 24 L43 24 L43 40 Q46 36 47 30 Z" fill="#7a4a2a" />
        <ellipse cx="32" cy="34" rx="3" ry="4.5" fill="#3fa37a" />
        <circle cx="26" cy="29" r="1.8" fill="#1f1f1f" />
        <circle cx="38" cy="29" r="1.8" fill="#1f1f1f" />
      </>
    ),
  },
};

/** Generic head for a speaker with no drawing yet. */
const GENERIC: Shapes = (
  <>
    <ellipse cx="32" cy="32" rx="14" ry="16" fill="#f4a7b9" />
    <ellipse cx="32" cy="33" rx="3" ry="4.5" fill="#f08a3c" />
    <circle cx="26" cy="28" r="1.8" fill="#1f1f1f" />
    <circle cx="38" cy="28" r="1.8" fill="#1f1f1f" />
  </>
);

export type FoundHead = { key: string | null; name: string; shapes: Shapes };

/** Matches a speaker or artist name to a head. Null for no name / "Unknown". */
export function findHead(name: string | undefined): FoundHead | null {
  if (!name || /^unknown$/i.test(name.trim())) return null;
  const n = name.trim().toLowerCase();
  for (const [key, head] of Object.entries(HEADS)) {
    if (key === n || head.aliases.includes(n)) return { key, name: head.name, shapes: head.shapes };
  }
  return { key: null, name: name.trim(), shapes: GENERIC };
}

/** A painted head in a white circle. */
export function ArtistHead({ head, size = 56 }: { head: FoundHead; size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={head.name}
      className="shrink-0 rounded-full bg-white"
    >
      {head.shapes}
    </svg>
  );
}
