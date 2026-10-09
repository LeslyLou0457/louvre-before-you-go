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

Optional fields the site understands:

- `artwork.medium`, `artwork.dimensions`, `artwork.museumUrl`: shown on the museum label. Missing ones show "TBD"; without `museumUrl`, the label links to the level's first `collections.louvre.fr` source.
- `speaker` on a node: that line is shown in a speech bubble next to the speaker's head (for example `"speaker": "Leonardo da Vinci"`). Without it, the line is plain narration.

## Add the artwork photos

Put each photo at the path in its JSON's `artwork.image`, under `public/` (for example `public/images/mona-lisa.jpg`). The "Photo placeholder" box disappears on the next build. Intended sources are listed in `src/lib/image-sources.ts`; use only Public Domain or CC0 images and keep `imageCredit` accurate.

## Swap in hand-drawn art

Every doodle and every artist head is a placeholder in `src/doodles/`:

- `src/doodles/index.tsx`: buttons' icons, route line, stars, underline.
- `src/doodles/heads.tsx`: flat painted artist heads, matched to `artwork.artist` or a node's `speaker` by name.

Replace the shapes inside a component with the hand-drawn SVG and keep its name; nothing else needs to change.
