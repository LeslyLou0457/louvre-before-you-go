// Types for the content format in PRODUCT.md ("Data format").
// One JSON file per artwork in content/. The site only presents this data.

export type Museum = {
  id: string;
  name: string;
  city: string;
};

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  year: string;
  /** Path under public/, e.g. "/images/mona-lisa.jpg" (no basePath). */
  image: string;
  imageCredit: string;
  /** Optional museum-label fields. Missing values are shown as "TBD". */
  medium?: string;
  dimensions?: string;
  /** Link to the work on the museum's own site. */
  museumUrl?: string;
};

/** Someone who can speak in a content file (optional `speakers` map). */
export type Speaker = {
  /** Shown under the head. */
  name: string;
  /**
   * "artist"; "person" for another documented figure; "guide" for Lesly, the
   * museum guide (a cat) who narrates works whose maker is unknown.
   */
  kind: "artist" | "person" | "guide";
  /** Id of the drawing in src/doodles/avatars.tsx (listed in src/lib/avatar-ids.ts). */
  avatar: string;
};

/**
 * Optional line in a speech bubble beside the speaker's head. The node's own
 * `text` stays the narration in print; this is the speaker's line.
 */
export type Voice = {
  /** Id from the file's `speakers`. */
  speaker: string;
  kind: "imagined" | "quote";
  text: string;
  /** Quotes only: short attribution shown under the bubble. */
  cite?: string;
  /** Quotes only: URL, also listed in the level's sources. */
  source?: string;
};

/**
 * Close-Up Challenge only: the region of the reference image a question
 * zooms into, as fractions (0–1) of the full image, top-left origin.
 */
export type Zoom = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** What the region shows; also the crop's alt text. */
  label: string;
  /** Path of the crop under public/, e.g. "/images/challenge/mona-lisa/c1.jpg" (no basePath). */
  image: string;
};

/** A source as players see it (Close-Up Challenge questions). */
export type SourceRef = { title: string; url: string };

export type StoryNode = {
  type: "story";
  text: string;
  /** Missing on the last node of a level. */
  next?: string;
  voice?: Voice;
  /** Close-Up Challenge intro nodes only. */
  zoom?: Zoom;
};

/**
 * Optional correction on a wrong-answer branch, shown as a card under the
 * branch text: a clear "not quite", why the idea is tempting, what is
 * actually true, and the evidence that settles it. Never shown in red.
 */
export type Correction = {
  /** "near-miss": a real neighbouring idea; "myth": a popular but wrong idea. Sets the default heading. */
  kind?: "near-miss" | "myth";
  /** Short heading in handwriting; defaults from `kind`. */
  verdict?: string;
  /** Why the wrong idea is tempting. */
  tempting: string;
  /** What is actually true. */
  truth: string;
  /** The detail in the work, or the documented fact, that settles it. */
  evidence: string;
};

export type BranchNode = {
  type: "branch";
  text: string;
  next?: string;
  voice?: Voice;
  /** Wrong-answer branches only. */
  correction?: Correction;
};

export type Choice = {
  label: string;
  next: string;
  correct?: boolean;
  /** Close-Up Challenge only: "myth" is an approved exception to two near misses. */
  role?: "right" | "near-miss" | "myth";
};

export type QuestionNode = {
  type: "question";
  text: string;
  choices: Choice[];
  /** Close-Up Challenge only: the same zoom as the question's intro. */
  zoom?: Zoom;
  /** Close-Up Challenge only: shown under the question's merge line. */
  sources?: SourceRef[];
};

export type LessonNode = StoryNode | BranchNode | QuestionNode;

export type Lesson = {
  id: string;
  order: number;
  title: string;
  start: string;
  /** Speaker id of the level's main narrator. Missing means no head. */
  narrator?: string;
  nodes: Record<string, LessonNode>;
  takeaway: string;
  sources: string[];
};

export type ContentFile = {
  museum: Museum;
  artwork: Artwork;
  speakers?: Record<string, Speaker>;
  lessons: Lesson[];
};

/** One playable level as the app sees it, in journey order. */
export type Level = {
  /** Position on the journey, 0-based. */
  index: number;
  lesson: Lesson;
  artwork: Artwork;
  museum: Museum;
  /** The file's speakers (empty when it has none). */
  speakers: Record<string, Speaker>;
  /** Number of question nodes in the level. */
  questionCount: number;
  /** True when the image file exists under public/; false shows a placeholder. */
  imageAvailable: boolean;
  /** Content file the level came from, for error messages and the about page. */
  file: string;
};

