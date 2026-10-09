// Museum-style label beside the artwork: title, artist, year, medium, size and
// a link to the work on the Louvre's site. Missing facts are shown as "TBD".

import type { Artwork } from "@/lib/types";
import { ArtistHead, findHead } from "@/doodles/heads";

type Props = { artwork: Artwork; museumUrl?: string; compact?: boolean };

export default function MuseumLabel({ artwork, museumUrl, compact = false }: Props) {
  const head = findHead(artwork.artist);
  return (
    <div className="flex items-start gap-3 border-l-4 border-ultramarine bg-mat px-3 py-2">
      {head && !compact && <ArtistHead head={head} size={44} />}
      <div className="min-w-0 text-sm leading-snug">
        <p className="font-hand text-xl font-bold leading-tight">{artwork.title}</p>
        <p>
          {artwork.artist === "Unknown" ? "Unknown artist" : artwork.artist}
          <span className="text-muted"> · {artwork.year}</span>
        </p>
        <p className="text-muted">
          {artwork.medium ?? "Medium TBD"} · {artwork.dimensions ?? "Size TBD"}
        </p>
        {museumUrl ? (
          <a href={museumUrl} target="_blank" rel="noopener noreferrer" className="font-hand text-base text-ultramarine underline">
            View at the Louvre →
          </a>
        ) : (
          <p className="text-muted">Louvre link TBD</p>
        )}
      </div>
    </div>
  );
}
