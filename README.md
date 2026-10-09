# Louvre Before You Go

Duolingo for art history: one small story a day about one Louvre masterpiece. Version 0.5, a static Next.js site published to GitHub Pages at https://leslylou0457.github.io/louvre-before-you-go/.

Read [PRODUCT.md](PRODUCT.md) first; it is the source of truth. Project rules are in [AGENTS.md](AGENTS.md) (same as CLAUDE.md).

## Run it

```bash
npm install
npm run dev            # http://localhost:3000/louvre-before-you-go/
npm run check-content  # checks every file in content/
npm run build          # static export to out/
```

Pushing to `main` builds and publishes the site (`.github/workflows/deploy.yml`). GitHub Pages must be set to "GitHub Actions" as its source in the repository settings.

## Add an artwork

Add one JSON file to `content/` named `NN-name.json` (the number sets its place on the journey), in the format described in PRODUCT.md. Run `npm run check-content`. No code changes.

Optional fields the site understands (see PRODUCT.md "Data format"; files without them still work):

- `artwork.medium`, `artwork.dimensions`, `artwork.museumUrl`: the museum label. Missing ones show "TBD"; without `museumUrl`, the label links to the level's first `collections.louvre.fr` source.
- `speakers` (top level) and `lessons[].narrator`: who can speak, and the level's narrator, shown on the route and the level page.
- `voice` on a story or branch node: the speaker's line in a speech bubble beside their head. `imagined` lines get an "Imagined voice" tag; `quote` lines show quotation marks and their `cite`, and their `source` must be in the level's `sources`.

## Add the artwork photos

Put each photo at the path in its JSON's `artwork.image`, under `public/` (for example `public/images/mona-lisa.jpg`). The "Photo placeholder" box disappears on the next build. Intended sources are listed in `src/lib/image-sources.ts`; use only Public Domain or CC0 images and keep `imageCredit` accurate.

## Swap in hand-drawn art

Every doodle and every artist head is a placeholder in `src/doodles/`:

- `src/doodles/index.tsx`: buttons' icons, route line, stars, underline.
- `src/doodles/avatars.tsx`: flat painted artist heads and the doodled marble block, one per `avatar` id used in `speakers`.

Replace the shapes inside a component with the hand-drawn SVG and keep its name; nothing else needs to change.
