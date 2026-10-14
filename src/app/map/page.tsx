import type { Metadata } from "next";
import MuseumMap from "@/components/MuseumMap";
import TabBar, { TAB_BAR_SPACE } from "@/components/TabBar";
import { getMapData } from "@/lib/map-data";

export const metadata: Metadata = { title: "The map · Louvre Before You Go" };

// The map (PRODUCT.md "The map"): the three wings, tappable.
export default function MapPage() {
  return (
    <main className={`soft-fade ${TAB_BAR_SPACE}`}>
      <MuseumMap data={getMapData()} initialWing={null} />
      <TabBar active="map" />
    </main>
  );
}
