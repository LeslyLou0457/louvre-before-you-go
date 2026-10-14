import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MuseumMap from "@/components/MuseumMap";
import TabBar, { TAB_BAR_SPACE } from "@/components/TabBar";
import { getMapData } from "@/lib/map-data";

// Static wing pages, /map/denon/, /map/sully/, /map/richelieu/ (PRODUCT.md
// "Structure and navigation": Wing): the map zoomed to one wing, its floors
// top floor first, and a floor picked with a #level-1 anchor.
export const dynamicParams = false;

export function generateStaticParams() {
  return getMapData().wings.map((w) => ({ wing: w.id }));
}

type Params = { params: Promise<{ wing: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = (await params).wing;
  const w = getMapData().wings.find((x) => x.id === id);
  return { title: w ? `${w.name} wing · The map · Louvre Before You Go` : "Louvre Before You Go" };
}

export default async function WingPage({ params }: Params) {
  const id = (await params).wing;
  const data = getMapData();
  const wing = data.wings.find((w) => w.id === id);
  if (!wing) notFound();
  return (
    <main className={`soft-fade ${TAB_BAR_SPACE}`}>
      <MuseumMap data={data} initialWing={wing.id} />
      <TabBar active="map" />
    </main>
  );
}
