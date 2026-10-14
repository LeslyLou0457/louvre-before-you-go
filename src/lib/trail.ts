// The "Start here" trail (PRODUCT.md "Progress, 'Next up' and seals"): the
// five 0.5 levels, in route order, with the Close-Up Challenge gated on all
// five. Levels added later (build step 8) live in their chapters only and
// never join the trail, so the trail and its gate never change for players.
// Pure data, shared by the app and the content check (plain Node).

export const TRAIL_LEVEL_IDS = [
  "mona-lisa-1",
  "venus-de-milo-1",
  "winged-victory-1",
  "liberty-leading-the-people-1",
  "raft-of-the-medusa-1",
] as const;

export function isTrailLevel(lessonId: string): boolean {
  return (TRAIL_LEVEL_IDS as readonly string[]).includes(lessonId);
}
