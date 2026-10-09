// The museum layer's label: printed type, straight edges, like a wall label.
// Artist, title, year, medium, size and a link to the work on the Louvre's
// site. Missing facts are shown as "TBD". No heads or doodles here.

import type { Artwork } from "@/lib/types";

type Props = { artwork: Artwork; museumUrl?: string; small?: boolean };

export default function MuseumLabel({ artwork, museumUrl, small = false }: Props) {
  return (
    <div className={`min-w-0 flex-1 border border-line bg-mat leading-snug ${small ? "px-2.5 py-2 text-[13px]" : "px-3 py-2 text-sm"}`}>
      <p className="font-bold">{artwork.artist === "Unknown" ? "Unknown artist" : artwork.artist}</p>
      <p>
        <i>{artwork.title}</i>, {artwork.year}
      </p>
      <p className="text-muted">{artwork.medium ?? "Medium TBD"}</p>
      <p className="text-muted">{artwork.dimensions ?? "Size TBD"}</p>
      {museumUrl ? (
        <a href={museumUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-ultramarine underline">
          View at the Louvre →
        </a>
      ) : (
        <p className="text-muted">Louvre link TBD</p>
      )}
    </div>
  );
}
