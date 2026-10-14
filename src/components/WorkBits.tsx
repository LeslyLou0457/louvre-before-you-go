// Small pieces of the contents and chapter pages (PRODUCT.md "Status").
// Chips and dots are doodle chrome; the photo tile is the artwork layer:
// the real photo on a white mat, straight edges, never moving. A work
// without a level gets a labelled placeholder, never a drawing of the work.

import { CheckDoodle, ClockDoodle, EyeOffDoodle, PictureDoodle, PlayDoodle, ZoomDoodle } from "@/doodles";
import { OFF_LABEL, type WorkState } from "@/lib/book";
import type { BookWork } from "@/lib/catalogue";
import { withBase } from "@/lib/paths";
import type { SavedPlace } from "@/lib/progress";

type ChipProps = { work: BookWork; state: WorkState; place?: SavedPlace | null; closeUpDone?: boolean };

export function StatusChip({ work, state, place, closeUpDone }: ChipProps) {
  const off = OFF_LABEL[work.display];
  return (
    <>
      {state === "met" && (
        <span className="chip chip-met">
          <CheckDoodle /> Met
        </span>
      )}
      {/* "Close-up done": a second mark beside "Met" (PRODUCT.md "Level state"). */}
      {closeUpDone && (
        <span className="chip chip-met">
          <ZoomDoodle /> Close-up done
        </span>
      )}
      {state === "cont" && (
        <span className="chip chip-ready">
          <PlayDoodle /> Continue · {place?.answered ?? 0} of {work.level?.questionCount}
        </span>
      )}
      {state === "ready" && (
        <span className="chip chip-ready">
          <PlayDoodle /> Play
        </span>
      )}
      {state === "soon" && (
        <span className="chip chip-soon">
          <ClockDoodle /> Coming soon
        </span>
      )}
      {/* Display is a second, independent fact: a not-on-view work says so even when it has a level. */}
      {off && (
        <span className="chip chip-off">
          <EyeOffDoodle /> {off}
        </span>
      )}
      {work.display === "restricted" && <span className="text-[13px] leading-snug text-muted">Access restricted: check before visiting</span>}
      {work.display === "tbd" && <span className="text-[13px] leading-snug text-muted">Room and display not confirmed</span>}
    </>
  );
}

/** One dot per work, in module order. Decorative: the summary text beside it says the same in words. */
export function ProgressDots({ states }: { states: WorkState[] }) {
  if (!states.length) return null;
  return (
    <span className="dots" aria-hidden="true">
      {states.map((s, i) => (
        <i key={i} className={s} />
      ))}
    </span>
  );
}

/** The work's photo on a white mat when its level has shipped; otherwise the dashed placeholder. */
export function PhotoTile({ work }: { work: BookWork }) {
  if (work.level?.image) {
    return (
      <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center border border-line bg-white p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBase(work.level.image)} alt="" className="block h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <span className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center gap-[3px] border-2 border-dashed border-[#a8a091] bg-paper text-center leading-none text-muted">
      <PictureDoodle className="h-[26px] w-[26px]" />
      <span className="text-[8.5px] font-extrabold uppercase tracking-[0.06em]">
        Photo comes
        <br />
        with the level
      </span>
    </span>
  );
}