/**
 * Close-Up Challenge (PRODUCT.md "Close-Up Challenge" and "Challenge
 * files"): one file per artwork in content/challenge/.
 */
export type ZoomImage = {
  /** Commons file name of the high-resolution reference image. */
  file: string;
  /** Its Commons file page. */
  commons: string;
  width: number;
  height: number;
  licence: string;
  credit: string;
  /** Small copy of the whole reference image, for the "see where" thumbnail. */
  overview: string;
};

export type ChallengeLesson = {
  id: string;
  kind: "challenge";
  order: number;
  title: string;
  narrator?: string;
  unlock: "all-base-levels";
  roundSize: number;
  /** Ordered intro-node ids of the questions in the rotation. */
  pool: string[];
  /** Sourced questions kept out of the rotation, with the reason. */
  held?: { start: string; why: string }[];
  nodes: Record<string, LessonNode>;
};

export type ChallengeFile = {
  /** The level file's artwork.id. */
  artworkId: string;
  zoomImage: ZoomImage;
  lessons: ChallengeLesson[];
  /** Audit trail per question node id; ignored by the app. */
  review: Record<string, unknown>;
};

/** One playable challenge round as the app sees it, in route order. */
export type Round = {
  index: number;
  lesson: ChallengeLesson;
  artwork: Artwork;
  speakers: Record<string, Speaker>;
  zoomImage: ZoomImage;
  /** Lesson id of the artwork's level. */
  levelId: string;
  file: string;
};

/**
 * The 0.6 catalogue (PRODUCT.md "0.6 · Museum framework" and "Catalogue
 * file"): content/modules.json, with the wings, the 15 modules, the
 * "Beyond the 15" appendix and every work's place and display status.
 */
export type WingId = "denon" | "sully" | "richelieu";

export type Wing = {
  id: WingId;
  name: string;
  /** The Louvre's levels (−1 to 2) that the catalogue uses in this wing. */
  floors: number[];
};

/** PRODUCT.md "Status": the last four count as "not on view" and are listed last in a module. */
export type DisplayStatus =
  | "on-display"
  | "restricted"
  | "tbd"
  | "room-closed"
  | "not-on-display"
  | "on-loan"
  | "appointment-only";

export type WorkLocation = {
  wing: WingId;
  floor: number;
  /** The Louvre's room number as a string ("711"), or null for a spot with no number. */
  room: string | null;
  /** The room's name, when it has one ("Salle des États"). */
  roomName?: string;
  /** Required when `room` is null ("Escalier Mollien (upper)"). */
  place?: string;
};

export type CatalogueWork = {
  /** Unique in the file; for a work with a level, the level file's artwork.id. */
  id: string;
  title: string;
  /** The record's own (French) title, when it differs from the English one. */
  titleFr?: string;
  /** The maker, or the culture when the maker is unknown. */
  artist: string;
  date: string;
  /** Materials and technique, in English, from the record; "TBD" when not confirmed. */
  medium: string;
  department: string;
  inventory: string;
  /** Null when the work is not on display, on loan or by appointment only. */
  location: WorkLocation | null;
  display: DisplayStatus;
  /** The reason, for any display other than "on-display". */
  displayNote?: string;
  /** Optional: the reason in plain words for the chapter row, when it says more than the chip. */
  rowNote?: string;
  /** When the record was checked, YYYY-MM-DD. */
  checkedOn: string;
  /** The collections.louvre.fr record, or null when there is none. */
  museumUrl: string | null;
  /** Lesson id of the work's level. Missing means "Coming soon". */
  levelId?: string;
  /** Editorial note on the placement, for people; not shown to players. */
  note?: string;
};

export type CatalogueModule = {
  /** "01" … "15": the module number, also its route. */
  id: string;
  slug: string;
  title: string;
  status: "open" | "rooms-closed";
  /** With "rooms-closed": what is closed, and when it was checked. */
  closedNote?: string;
  checkedOn?: string;
  /** In module order: on view by room number, on view without a number, then not on view. */
  works: CatalogueWork[];
};

export type Catalogue = {
  museum: string;
  wings: Wing[];
  modules: CatalogueModule[];
  appendix: { id: "beyond"; slug: string; title: string; works: CatalogueWork[] };
};
