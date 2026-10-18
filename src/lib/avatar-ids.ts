// Every avatar id that has a drawing in src/doodles/avatars.tsx.
// Kept here, free of runtime imports, so the content check (plain Node) can
// fail a speaker whose avatar has no drawing. avatars.tsx types its map as
// Record<AvatarId, …>, so TypeScript fails the build if the two lists drift.

export const AVATAR_IDS = ["leonardo", "delacroix", "gericault", "veronese", "castiglione", "ingres", "david", "caravaggio", "guide"] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];
