# Project rules · Louvre Before You Go

For the AI and the people working in this repo. AGENTS.md and CLAUDE.md have the same content; if you change one, change the other too.

1. **Read PRODUCT.md first, every time.** Before any task, read the product spec and treat it as the source of truth.
2. **Plan big changes first.** For changes like a new page, a new structure, a new dependency or a new data format, write a plan and wait for the product owner to say "go" before starting.
3. **Only change files related to the task.** No drive-by refactors or style tweaks; if a design choice is unclear, ask instead of changing it yourself.
4. **Never invent facts.** Every art-history fact needs a source, recorded in `sources`; anything you can't find is written as "TBD". Never invent quotes from artists.
5. **When requirements change, update PRODUCT.md first.** Update the product spec, then change the code.
6. **Commit and push after each step.** Run it yourself and check it before committing.
7. **Everything is in English.** Code, content, UI, docs and replies to the product owner.

## Current scope

Only version 0.5 from PRODUCT.md: 5 Louvre works, 1 level each, 25 questions in total, 4 pages. Nothing from 1.0 or later.

## Hard limits

- No database; progress is stored only in the browser's localStorage.
- No AI calls at runtime.
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS, static export, published to GitHub Pages with GitHub Actions.
