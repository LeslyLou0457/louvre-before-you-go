"use client";

// The artwork layer: the real photo on a plain white mat. Straight edges, no
// filters, nothing drawn over it. Tapping it opens the same photo full screen,
// where the browser's own pinch-zoom works; tapping the photo there switches
// between "fit the screen" and "actual size" (scroll to look around).
// The Close-Up Challenge passes a detail crop of the same photo, with its own alt text.

import { useEffect, useState } from "react";
import { CloseDoodle, ZoomDoodle } from "@/doodles";
import { withBase } from "@/lib/paths";

type Props = {
  image: string;
  title: string;
  artist: string;
  available: boolean;
  /** Alt text; defaults to "title, artist". */
  alt?: string;
  /** Tailwind max-height for the inline photo. */
  maxHeightClass?: string;
  className?: string;
};

export default function Artwork({
  image,
  title,
  artist,
  available,
  alt: altText,
  maxHeightClass = "max-h-[30dvh]",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [actualSize, setActualSize] = useState(false);
  const alt = altText ?? `${title}, ${artist === "Unknown" ? "unknown artist" : artist}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!available) return <Placeholder title={title} image={image} className={className} />;

  const src = withBase(image);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setActualSize(false);
          setOpen(true);
        }}
        className={`block bg-mat p-2.5 ${className}`}
        aria-label={`Open ${title} full screen to zoom`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={`mx-auto block h-auto max-w-full ${maxHeightClass}`} />
        <span className="mt-1 flex items-center justify-center gap-1 font-hand text-base leading-none text-muted">
          <ZoomDoodle className="h-4 w-4" /> tap to zoom
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, full photo`}
          className="fixed inset-0 z-50 overflow-auto bg-mat"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-mat"
            aria-label="Close"
          >
            <CloseDoodle className="h-6 w-6" />
          </button>
          <div className={actualSize ? "p-4" : "flex min-h-full items-center justify-center p-4"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              onClick={() => setActualSize((v) => !v)}
              className={actualSize ? "block max-w-none" : "block max-h-[calc(100dvh-2rem)] max-w-full object-contain"}
            />
          </div>
          <p className="fixed bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-mat px-3 font-hand text-base text-muted">
            {actualSize ? "tap photo to fit screen" : "pinch to zoom · tap photo for actual size"}
          </p>
        </div>
      )}
    </>
  );
}

/** Clearly marked stand-in until the real photo is added to public/images/. */
function Placeholder({ title, image, className }: { title: string; image: string; className: string }) {
  return (
    <div
      className={`flex aspect-[3/4] max-h-[30dvh] flex-col items-center justify-center gap-1 border-2 border-dashed border-muted bg-mat p-3 text-center ${className}`}
      role="img"
      aria-label={`Photo placeholder for ${title}`}
    >
      <span className="font-hand text-xl font-bold">Photo placeholder</span>
      <span className="text-sm text-muted">{title}</span>
      <span className="break-all text-xs text-muted">
        Real photo goes in <code>public{image}</code>
      </span>
    </div>
  );
}
