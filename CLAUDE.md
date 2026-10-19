# Project rules · Louvre Before You Go

For the AI and the people working in this repo. AGENTS.md and CLAUDE.md have the same content; if you change one, change the other too.

1. **Read PRODUCT.md first, every time.** Before any task, read the product spec and treat it as the source of truth.
2. **Plan big changes first.** For changes like a new page, a new structure, a new dependency or a new data format, write a plan and wait for the product owner to say "go" before starting.
3. **Only change files related to the task.** No drive-by refactors or style tweaks; if a design choice is unclear, ask instead of changing it yourself.
4. **Never invent facts.** Every art-history fact needs a source, recorded in `sources`; anything you can't find is written as "TBD". Never invent quotes from artists. An artist's imagined line is allowed only when it is tagged "Imagined voice · not his own words", has no quotation marks, and every fact in it is sourced; it never passes as a real quote.
5. **When requirements change, update PRODUCT.md first.** Update the product spec, then change the code.
6. **Commit and push after each step.** Run it yourself and check it before committing.
7. **Everything is in English.** Code, content, UI, docs and replies to the product owner.

## Current scope

Version 0.6 from PRODUCT.md, "0.6 · Museum framework": a cover, a contents page, 15 modules and an appendix (100 works from `content/modules.json`) and a schematic map, on top of everything in 0.5 (the five "Start here" levels, the Close-Up Challenge and the restrained motion in "Motion"). The framework is live; build step 8 (content in batches) is in progress, with 28 of the 100 works playable. New levels follow "Content pipeline" in PRODUCT.md: each work gets a record recheck, a rights-checked photo, its level and its close-up round, one PR per work. New levels never join the "Start here" trail. Still open from 0.6: the module seal. Nothing from 1.0 or later.

## Hard limits

- No database; progress is stored only in the browser's localStorage.
- No AI calls at runtime.
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS, static export, published to GitHub Pages with GitHub Actions.
