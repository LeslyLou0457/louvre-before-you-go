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

/**
 * Optional: who voices a line. When present, the line is shown in that
 * speaker's speech bubble next to their head; when absent, it is plain
 * narration. Free text (e.g. "Leonardo da Vinci"); matched to a head by name.
 */
type Spoken = { speaker?: string };

export type StoryNode = Spoken & {
  type: "story";
  text: string;
  /** Missing on the last node of a level. */
  next?: string;
};

export type BranchNode = Spoken & {
  type: "branch";
  text: string;
  next?: string;
};

export type Choice = {
  label: string;
  next: string;
  correct?: boolean;
};

export type QuestionNode = Spoken & {
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
  nodes: Record<string, LessonNode>;
  takeaway: string;
  sources: string[];
};

export type ContentFile = {
  museum: Museum;
  artwork: Artwork;
  lessons: Lesson[];
};

/** One playable level as the app sees it, in journey order. */
export type Level = {
  /** Position on the journey, 0-based. */
  index: number;
  lesson: Lesson;
  artwork: Artwork;
  museum: Museum;
  /** Number of question nodes in the level. */
  questionCount: number;
  /** True when the image file exists under public/; false shows a placeholder. */
  imageAvailable: boolean;
  /** Content file the level came from, for error messages and the about page. */
  file: string;
};
