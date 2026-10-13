// "Question n / 5" with one hand-drawn segment per question: answered ones
// gold-brown (done), the current one ringed in ultramarine (you are here).
// The segment answered on this screen (`filled`) fills gold from the left,
// once (PRODUCT.md "Motion"); gold means "answered", right or wrong.

type Props = { current: number; answered: number; total: number; filled?: number };

export default function ProgressBar({ current, answered, total, filled }: Props) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`wobbly relative h-3 flex-1 overflow-hidden border-2 bg-mat ${
              i >= answered && i === current - 1 ? "border-ultramarine" : "border-ink"
            }`}
          >
            {i < answered && <span className={`absolute inset-0 bg-gold ${i === filled ? "m-fill" : ""}`} />}
          </span>
        ))}
      </div>
      <span className="shrink-0 font-hand text-lg" aria-live="polite">
        Question {current} / {total}
      </span>
    </div>
  );
}
