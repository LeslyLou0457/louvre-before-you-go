// Lulu, full-bellied, with her thank-you line (PRODUCT.md "Visit countdown and
// baguette progress"): on the level-cleared and close-up-cleared pages. The
// line is picked by id from a fixed pool of warm thanks with no art facts.

import { LuluFull } from "@/doodles/cats";
import { fullCatLine } from "@/lib/cat-lines";

export default function LuluFullCard({ pickBy }: { pickBy: string }) {
  return (
    <figure className="m-full flex items-center gap-3">
      <LuluFull title="Lulu the Siamese cat, belly round and full" className="h-auto w-[92px] shrink-0" />
      <figcaption className="wobbly relative flex-1 border-2 border-ink bg-mat px-4 py-2.5 font-hand text-xl leading-snug">
        <span className="block text-base text-muted">Lulu says</span>
        {fullCatLine(pickBy)}
      </figcaption>
    </figure>
  );
}
