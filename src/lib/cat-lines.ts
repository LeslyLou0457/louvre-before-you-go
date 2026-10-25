// What Lulu, the Siamese cat, says on a level-cleared page (PRODUCT.md "Baguette
// progress"). Warm thanks only: no art facts, nothing about the work, so a
// line can never leak an answer or need a source. One line per level, picked
// from this small pool by the level id, so the same level always says the
// same thing and neighbouring levels usually differ.

export const FULL_CAT_LINES = [
  "Thank you for learning something new today. That filled me right up!",
  "Every answer was one more bite. I'm stuffed, and you're a little wiser.",
  "That was the whole baguette! Come back tomorrow and I'll be hungry again.",
  "Crumbs everywhere and a new story in your pocket. A good day's work!",
  "You learned, I munched. A very good deal for both of us.",
  "Full belly, happy cat. Thanks for sharing the learning with me.",
] as const;

export function fullCatLine(levelId: string): string {
  let h = 0;
  for (const ch of levelId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FULL_CAT_LINES[h % FULL_CAT_LINES.length];
}
