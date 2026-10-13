import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChapterView from "@/components/ChapterView";
import TabBar from "@/components/TabBar";
import { getBook, getChapter } from "@/lib/catalogue";

// Static export: /chapter/01/ … /chapter/15/ and /chapter/beyond/, from content/modules.json.
export const dynamicParams = false;

export function generateStaticParams() {
  return getBook().chapters.map((c) => ({ id: c.id }));
}

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getChapter((await params).id);
  if (!c) return { title: "Louvre Before You Go" };
  return { title: `${c.appendix ? "Appendix" : `Chapter ${c.id}`}: ${c.title} · Louvre Before You Go` };
}

export default async function ChapterPage({ params }: Params) {
  const chapter = getChapter((await params).id);
  if (!chapter) notFound();
  return (
    <>
      <ChapterView chapter={chapter} />
      <TabBar active="contents" />
    </>
  );
}
