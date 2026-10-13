"use client";

// "Back to Chapter 09" / "Back to the cover" / "Back to the journey" on the
// level-cleared page: back to where the level was opened from (lib/origin).
// Rendered for the trail first, then corrected from the URL after mount.

import Link from "next/link";
import { useEffect, useState } from "react";
import { originHref, originLabel, readOrigin, TRAIL, type Origin } from "@/lib/origin";

export default function ReturnLink({ className }: { className?: string }) {
  const [origin, setOrigin] = useState<Origin>(TRAIL);
  useEffect(() => setOrigin(readOrigin()), []);
  return (
    <Link href={originHref(origin)} className={className}>
      {originLabel(origin)}
    </Link>
  );
}
