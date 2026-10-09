// "Question n / 5" with one hand-drawn segment per question.

type Props = { current: number; answered: number; total: number };

export default function ProgressBar({ current, answered, total }: Props) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`wobbly h-3 flex-1 border-2 border-ink ${i < answered ? "bg-ultramarine" : "bg-mat"}`}
          />
        ))}
      </div>
      <span className="shrink-0 font-hand text-lg" aria-live="polite">
        Question {current} / {total}
      </span>
    </div>
  );
}
