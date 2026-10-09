// After a wrong pick: a paper card under the branch text that says clearly
// the answer isn't right, then why it's tempting, what's actually true and
// the evidence that settles it. Doodle layer: ink line, handwriting labels,
// never red (PRODUCT.md "Design"). Content field: branch `correction`.

import type { Correction as CorrectionT } from "@/lib/types";

const DEFAULT_VERDICT = {
  "near-miss": "Close, but not quite",
  myth: "Not quite: a popular idea, but wrong",
} as const;

export default function Correction({ correction }: { correction: CorrectionT }) {
  const verdict = correction.verdict ?? DEFAULT_VERDICT[correction.kind ?? "near-miss"];
  const rows = [
    ["Why it's tempting", correction.tempting],
    ["What's actually true", correction.truth],
    ["How we know", correction.evidence],
  ] as const;

  return (
    <span
      role="note"
      className="block border-2 border-ink bg-mat px-4 py-3"
      style={{ borderRadius: "14px 24px 12px 26px / 24px 12px 26px 14px" }}
    >
      <span className="flex items-center gap-2 font-hand text-[1.45rem] font-bold leading-tight">
        {/* A hand-drawn wavy mark, not a red cross. */}
        <svg viewBox="0 0 28 14" className="h-3.5 w-7 shrink-0" aria-hidden="true">
          <path
            d="M2 9 Q6 2 10 7 T18 7 T26 5"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        {verdict}
      </span>
      {rows.map(([label, body]) => (
        <span key={label} className="mt-2 block">
          <span className="block font-hand text-lg leading-tight text-muted">{label}</span>
          <span className="block text-[16px] leading-relaxed">{body}</span>
        </span>
      ))}
    </span>
  );
}
