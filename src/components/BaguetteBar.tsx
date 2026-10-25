// The baguette progress bar (PRODUCT.md "Baguette progress"): a long loaf
// along the bottom of a level, with the Siamese cat chewing at its left end.
// Each answered question is one more share eaten: the cat moves along and the
// eaten part is gone. Tied to the same `answered` count as "Question n / N",
// so a resumed level shows the same amount eaten. When the count goes up the
// cat gives one small chomp (a one-shot, not on a resumed screen, none under
// reduced motion).

import type { CSSProperties } from "react";
import { Baguette, SiameseChew } from "@/doodles/cats";

const CAT = 44; // px

export default function BaguetteBar({ answered, total, chomp }: { answered: number; total: number; chomp?: boolean }) {
  const share = total > 0 ? Math.min(answered / total, 1) : 0;
  const done = share >= 1;
  return (
    <div
      role="progressbar"
      aria-label="Baguette eaten"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(answered, total)}
      aria-valuetext={`${Math.min(answered, total)} of ${total} questions answered`}
      className="relative h-14 overflow-x-clip"
      style={{ "--share": share, "--cat": `${CAT}px` } as CSSProperties}
    >
      {!done && (
        <Baguette
          className="absolute inset-x-0 bottom-1 h-6 w-full"
          style={{ clipPath: `inset(0 0 0 calc(${share} * (100% - var(--cat)) + var(--cat) * 0.7))` }}
        />
      )}
      {/* The cat travels in a box one cat narrower than the bar, so it never runs past the end. */}
      <div className="absolute inset-y-0 left-0" style={{ right: `${CAT}px` }}>
        <div className="h-full" style={{ transform: `translateX(${share * 100}%)` }}>
          <SiameseChew key={answered} className={`h-11 w-11 ${chomp ? "m-chomp" : ""}`} />
        </div>
      </div>
    </div>
  );
}
