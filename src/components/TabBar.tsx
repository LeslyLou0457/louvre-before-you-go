// The tab bar under the book's pages (PRODUCT.md "Structure and navigation":
// "A tab bar with Cover, Map, Contents reaches any module in two taps").
// Shown on the cover, the "Start here" trail, the contents and the chapter
// pages; levels and close-up rounds keep the whole screen.
//
// The Map tab arrives with the map itself (build step 4): add its entry to
// TABS between Cover and Contents, with a MapDoodle icon. Until then there is
// no Map tab at all, rather than one that leads nowhere.

import Link from "next/link";
import { ContentsDoodle, CoverDoodle } from "@/doodles";

export type Tab = "cover" | "contents";

const TABS: { id: Tab; href: string; label: string; Icon: typeof CoverDoodle }[] = [
  { id: "cover", href: "/", label: "Cover", Icon: CoverDoodle },
  // Build step 4: { id: "map", href: "/map/", label: "Map", Icon: MapDoodle },
  { id: "contents", href: "/contents/", label: "Contents", Icon: ContentsDoodle },
];

/** Room to leave at the bottom of a page so the fixed bar never covers its last line. */
export const TAB_BAR_SPACE = "pb-[calc(96px+env(safe-area-inset-bottom,0px))]";

export default function TabBar({ active }: { active: Tab }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-mat pb-[env(safe-area-inset-bottom,0px)]"
    >
      <ul className="mx-auto grid max-w-[640px]" style={{ gridTemplateColumns: `repeat(${TABS.length}, minmax(0, 1fr))` }}>
        {TABS.map(({ id, href, label, Icon }) => (
          <li key={id}>
            <Link
              href={href}
              aria-current={id === active ? "page" : undefined}
              className={`flex min-h-[58px] flex-col items-center justify-center font-hand text-lg font-bold leading-tight focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-ultramarine ${
                id === active ? "text-ultramarine" : "text-muted"
              }`}
            >
              <Icon className="h-[26px] w-[26px]" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
