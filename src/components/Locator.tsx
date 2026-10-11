"use client";

// Close-Up Challenge: the small "see where" thumbnail. A copy of the whole
// reference photo with the zoomed region outlined, so the player knows where
// they are. The outline is drawn by the page over the photo; the image file
// itself is untouched (PRODUCT.md "Images"). Tapping it opens the whole work
// full screen, with the same outline.

import { useEffect, useState } from "react";
import { CloseDoodle } from "@/doodles";
import { withBase } from "@/lib/paths";
import type { Zoom } from "@/lib/types";

type Props = {
  overview: string;
  /** Pixel size of the reference image, for the aspect ratio. */
  width: number;
  height: number;
  zoom: Zoom;
  title: string;
  className?: string;
  /** Tailwind max-height for the thumbnail. */
  maxHeightClass?: string;
};

function Outlined({
  src,
  alt,
  zoom,
  width,
  height,
  className,
  strong = false,
}: {
  src: string;
  alt: string;
  zoom: Zoom;
  width: number;
  height: number;
  className: string;
  strong?: boolean;
}) {
  return (
    <span className="relative inline-block max-w-full align-top">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} className={`block h-auto max-w-full ${className}`} />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute border-ultramarine ${strong ? "border-[3px]" : "border-2"}`}
        style={{
          left: `${zoom.x * 100}%`,
          top: `${zoom.y * 100}%`,
          width: `${zoom.w * 100}%`,
          height: `${zoom.h * 100}%`,
          // A thin paper-white halo keeps the outline visible on dark paintings.
          boxShadow: "0 0 0 1.5px var(--color-mat)",
        }}
      />
    </span>
  );
}

export default function Locator({ overview, width, height, zoom, title, className = "", maxHeightClass = "max-h-[22dvh]" }: Props) {
  const [open, setOpen] = useState(false);
  const src = withBase(overview);
  const alt = `${title}, whole work, with the zoomed region outlined: ${zoom.label}`;

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block bg-mat p-1.5 ${className}`}
        aria-label={`See where this detail sits in ${title}`}
      >
        <span className="flex justify-center">
          <Outlined src={src} alt={alt} zoom={zoom} width={width} height={height} className={`w-auto ${maxHeightClass}`} />
        </span>
        <span className="mt-1 block text-center font-hand text-base leading-none text-muted">see where</span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${title}, whole work`} className="fixed inset-0 z-50 overflow-auto bg-mat">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-mat"
            aria-label="Close"
          >
            <CloseDoodle className="h-6 w-6" />
          </button>
          <div className="flex min-h-full items-center justify-center p-4 pt-16">
            <Outlined
              src={src}
              alt={alt}
              zoom={zoom}
              width={width}
              height={height}
              className="max-h-[calc(100dvh-6rem)] w-auto"
              strong
            />
          </div>
        </div>
      )}
    </>
  );
}
