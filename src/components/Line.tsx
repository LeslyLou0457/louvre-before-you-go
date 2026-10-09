// One passage of text. Lines with a `speaker` sit in that speaker's speech
// bubble next to their painted head; lines without one are plain narration.

import { ArtistHead, findHead } from "@/doodles/heads";

type Props = { text: string; speaker?: string };

export default function Line({ text, speaker }: Props) {
  const head = findHead(speaker);
  if (!head) {
    return <p>{text}</p>;
  }
  return (
    <div className="flex items-start gap-3">
      <ArtistHead head={head} size={52} />
      <div className="wobbly-alt relative flex-1 border-2 border-ink bg-mat px-4 py-3">
        <p className="font-hand text-sm text-muted">{head.name}</p>
        <p className="text-[17px]">{text}</p>
      </div>
    </div>
  );
}
