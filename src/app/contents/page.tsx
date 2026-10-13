import type { Metadata } from "next";
import Link from "next/link";
import ContentsList from "@/components/ContentsList";
import { BackDoodle } from "@/doodles";
import { getBook } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Contents · Louvre Before You Go" };

export default function ContentsPage() {
  const book = getBook();
  return (
    <main className="soft-fade pb-10">
      <div className="-mx-4 flex min-h-[52px] items-center px-2 py-1">
        <Link href="/" aria-label="Back to the journey" className="flex h-12 w-12 items-center justify-center rounded-full">
          <BackDoodle className="h-[26px] w-[26px]" />
        </Link>
      </div>
      <h1 className="font-hand text-[2.25rem] font-bold leading-none">Contents</h1>
      <p className="mt-1 text-sm leading-normal text-muted">
        15 chapters and an appendix. The numbers on the right are Louvre room numbers: your page numbers.
      </p>
      <ContentsList book={book} />
    </main>
  );
}
