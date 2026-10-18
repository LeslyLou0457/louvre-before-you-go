import type { Metadata } from "next";
import Link from "next/link";
import { LouvreDoodle, UnderlineDoodle } from "@/doodles";

// A missing page (PRODUCT.md "Structure and navigation"): the static export
// writes this as out/404.html, which GitHub Pages serves for any unknown path
// under the base path. Doodle chrome only: one line and the way back.
export const metadata: Metadata = { title: "Page not found · Louvre Before You Go" };

export default function NotFound() {
  return (
    <main className="soft-fade py-6">
      <div className="flow-root">
        <LouvreDoodle className="float-right -mt-3 ml-3 h-auto w-[78px]" />
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">The Louvre · Paris</p>
        <h1 className="mt-1.5 font-hand text-[2.4rem] font-bold leading-none">Lost in the galleries</h1>
      </div>
      <UnderlineDoodle className="mt-1 h-3 w-44" />
      <p className="mt-4">This page isn&apos;t here, but every work in the book still is.</p>
      <div className="mt-5 grid gap-2.5">
        <Link href="/" className="btn-primary w-full">
          Back to the cover
        </Link>
        <Link href="/contents/" className="btn-option justify-center font-bold">
          Contents
        </Link>
      </div>
    </main>
  );
}
