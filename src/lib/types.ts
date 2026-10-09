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
  /** "artwork" when a statue with no known maker speaks; "person" for another documented figure. */
  kind: "artist" | "artwork" | "person";
  /** Id of the drawing in src/doodles/avatars.tsx. */
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

export type StoryNode = {
  type: "story";
  text: string;
  /** Missing on the last node of a level. */
  next?: string;
  voice?: Voice;
};

export type BranchNode = {
  type: "branch";
  text: string;
  next?: string;
  voice?: Voice;
};

export type Choice = {
  label: string;
  next: string;
  correct?: boolean;
};

export type QuestionNode = {
  type: "question";
  text: string;
  choices: Choice[];
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
