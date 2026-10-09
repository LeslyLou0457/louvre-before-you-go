// The character layer: the beige "stage" under the artwork. A node with a
// `voice` shows the speaker's head and an ink speech bubble with their line
// (handwriting); an imagined line is tagged as such, a quote shows quotation
// marks and its citation. A node without a voice shows the level's narrator
// with no bubble. No narrator and no voice: no stage.

import { Avatar } from "@/doodles/avatars";
import type { Speaker, Voice } from "@/lib/types";

type Props = {
  narrator?: Speaker;
  voice?: Voice;
  speakers: Record<string, Speaker>;
};

export default function Stage({ narrator, voice, speakers }: Props) {
  const speaker = voice ? speakers[voice.speaker] : narrator;
  if (!speaker) return null;

  if (!voice) {
    return (
      <div className="flex items-center gap-3 bg-stage px-3 py-2">
        <Avatar speaker={speaker} size={44} />
        <span className="font-hand text-lg leading-tight text-muted">{speaker.name}</span>
      </div>
    );
  }

  const isQuote = voice.kind === "quote";
  return (
    <figure className="flex flex-col gap-1.5 bg-stage px-3 py-3">
      <div className="flex items-start gap-2">
        <Avatar speaker={speaker} size={56} className="mt-1" />
        <div className="relative flex-1 pl-2">
          {/* Bubble tail, drawn in the same ink line as the bubble. */}
          <svg viewBox="0 0 14 20" className="absolute left-0 top-5 h-5 w-3.5" aria-hidden="true">
            <path d="M14 2 Q6 8 0.8 10.5 Q6.5 12.5 14 18" fill="var(--color-mat)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <blockquote className="wobbly-alt border-2 border-ink bg-mat px-4 py-2.5 font-hand text-[1.3rem] leading-snug">
            {isQuote ? <>&ldquo;{voice.text}&rdquo;</> : voice.text}
          </blockquote>
        </div>
      </div>
      <figcaption className="pl-1 text-xs leading-snug text-muted">
        <span className="font-hand text-base text-ink">{speaker.name}</span>
        <br />
        {isQuote ? <cite className="not-italic">{voice.cite ?? "Source TBD"}</cite> : "Imagined voice, built from sourced facts"}
      </figcaption>
    </figure>
  );
}
