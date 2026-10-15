// Reads the player's progress for the contents and chapter pages from the
// existing keys (lib/progress). Client components only.

import { useEffect, useState } from "react";
import type { Progress } from "./book";
import type { BookWork } from "./catalogue";
import { getCompleted, getPlace, getPlays, type SavedPlace } from "./progress";

const EMPTY: Progress = { completed: new Set(), places: {}, plays: {} };

/**
 * Reads the player's progress for the given works once, after the first
 * render (localStorage is browser-only). Until then every level reads as
 * not started.
 */
export function useProgress(works: BookWork[]): Progress {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  useEffect(() => {
    const completed = new Set(getCompleted());
    const places: Record<string, SavedPlace | null> = {};
    const plays: Record<string, number> = {};
    for (const w of works) {
      if (w.level) places[w.level.id] = getPlace(w.level.id, w.level.nodeIds, w.level.questionCount);
      // Close-up rounds save their place under their own lesson id, roundSize questions a round.
      if (w.round) {
        places[w.round.id] = getPlace(w.round.id, w.round.nodeIds, w.round.roundSize);
        plays[w.round.id] = getPlays(w.round.id);
      }
    }
    setProgress({ completed, places, plays });
  }, [works]);
  return progress;
}
