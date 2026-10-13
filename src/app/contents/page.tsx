import type { Metadata } from "next";
import ContentsList from "@/components/ContentsList";
import TabBar, { TAB_BAR_SPACE } from "@/components/TabBar";
import { getBook } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Contents · Louvre Before You Go" };

export default function ContentsPage() {
  const book = getBook();
  return (
    <main className={`soft-fade pt-8 ${TAB_BAR_SPACE}`}>
      <h1 className="font-hand text-[2.25rem] font-bold leading-none">Contents</h1>
      <p className="mt-1 text-sm leading-normal text-muted">
        15 chapters and an appendix. The numbers on the right are Louvre room numbers: your page numbers.
      </p>
      <ContentsList book={book} />
      <TabBar active="contents" />
    </main>
  );
}
