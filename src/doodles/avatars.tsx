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
// - little or no neck.
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
//   castiglione  Baldassare Castiglione, narrator of Raphael's portrait of
//              him: peach skin, a big full rounded beard and a huge soft
//              black beret over a dark headcloth, blue eyes
//              (all from the Louvre portrait itself);
//   ingres     Jean-Auguste-Dominique Ingres, from his Self-Portrait at
//              Twenty-Four (1804, Musée Condé, Chantilly): a big tousled mop
//              of black curls tumbling onto the forehead, short dark
//              sideburns, heavy arched black brows, large dark eyes glancing
//              aside, rosy cheeks, clean-shaven;
//   guide      Lesly, the museum guide who narrates works whose maker is
//              unknown or left no documented words: a tuxedo cat dressed after
//              Vermeer's Girl with a Pearl Earring (blue headwrap, yellow
//              cloth, amber eyes, pearl earring), our own drawing.
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
  // Baldassare Castiglione, from Raphael's portrait: the huge soft black beret,
  // puffed and notched, over a dark headcloth, a big
  // full beard, round and soft, and blue eyes.
  castiglione: {
    tilt: 4,
    head: (
      <>
        <ellipse cx="19.6" cy="34" rx="2.4" ry="3.4" fill="#e3a07a" />
        <ellipse cx="44.4" cy="34" rx="2.4" ry="3.4" fill="#e3a07a" />
        <path d="M32 19.4 C39.6 19.2 44 24.6 44 32 C44 39.8 41.4 46.4 36.6 49.4 C33.8 51.2 30.2 51.2 27.4 49.4 C22.6 46.4 20 39.8 20 32 C20 24.6 24.4 19.6 32 19.4 Z" fill="#f2bf98" />
        {/* the dark headcloth under the beret, showing at the temples */}
        <path d="M19.4 31.6 C18.4 25.4 21.6 21 27 19.8 L37 19.8 C42.4 21 45.6 25.4 44.6 31.6 C43 27.4 40.2 25 36.4 24.6 C33.4 25.8 30.6 25.8 27.6 24.6 C23.8 25 21 27.4 19.4 31.6 Z" fill="#2c2724" />
        {/* the beret: a huge soft black cap, puffed and notched, sitting low */}
        <path d="M11.4 22.6 C9.6 15.2 14 8.4 21.6 5.8 C27 3.8 34.4 3.4 40.6 5.2 C48.6 7.6 54.2 13.4 53 20.6 C52.6 23.4 50.6 25.2 48 25.4 C46.6 27.6 44.6 28.6 43 27.6 C41.4 24.4 37 22.6 32 22.6 C26.6 22.6 22.2 24.6 20.6 27.6 C18 28.4 15.6 27 14.6 25 C12.8 25 11.8 24 11.4 22.6 Z" fill="#141414" />
        {brush("M16 15.6 Q25 9.6 34.6 10.4", "#3b3b3b", 1.1)}
        {brush("M38.4 9.4 Q46.6 11.4 49.6 17.6", "#3b3b3b", 1.1)}
        <path d="M45.6 16.4 L50.4 19.8 L46.2 21.2 Z" fill="#2c2c2c" />
        {brush("M24.2 29 Q27 27.6 29.8 28.6", "#4a3322", 1.5)}
        {brush("M34.2 28.6 Q37 27.6 39.8 29", "#4a3322", 1.5)}
        <path d="M32.2 30.4 L34.8 38.6 Q32.4 39.8 29.8 38.8 Z" fill="#dc9a74" />
        {/* the big full beard, round and soft, and the moustache */}
        <path d="M19.6 34.4 C17.2 42.4 17.8 51.4 22.8 57 C25.8 60.4 29 61.6 32 62 C35 61.6 38.2 60.4 41.2 57 C46.2 51.4 46.8 42.4 44.4 34.4 C42.8 39.6 40.2 42.8 37.4 43.6 C34.8 42.6 29.2 42.6 26.6 43.6 C23.8 42.8 21.2 39.6 19.6 34.4 Z" fill="#7d5a3c" />
        {brush("M23.4 47.6 Q24.4 52.4 23.2 56", "#97765a", 1.1)}
        {brush("M40.6 47.6 Q39.6 52.4 40.8 56", "#97765a", 1.1)}
        {brush("M32 50.4 L32 59", "#97765a", 1.1)}
        <path d="M26 42.6 Q32 38.8 38 42.6 Q35 43.8 32 42.8 Q29 43.8 26 42.6 Z" fill="#634530" />
      </>
    ),
    eyes: (
      <>
        <circle cx="27" cy="31.6" r="1.8" fill="#5b8fd0" />
        <circle cx="37" cy="31.6" r="1.8" fill="#5b8fd0" />
        <circle cx="27.1" cy="31.7" r="0.85" fill={INK} />
        <circle cx="37.1" cy="31.7" r="0.85" fill={INK} />
      </>
    ),
    mouthClosed: line("M29.8 46 Q32 46.8 34.2 45.8", "#c25a44"),
    mouthOpen: oval(32, 46.3, 1.9, 1.5),
  },
  // Jean-Auguste-Dominique Ingres, from his Self-Portrait at Twenty-Four
  // (1804, Musée Condé, Chantilly), the look closest to the man who painted
  // the Grande Odalisque ten years later: the big tousled mop of black curls,
  // tumbling onto the forehead, exaggerated; short dark sideburns, heavy
  // arched brows, large dark eyes glancing aside, rosy cheeks, no beard.
  // Our own drawing, not traced.
  ingres: {
    tilt: 5,
    head: (
      <>
        <ellipse cx="20.2" cy="34.4" rx="2.4" ry="3.4" fill="#e3a586" />
        <ellipse cx="44.2" cy="34" rx="2.4" ry="3.4" fill="#e3a586" />
        {/* the back of the black mop, wide and high */}
        <path d="M17.6 33.6 C13.4 29.6 12.6 22.6 15.4 17.8 C14.6 12.6 18.6 8.4 23.6 8.6 C26 5 31.6 3.8 35.6 5.8 C40 4.2 45.4 6.6 46.8 11 C51.2 12.4 52.8 17.6 50.4 21.4 C52.4 25.6 50.6 30.6 46.4 32.8 C45.6 27 43 22.6 38.6 21 C32 19.4 25 20.4 21 24.4 C19 26.8 18.2 30 17.6 33.6 Z" fill="#17110f" />
        <path d="M32.2 18.2 C39.4 18 43.6 23.2 43.8 30.6 C44 39 42 46.4 37.2 50.6 C34.6 52.8 29.8 52.8 27.2 50.6 C22.4 46.4 20.4 39 20.6 30.8 C20.8 23.4 25 18.4 32.2 18.2 Z" fill="#f4d1b6" />
        {/* short sideburns, hugging the cheeks */}
        <path d="M20.9 26.8 C20.3 31.2 20.7 35.8 21.9 39.6 C22.7 39.4 23 38.4 23 37.2 C22.7 33.8 22.7 30.4 23.2 27 Z M43.5 26.8 C44.1 31.2 43.7 35.8 42.5 39.6 C41.7 39.4 41.4 38.4 41.4 37.2 C41.7 33.8 41.7 30.4 41.2 27 Z" fill="#17110f" />
        {/* curls tumbling onto the forehead */}
        <path d="M21.4 26.2 C21.4 21.6 24.6 18.6 28.4 18.6 C27.4 21 27.8 23 29.4 24 C30 21.4 32 19.6 34.6 19.8 C33.8 22 34.4 23.8 36 24.6 C36.8 22.2 39 20.8 41.4 21.6 C40.4 23 40.6 24.8 42.2 26.2 C43.2 22.4 42 18.6 38.4 16.6 C34 14.4 27.4 14.8 23.8 18 C21.6 20 20.8 23 21.4 26.2 Z" fill="#17110f" />
        <path d="M25.2 24.4 C24.2 26.2 24.8 28 26.4 28.6 C25.8 27.2 26 25.8 27.2 24.8 Z" fill="#17110f" />
        {brush("M17.6 18 Q20 13.6 24.4 12.6", "#3d2f29", 1.1)}
        {brush("M28.4 9.4 Q32.6 7.6 36.4 9", "#3d2f29", 1.1)}
        {brush("M41.4 11.6 Q45.6 13 47 17", "#3d2f29", 1.1)}
        {brush("M46.6 22.6 Q48.6 25.6 47.6 29", "#3d2f29", 1.1)}
        {brush("M23.8 30 Q26.6 27.4 30 28.6", "#17110f", 1.9)}
        {brush("M34.4 28.4 Q37.8 27.2 40.6 29.6", "#17110f", 1.9)}
        <ellipse cx="26.4" cy="40.2" rx="2.3" ry="1.5" fill="#ee9f8f" />
        <ellipse cx="38.4" cy="40" rx="2.3" ry="1.5" fill="#ee9f8f" />
        <path d="M32.4 31.2 L35 40.2 Q32.6 41.4 30 40.4 Z" fill="#d9907a" />
      </>
    ),
    eyes: (
      <>
        <ellipse cx="27" cy="32.6" rx="2.6" ry="1.7" fill="#fdf8ef" />
        <ellipse cx="37.6" cy="32.4" rx="2.6" ry="1.7" fill="#fdf8ef" />
        <circle cx="26.2" cy="32.7" r="1.45" fill={INK} />
        <circle cx="36.8" cy="32.5" r="1.45" fill={INK} />
      </>
    ),
    mouthClosed: line("M29.8 45.2 Q32.2 45.9 34.6 45", "#b8433a"),
    mouthOpen: oval(32.2, 45.6, 2.1, 1.7),
  },
  // Lesly, the young museum guide: a tuxedo cat dressed after Vermeer's Girl
  // with a Pearl Earring (our own drawing): an ultramarine headwrap with the
  // pale-yellow cloth falling behind, ears poking out, big round amber eyes, a
  // tiny pink nose and a pearl earring, the head turned a little.
  guide: {
    tilt: -7,
    head: (
      <>
        {/* the pale-yellow cloth, rising from the wrap and falling behind */}
        <path d="M21.6 15.6 C25 8.4 35 5.2 42.6 7.4 C48.6 9.2 52 14 52.4 20.4 C52.8 31 51.6 44 54.6 62 L42.4 62 C43.2 50 42.6 38 40.4 27 C34 23 27 19.6 21.6 15.6 Z" fill="#efdc9a" />
        <path d="M42.6 55.6 Q48.6 54.6 54 55 L54.8 62 L42.4 62 Z" fill="#5d70b4" />
        {brush("M46.8 20 Q48.4 34 47.8 50", "#d8c27c", 1.1)}
        {/* ears poking out of the wrap */}
        <path d="M17.4 25.4 L18.4 12.6 L27 18.8 Z M38.6 18 L46.8 12.4 L47 25 Z" fill="#262326" />
        <path d="M19.4 21 L19.8 15.6 L23.4 18.6 Z M42.4 18.2 L45.6 15.8 L45.6 21 Z" fill="#e9a0a8" />
        {/* the face: white fur with black tuxedo patches over the eyes and ears */}
        <path d="M32 18.4 C42.4 18.4 48 24.4 48 32.4 C48 41.4 41.4 48 32 48 C22.6 48 16 41.4 16 32.4 C16 24.4 21.6 18.4 32 18.4 Z" fill="#f1eee8" />
        <path d="M16.2 31 C16.2 24 21.8 18.8 32 18.8 C42.2 18.8 47.8 24 47.8 31 C47.8 35.2 47 38.2 45.4 40.4 C43.2 36.4 40.2 33.6 37 33.2 C35 33 33.4 34.2 32 36.2 C30.6 34.2 29 33 27 33.2 C23.8 33.6 20.8 36.4 18.6 40.4 C17 38.2 16.2 35.2 16.2 31 Z" fill="#262326" />
        <path d="M32 36.2 C30.2 32 29.8 27 30.8 22.4 L33.2 22.4 C34.2 27 33.8 32 32 36.2 Z" fill="#f1eee8" />
        {/* the ultramarine headwrap */}
        <path d="M15.4 24.6 C17.6 17.4 24.8 13.2 33 13.4 C41.2 13.6 47.4 17.4 49 23.4 C49.4 26 48.8 27.4 47.8 28.4 C41.2 25 23 24.8 16.4 28.8 C15.4 27.4 15 26.2 15.4 24.6 Z" fill="#2a3f8f" />
        {brush("M19.6 22.4 Q32 17.2 45.2 21.4", "#4a5fae", 1.2)}
        <path d="M30.6 37.6 L33.4 37.6 L32 39.2 Z" fill="#f09aa6" />
        {/* whiskers */}
        {brush("M23.4 40.4 L13.6 39.4 M23.6 42 L14.4 43.2", "#b6b1aa", 0.7)}
        {brush("M40.6 40.4 L50.4 39.4 M40.4 42 L49.6 43.2", "#b6b1aa", 0.7)}
        {/* the pearl earring */}
        <circle cx="45.4" cy="45.4" r="2.1" fill="#f6f4ee" />
        <path d="M43.4 46 A2.1 2.1 0 0 0 47.4 46 A2.4 1.6 0 0 1 43.4 46 Z" fill="#c4c8d2" />
        <circle cx="44.8" cy="44.7" r="0.6" fill="#fff" />
      </>
    ),
    eyes: (
      <>
        <circle cx="25.6" cy="31.2" r="3.6" fill="#e9a227" />
        <circle cx="38.4" cy="31.2" r="3.6" fill="#e9a227" />
        <circle cx="25.8" cy="31.4" r="2" fill={INK} />
        <circle cx="38.6" cy="31.4" r="2" fill={INK} />
        <circle cx="26.6" cy="30.4" r="0.75" fill="#fff" />
        <circle cx="39.4" cy="30.4" r="0.75" fill="#fff" />
      </>
    ),
    mouthClosed: (
      <>
        {brush("M32 39.2 L32 40.4", "#7a5252", 0.8)}
        {brush("M29.8 40.4 Q30.9 41.5 32 40.4 Q33.1 41.5 34.2 40.4", "#7a5252", 0.85)}
      </>
    ),
    mouthOpen: (
      <>
        {brush("M32 39.2 L32 40", "#7a5252", 0.8)}
        <ellipse cx="32" cy="41.4" rx="1.7" ry="1.5" fill="#c4505c" />
        <ellipse cx="32" cy="41.6" rx="1" ry="0.8" fill={MOUTH} />
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
