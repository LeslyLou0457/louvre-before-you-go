# Louvre Before You Go · Product Spec

> Product spec · first edition · ready to hand to an AI
> Taopai Studio · October 2026 · taopai-studio.pages.dev
>
> Transcribed to Markdown from the product owner's PDF (PRODUCT BRIEF · v0.5).
> Revised 2026-10-07 at the product owner's request: the five artworks now match the story playbook, which is the content sample (see "Five levels, five artworks" and "Content sample"); the product, its content and this spec are in English.
> Revised 2026-10-09 (content depth): after playtest feedback, every level must carry professional art-history analysis in conversational language (see "Depth standard"), and every wrong answer gets a clear correction (optional `correction` field on branches, see "Data format").
> Revised 2026-10-09 (Close-Up Challenge): after all 5 levels, a Close-Up Challenge unlocks, with one 2-question round per artwork built on zoomed crops of high-resolution photos (see "Close-Up Challenge" and "Challenge files"). Time per level: about 5 minutes, never more than 7; one work, level plus close-up round, within 10.
> Revised 2026-10-13 (motion): narrator heads and doodle chrome get restrained motion in the style of After Hours; the artwork never moves (see "Motion" under 03 · DESIGN). The product owner also confirmed the Close-Up Challenge defaults already built: rounds unlock one at a time in route order, a pool of 2 repeats the same pair on every play, and "10 minutes per work" means its level plus its close-up round.
> Revised 2026-10-13 (0.6, museum framework): the Louvre's content becomes a book: a cover, a contents page, 15 modules and an appendix holding 100 works, and a schematic map of the three wings, from the approved framework design and the product owner's decisions (modules free to open with "Next up", a close-up round opens per work, works not on view stay in their module, listed last). See "0.6 · Museum framework" and "Catalogue file"; "Museum maps" moves out of "Not doing" for a schematic map used to find modules.

**Duolingo for art history. See it before you go; recognise it when you're there.**
Five minutes a day, one level, one small story about one artwork.

## Five things this spec makes clear before you hand it to an AI

| | Item | Content |
|---|---|---|
| 01 | Goal | Build the 0.5 website; all 5 levels playable on a phone |
| 02 | Materials | This spec + one content JSON per artwork (5) |
| 03 | Scope | 5 Louvre masterpieces, 4 pages |
| 04 | Limits | No AI calls, no database, no audio |
| 05 | Done when | All 6 items under "Acceptance" are ticked |

---

## 01 · THE PRODUCT — a small art history course that gets you ready to go

Louvre Before You Go is "Duolingo for art history". When you are planning to visit a museum or see an exhibition, it spends 5 minutes a day with you before you leave: one level, one small story about one artwork.

> **See it before you go; recognise it when you're there.**
> When you stand in front of the work, you know it, and you know what happened behind it, like meeting an old friend.

How it differs from what exists: a full video lecture is too long and your mind wanders; an encyclopedia is too dry and nothing sticks. Here, knowledge is cut into 5-minute stories, and questions pull you back in. Storytelling comes first, but the knowledge is real: every level carries professional art-history analysis (context, form, technique, sources, reception, open debates), told the way a friend who is an art historian would tell it.

### Product logic: the whole product does one thing, before the trip

From deciding to visit a museum to the day you leave.

Pick a destination (a museum or an exhibition) → set a departure date (countdown route, up to 100 days) → one level a day (story · question · branch, 5 minutes) → clear it to unlock the next (finish one artwork, move on) → go (you've already "met" the masterpieces)

Content is organised in three layers: museum → artwork → level. Adding a museum means adding a set of content, not changing the product.

### Target users and scenario

People planning to visit a museum or gallery who are curious about art history but have no background. They don't lack motivation; they lack an effortless way to start.

| Who | What they do now | Where they get stuck |
|---|---|---|
| Visitors in a learning mood<br>e.g. a CS student who couldn't name the three Renaissance masters | Follow the crowd and search Wikipedia on the spot | Rush through and can't even recognise the masterpieces |
| People interested in art history | Watch a long YouTube or Bilibili lecture beforehand | Videos are too long; attention drifts; nothing sticks |
| People who want a guide | Hire a guide or rent an audio guide | Guides in their language are scarce, and expensive |

**One scenario only: before the trip**
From a few days to a few months before leaving, one level a day on the subway or before bed, on a phone (from 1.0, with headphones too). Guiding visitors once they're at the museum is not part of this product.

**Who it doesn't serve**
People with no interest in art history, who won't do homework before a trip; scholars and art students, who want a system, not 5 minutes.

---

## 02 · 0.5 MVP — start with 5 Louvre masterpieces

The product is for every museum, but the first version covers only the Louvre, starting with its masterpieces: 5 artworks, 1 level of 5 questions each, 25 questions in all. Finish the 5 levels and you've "met" the Louvre's most important works.

Once these 5 levels work, they are the template for every later artwork: make one set well, then have an AI batch-produce more with the same method.

| 0.5 does | 0.5 doesn't |
|---|---|
| 5 Louvre masterpieces, 1 level each, 25 questions | Other museums; several levels per artwork |
| One level route; clearing a level unlocks the next | Choosing a museum, setting a departure date, countdown |
| Every story shown as text | Read-aloud audio (added in 1.0), live AI conversation |
| Progress saved in the browser, no sign-up | Login, database |
| Mobile-first website | App |
| Published on GitHub Pages with a public link | Vercel, a custom domain |

### Five levels, five artworks

Start with the best-known, the Mona Lisa. Each level tells only the most interesting story about its artwork. The full scripts for all five levels are in "Content sample"; the product owner's final version decides.

| | Artwork | Artist | What the level is about | A sample question |
|---|---|---|---|---|
| 1 | Mona Lisa | Leonardo da Vinci | How sfumato, chiaroscuro and atmospheric perspective make a face seem to think; who she was, who kept her, and what time has done to her | You can't find the edge of the shadow at her mouth. What is that trick called? |
| 2 | Venus de Milo | Unknown | A Hellenistic remake of a Classical ideal: contrapposto and spiral pose, the lost signature and the dating fight, what her arms held, where she stood | Are the lines across her shoulders and hips parallel? |
| 3 | Winged Victory of Samothrace | Unknown | Look down first: the ship, the wind in the drapery, the hilltop setting (and the disproved fountain), who dedicated her and why nobody can say, how much is restored | No wind was carved. So how do you know it's blowing? |
| 4 | Liberty Leading the People | Eugène Delacroix | July 1830, allegory meets street fight: pyramid and colour, the crowd's classes, the repentir, the 2024 restoration, and a painting the state kept hiding | Is she a real woman who fought that day? |
| 5 | The Raft of the Medusa | Théodore Géricault | A real political scandal, the moment the painter chose, two pyramids, heroic bodies from Michelangelo, the darkening, and how readings still divide | You're Géricault. Which moment do you paint? |

Venus de Milo and Winged Victory are sculptures, so their lesson pages show a photograph of the work.

---

## 02 · 0.5 · How a level plays — tell a story, ask, branch, return

**Flow of one level · a loop of 5 questions**

```
Main line: tell a story → ask a question ─┬─ pick A → branch A ─┬→ back to main line
                                          └─ pick B → branch B ─┘     │
                                             (a wrong answer never blocks you)
        ↑──────────── next question (5 per level) ─────────────────────┤
                                                                       └─ 5 answered → level cleared, next unlocked
```

### Rules for one level

1. The main line tells a short story: one to three screens between questions, each 2–4 sentences.
2. A question appears, with 2–3 options.
3. The choice leads to a short branch (1–3 sentences), then back to the main line.
4. Repeat 5 times, clear the level, unlock the next.

### Three details

- **A wrong answer never blocks you, and it is always corrected.** A wrong pick opens its own branch. The branch says plainly that the answer isn't right, then a correction card explains why the idea is tempting, what is actually true, and the evidence (a detail in the work or a documented fact) that settles it. Never shown in red. A wrong answer is another chance to tell a story.
- **Some questions have no right answer.** For example, "Where did your eye land first?": each option leads to a different branch.
- **A level takes about 5 minutes, never more than 7.** Since the 2026-10-09 depth revision a level is about 17–21 short screens: roughly 4–5 minutes when your answers are right, a little more when you get them wrong and read the corrections. One screen shows one passage or one question; tap to move on. Everything about one work, its level plus its close-up round (see "Close-Up Challenge"), stays within 10 minutes.

> **Audio waits for 1.0:** 0.5 is text only; get the story and pacing right first. Write it the way people speak, so the 1.0 voice-over needs no rewrite.

### 0.5 pages and interaction: just 4 pages, open and play, no sign-up

| Page | What it does |
|---|---|
| Level route (home) | A vertical route of 5 level nodes in three states: done, current, locked; the current level has a "Start" button, and any level left mid-way has a "Continue" button that resumes it. Below it, the Close-Up Challenge (locked until all 5 levels are done) |
| Lesson page | Top half: the artwork (tap to zoom). Bottom half: one passage or one question. Progress bar at the top ("Question 3 of 5") and an exit button |
| Level cleared page | The level's narrator above the stars, then "One thing to remember today": a one-sentence summary of the level; unlock the next level, back to the route |
| About and sources | Image sources and references |

- Tapping a locked level shows a light hint, "Finish the previous level first", not a pop-up.
- Leaving mid-level saves your place in the browser: reopening the level (or reloading the page) picks up at the same passage or question, with a small "Start over" link to replay it from the beginning. The saved place is cleared when the level is finished. Finished levels can be replayed.
- Restrained motion (see "Motion"): the narrator rises into place, floats, talks and reacts to right and wrong answers; bubbles, options, correction cards, stars and the route move a little. Nothing ever waits for an animation, and the artwork never moves. No full-screen confetti.

---

## 02 · 0.5 · Close-Up Challenge — zoom in once all five levels are done

Added 2026-10-09, from the approved design (project files, `challenge/DESIGN.md`) and the product owner's decisions on it.

After a player has finished all 5 levels, a **Close-Up Challenge** unlocks below the level route: one short round per artwork. Each question zooms into one region of the real artwork, a crop of a high-resolution photo, and asks a harder question built on something the level taught. "Challenge" means advanced; nothing is paid.

### Rules for the challenge

1. **Unlock:** all 5 levels finished. Before that, the challenge is shown locked with one line saying why ("Finish all five levels to unlock the close-ups"), not a pop-up.
2. **One round per artwork,** in route order, like the levels: the first unfinished round is current, later ones are locked, finished rounds can be replayed.
3. **2 questions per round.** Each artwork keeps an ordered **pool** of fully sourced questions. Play *k* (0, 1, 2, …) shows pool items 2*k* and 2*k*+1, counted round the pool (indices modulo the pool size), so the first play is always the first two and a replay shows the next pair. One play counter per artwork in localStorage; it moves on when a round is finished. A pool of 3 repeats a question on the third play; a pool of 2 shows the same pair every time.
4. **One question is 4 screens,** the usual loop: an intro with the zoomed crop, the question with 3 options, the branch (a wrong pick gets the usual correction card), and the merge line every player sees. The crop stays on screen for the whole question, with a small "see where" thumbnail of the whole work with the region outlined, so the player knows where they are; tapping the crop opens it full screen, tapping the thumbnail opens the whole work with the outline. After the second merge line, the round's cleared page repeats both merge lines.
5. **Sources on screen:** each question's merge screen lists its sources in small print, with links.
6. **Saved like a level:** leaving or reloading mid-round picks up at the same screen of the same pair, with "Start over"; the place is cleared when the round is finished.

### Options: one right answer, two near misses

- Exactly **3 options**: one right and **two near misses**. A near miss is a real alternative from the work's own world: a technique, device or reading genuinely used in the period (another Renaissance shading recipe, a Hellenistic way of holding up marble, a Flemish parapet), or a documented fact about this very object (the yellowed varnish, the 1949 retouching, the 1848 tear). Picked and corrected, it still teaches something true. Never silly, obviously wrong or irrelevant.
- Every wrong option leads to a branch with a `correction` card, and the source of what the card says.
- **"Nobody can tell"** counts as a near miss only where a source shows the evidence does exist.
- **Approved exception:** the Mona Lisa horizon question keeps the documented "uneven horizon" misreading as its second wrong option (role `myth`).
- Live debates are never right/wrong. If a fact is settled but its meaning is open, the right answer states the fact and the merge line says what's unknown.
- Every question extends the level: a new place in the work, the physical mechanism, the reason, or the correction of a common misreading. It never repeats a level question with a new picture. Where a source gives the reason a feature sits in that exact place, ask **why it is there**.

### Accuracy rule (non-negotiable)

- **A zoom region is used only if a source explicitly places that technique, feature or condition in that exact area of the work.** No source locating it, no question.
- Every quoted passage and fact is checked against the source text, and every crop is checked by eye against the region the source describes, before a question ships. A question whose crop can't show its feature clearly, or whose source is not yet strong enough, is kept out of the rotation in `held`, with the reason.
- Preferred sources: the museum (collections.louvre.fr, the Louvre's Focus guides and teaching files, curators' statements), the C2RMF and peer-reviewed technical studies, primary sources, then established scholarship and reference works. Page numbers or editions not yet checked stay "TBD" in the review notes and are never shown to players as claims.

### Time budget

The whole challenge, all 5 rounds, takes at most **12 minutes** (720 s), so a round takes at most **144 s**, even when every answer is wrong and every correction card is read.

Model (also used by the content check): reading at 200 words per minute (0.3 s a word, the low end of adult silent reading; Brysbaert 2019, *Journal of Memory and Language* 109, 104047); per question 6 s looking at the zoom, 5 s choosing and 4 taps of 1 s (15 s); per round, the title and the cleared page's two merge lines plus 2 taps.

Word caps per question (tighter than a level's):

| Screen | Cap |
|---|---|
| Intro (with the zoom) | 30 |
| Question | 12 |
| Options | 15 in total, each at most 7 |
| Right branch | 30 |
| Wrong branch | 15 |
| Correction card | tempting 20 · truth 25 · evidence 25 |
| Merge line | 18 |
| Round title | 8 |

At the caps the worst path is 160 words (63 s) and the right path 105 words (46.5 s) per question, so 2 questions fit (141 s a round, 11.8 minutes for all five) and 3 don't. The content check computes every pair the rotation can show and fails any round over 144 s.

### Images

- Zooms come from a high-resolution reference image, never from the app's ~1150–2000 px photos: for the Mona Lisa the uncropped C2RMF scan on Wikimedia Commons ("Mona Lisa, by Leonardo da Vinci, from C2RMF.jpg"), for the other four the same Commons files the app photos come from. Public domain or CC0 only; credits as for the app photos, and the About page links the reference file.
- Regions are normalized boxes `{ x, y, w, h }`: fractions 0–1 of the full reference image, top-left origin, measured on the full image.
- Crops are cut once, offline, at about 1200 px on the long side (never upscaled) into `public/images/challenge/<artwork id>/<question id>.jpg`, plus `overview.jpg`, a small copy of the whole reference image for the "see where" thumbnail. The multi-megabyte originals are not kept in the repo.
- Crops are never redrawn, filtered or drawn on. The only outline is drawn by the page over the overview thumbnail, around the region; the image file itself stays untouched.

## 02 · 0.6 · Museum framework — a cover, a contents page, 15 modules and a map

Added 2026-10-13, from the approved framework design (project files: `framework/DESIGN.html`, its clickable `framework/prototype.html`, and the mapping `catalogue/modules.csv` with `catalogue/top-100.csv` and `catalogue/module-candidates.csv`) and the product owner's decisions on it. Version name: **0.6**.

0.6 turns the five-level route into a book for the whole museum: a cover, a contents page, **15 modules** and an appendix, "Beyond the 15", and a map of the three wings. The book holds **100 Louvre works** (`catalogue/top-100.csv`), each in exactly one module or the appendix, whether or not its level exists yet. 0.6 adds no levels: the five existing levels and their Close-Up Challenge stay the playable content, and new levels arrive later, one work at a time, each with a record recheck, a rights-checked photo, its level and its close-up round.

### Words used in this section

- **Module:** a group of neighbouring rooms of one region or period, in the product owner's own curatorial structure, not an official Louvre route. On screen it is called a chapter ("Chapter 09"), as in the design's book: the cover, the contents page and room numbers used as page numbers.
- **Floor:** one of the Louvre's levels, −1 to 2. On screen it is labelled the way the Louvre labels it ("Level 1"); this spec and the data say "floor" so it is never confused with a game level.
- **Level:** as in 0.5, the 5-question game about one work.

### Structure and navigation

```
Cover → Map → Wing → Floor → Module → Work → Close-up round
Cover → Contents → Module
Cover → "Start here" trail → the 5 existing levels (today's route, unchanged)
```

| Page | Route | What it does |
|---|---|---|
| Cover (home) | `/` | The title, the cover copy (below), "Open the map", "Contents", the "Start here" card (continue where you left off), and the sticker book: one mark per work, module by module. Replaces the level route as home |
| Start here | `/start/` | Today's level route and Close-Up Challenge, unchanged, moved from `/` |
| Map | `/map/` | The three wings, tappable (see "The map") |
| Wing | `/map/denon/`, `/map/sully/`, `/map/richelieu/` | The map zoomed to one wing and its floors, top floor first, each with its module and work counts and room range. Picking a floor (page state, with a `#level-1` anchor) lists the modules with works on that floor, with "also on Sully, Level 0"-style notes when a module continues elsewhere. Static pages, so they can be linked |
| Contents | `/contents/` | All 15 modules and the appendix: number, title, wings and floors, progress, and the room range on the right like page numbers in a book; a wing filter |
| Module | `/chapter/01/` … `/chapter/15/`, `/chapter/beyond/` | Number, title, wings and floors, room range, progress dots, the "not a walking route" line, then the works under room headings ("Room 711") in module order, works not on view last under "Not on view right now", and the module's close-up rounds at the bottom. Generated from `content/modules.json` |
| Work | label sheet on the module page | The work's museum label: artist, title, date, where (wing, floor, room), display status with the date checked, and "View at the Louvre →". A work with a level opens its level |
| Lesson, challenge, about | unchanged | A level or round finished from a module returns to that module |

- A tab bar with **Cover, Map, Contents** reaches any module in two taps. Back always returns to where the module was opened from.
- Cover copy, exactly: "The Louvre is home to treasures from across the world and across thousands of years. Meet 100 of its masterpieces, and the stories behind them, before you go."
- Page numbers: module number plus room number ("Chapter 09, room 711"). Room numbers are the Louvre's own, so they stay stable when works are added; positions like "4 of 9" are computed, never stored.

### The map

- **Behaviour:** the three wings, Denon, Sully and Richelieu, are tappable buttons; the Cour Carrée, the Pyramid, rue de Rivoli and the Seine are drawn only to orient. Tapping a wing zooms the map to it, fades the other wings and shows its floors, top floor first, like a cross-section of the building. Picking a floor lists its modules; picking a module opens it.
- **Honest:** labelled "Schematic, not to scale". It draws no rooms, no routes, no walking times and no artworks, so it can never send anyone the wrong way. It is for finding modules before the trip, not for guiding on site.
- **Visual style:** Map A from the prototype (decided by the product owner, 14 Oct 2026): an illustrated bird's-eye doodle of the palace seen from above the Seine, with slate roofs, warm stone, crayon greens and a blue Seine, hand-lettered banners for the three wings, and labels as HTML laid over the drawing so the zoom never re-lays out text. Whatever the style, the drawing lives in one swappable component, like the other doodles, so a person's illustration drops in without code changes, and it follows the three-layer rule in "03 · DESIGN".
- **A list for every map:** the contents page and the wing's floor list hold everything the map does; the map is never the only way in. Each wing is a real button with a spoken name built from the data, like "Denon wing: 6 chapters, 29 works on view, levels −1 to 1", reachable by keyboard, with tap targets of at least 48 px.

### The 15 modules

From `catalogue/modules.csv` (records checked 13 Oct 2026). "On view" counts works whose record says on display; the restricted Crown of Louis XV and the closed Galerie Médicis are not counted.

| No. | Module | Wing · floors | Rooms | On view / all |
|---|---|---|---|---|
| 01 | Ancient Mesopotamia & Assyria | Richelieu 0 | 227–236 | 5 / 6 |
| 02 | Ancient Persia & the Levant | Sully 0 | 301–307 | 4 / 4 |
| 03 | Ancient Egypt: Life, Death & Afterlife | Sully −1, 0, 1 | 325–644 | 11 / 12 |
| 04 | Ancient Greece: Gods & Mythology | Denon −1, 0, 1; Sully 0 | 170–703 | 7 / 8 |
| 05 | Ancient Rome & Etruscan Civilizations | Sully 0, 1 | 348–663 | 4 / 5 |
| 06 | Islam, Byzantium & Cross-Cultural Exchange | Richelieu 1 | 501 | 2 / 8 |
| 07 | Medieval & Renaissance Sculpture | Denon −1, 0; Richelieu 0 | 169–403 | 6 / 6 |
| 08 | Italian Early Renaissance | Denon 1 | 706–708 | 4 / 4 |
| 09 | Italian High Renaissance & Venetian Masters | Denon 1 | 710–712 | 7 / 9 |
| 10 | French Neoclassicism & Romanticism | Denon 1 | 700–702 | 7 / 7 |
| 11 | Spanish Painting | — | rooms closed | 0 / 0 |
| 12 | Flemish & Dutch Masters | Richelieu 2 | 801–844 | 3 / 4 |
| 13 | French & Northern European Painting | Richelieu 2; Sully 2 | 824–917 | 5 / 7 |
| 14 | French Sculpture & Royal Patronage | Richelieu −1, 0 | 102–105 | 4 / 4 |
| 15 | Decorative Arts & Royal Collections | Richelieu 1; Denon 1 | 502–705 | 5 / 9 |
| + | Beyond the 15 (appendix) | Denon 0 | — | 0 / 7 |

- **93 works in modules, 7 in the appendix.** The appendix holds three Gallery of Five Continents works (room and display not confirmed) and four drawings seen by appointment only; they fit no module and stay in the book after module 15.
- **Module 11 keeps its number** and shows "rooms closed": the Spanish rooms 720–734 were listed closed on the louvre.fr open-rooms page when checked (13 Oct 2026), and no work on the list hangs there. Module numbers never change.
- **Only verified works.** A work enters the catalogue only from a verified row; the candidates in `catalogue/module-candidates.csv` stay out until each one's collections.louvre.fr record (room, display) has been checked. Short modules are filled later, one checked candidate at a time.
- **Placement calls (defaults from the design):** room 348's three statues stay together in Rome (05); Canova's Psyche sits in 07 with Michelangelo's room 403; Caravaggio's Death of the Virgin sits in 09 because it hangs in room 712; the two Byzantine ivories of room 501 sit in 06.

### Order: by room number, not a walking route

Inside a module, works are ordered by the Louvre's room number, computed from the data, never typed by hand:

1. works on view (on display, restricted or not yet confirmed) with a room number, by room number;
2. then works on view whose place has no room number (e.g. "Escalier Mollien (upper)"), in catalogue order;
3. then works **not on view**, last, in catalogue order.

Room order is not a walking route: stairs, passages and room closures change the way. Every module page carries one line saying so and telling people to check on the day.

### Status: what each work says it is

Every work is shown and says what it is. Two independent facts make up its status: whether its level exists, and whether you can see it in the museum.

**Level state** (derived from the existing progress, nothing new stored):

| State | When | Shown as | Tap |
|---|---|---|---|
| Coming soon | No level yet (`levelId` missing) | Dashed placeholder tile "Photo comes with the level"; dashed "Coming soon" chip | The museum label and "This level isn't written yet" |
| Ready | `levelId` names a level, not started | The real photo on a white mat; ultramarine "Play" | Opens the level |
| In progress | A saved place in the level | "Continue · 3 of 5" | Resumes the level |
| Met | The level is finished | Gold "Met" (ink on gold) | Opens the level to replay |
| Close-up done | Its close-up round is finished too | A second mark beside "Met" | Opens the round to replay |

**Display state** (from the work's collections.louvre.fr record, always with the date checked):

| `display` | Shown as |
|---|---|
| `on-display` | Room and place, no chip |
| `restricted` | "Coming soon, check first"-style note: access is restricted (the Crown of Louis XV's record adds "Accès réservé") |
| `tbd` | Note: room and display not confirmed (the Gallery of Five Continents works) |
| `not-on-display` | Grey chip "Not on display" |
| `on-loan` | Grey chip "On loan" |
| `room-closed` | Grey chip "Room closed" (the room is kept) |
| `appointment-only` | Grey chip "By appointment only" |

- The last four are **not on view**: the work keeps its place in its module, is listed last, and its label gives the reason (the record's own words, `displayNote`) and the date checked. Off-view works are written last.
- Every status carries the date it was checked. Never red: these are facts, not errors. State is never colour alone: each chip has a word and a mark.
- No fake levels and no drawn stand-ins: a work gets its photo only when its level ships, after the same rights check as the first five.
- Room data is soft: the Louvre's own records warn room data may be out of date. Every work's record is rechecked before its level ships, and a work checked more than 90 days ago is flagged by the content check.

### Progress, "Next up" and seals

- **Modules are free to open,** none is locked: people prepare for the wing they will visit. Inside a module, the first work in module order that has a level and isn't met yet is marked **"Next up"**. Any ready level in a module can be played.
- **Module progress:** "2 met · 1 ready · 6 coming soon · 2 not on view", plus one dot per work. A module earns a gold seal when every ready level in it and each one's close-up round are done; a new level later adds a dot, and the seal waits for it. A module with no ready level has no seal to earn.
- **Museum progress:** the sticker book on the cover shows all 100 works with honest counts, e.g. "2 met · 1 in progress · 2 ready · 73 coming soon · 22 not on view"; it never pretends unwritten works are playable.
- **The "Start here" trail** keeps the five existing levels in their route order, with the Close-Up Challenge as today. The same level can also be opened from its module at any time; it is the same level with the same progress key, so finishing it in either place counts in both.
- **Storage:** no new progress key. Work and module states are derived from the existing `progress:v1` and `place:v1` keys and the challenge progress; progress keys are lesson ids, which don't change, so existing players keep every tick. The existing `louvre-before-you-go:moments:v1` key gains `sealSeen` (modules whose seal has played) and `mapDrawn` (the map has drawn itself this session).

### Close-ups per work

Each work keeps one close-up round, in the current format (two questions on real crops; see "Close-Up Challenge"). In a module, **a work's round opens as soon as that work's level is done**, not behind a gate for the whole module (a growing module would re-lock). The module page lists its rounds in module order. The "all five levels" gate stays only on the "Start here" trail, so nothing changes for current players.

### Motion and accessibility

- Motion follows "Motion": the map's ink lines draw themselves once per session (about 1.3 s, tappable from the first frame), the map zooms to a tapped wing while the other wings fade, floors and rows rise in, a module's gold seal stamps once, the work's label sheet slides up. CSS `transform`, `opacity` and stroke drawing only; at most one loop per screen, except on the map (below); nothing waits for motion; artwork photos never move, scale or pan. Reduced motion follows the device setting, as in 0.5.
- **Approved exception, the map only** (product owner, 14 Oct 2026: "keep everything; the mission is that the content stands out clearly"): Map A keeps all of its idle loops, the water shimmer, a passing boat, a few walking visitors, a glint on the Pyramid and the floating pin, so the map screen has more than one loop. They are small, pause while a wing is zoomed, and stop entirely under reduced motion, where the zoom is also instant. The chosen wing lifts only after the zoom has landed, so the two never move in the same frame. Every other screen keeps the one-loop rule.
- Real buttons, tap targets of at least 48 px (module and work rows 64 px or more, the whole row is the button), a visible ultramarine focus ring; rooms are headings; the label sheet is a dialog that takes focus and closes with Escape; the sticker book is one button with a spoken summary; French room names carry `lang="fr"`. "Met" chips use ink on gold, since white on gold is too faint.

### Build steps

Small PRs, each run and checked on a 375 px phone before committing.

| Step | What | Visible change |
|---|---|---|
| 0 | This spec, the "Boundaries" edit, the scope line in AGENTS.md and CLAUDE.md | None (docs) |
| 1 | `content/modules.json` generated from `catalogue/modules.csv`, its types, and the content-check rules in "Catalogue file" | None |
| 2 | Contents and module pages: status chips, placeholder tiles, the museum label sheet, "View at the Louvre"; linked from today's home for testing | New pages |
| 3 | Cover as home: today's route moves to `/start/`; the tab bar (Cover and Contents); the sticker book; a finished level returns to its module. Old progress still shows | New home |
| 4 | The map, static: one swappable map drawing, the wing pages and their floors; the Map tab and the cover's "Open the map" arrive with it, never before | Map |
| 5 | Motion for the new screens, with reduced motion; the `moments:v1` additions | Motion |
| 6 | Close-ups per work in modules; the trail keeps its all-five gate | Close-ups |
| 7 | Recheck routine: a script lists works whose `checkedOn` is older than 90 days; a person rechecks the records before a release | None |
| 8 | Content in batches: first modules 09 and 10 (the same Denon level 1 rooms as four existing levels), then 04 and 03. Each work: record recheck, rights-checked photo, level, close-up round | New levels |

### Not in 0.6

- **A visit planner** waits: a "1-hour route" would promise walking times and open rooms we can't verify. Once about 20 levels exist, a "My visit list" sorted by wing, floor and room, with "check on the day", is the honest version.
- No turn-by-turn routes, no live open-room data, no in-app reduce-motion switch, no new levels beyond the five.

---

## 02 · CONTENT — content rules and data format

> All content is written in advance and checked by a person; the website only presents it.
> No AI is called at runtime.

### How to write

- 0.5 content is written in English.
- Talk like a friend telling you a story in front of the artwork: "you", short sentences, spoken style. A main-line passage is at most 45 words, a branch at most 40, a question at most 15.
- One level, one through-line. Each level follows one question about the work, and goes deep on it rather than listing facts.
- **Depth standard.** Conversational doesn't mean shallow. "Observe and describe" is the starting point, never the whole level. Across its five rounds, every level must cover, in plain spoken language:
  1. Context: the historical and political moment, and who commissioned, paid for or bought the work (or that nobody knows).
  2. Form, explained as why it matters: composition, space, light, colour, line, scale, viewpoint. Not "there is a triangle" but what the triangle does to you.
  3. Technique and materials: how it was physically made, and what that tells us.
  4. Iconography and sources: what the symbols mean and which earlier works or models it borrows from.
  5. Reception and afterlife: how it was received, displayed, restored, and how scholars' readings have changed.
  6. Real debates and open questions, presented as debates: name the positions (and a scholar or institution where possible), say what evidence each side has, and say what is still unknown.
  Shallow vs deep, for example: "Her hips tilt" (shallow) vs "Her weight sits on one leg so hips and shoulders tilt against each other: contrapposto, a Classical invention that makes stone look ready to step forward; her sculptor winds it into a spiral" (deep). The playbook has more examples and a depth check in its QA checklist.
- The first time a technical term appears, explain it in one plain sentence.
- Every fact must be traceable to a source, listed in the level's `sources`. For disputed claims, write "one theory is".
- Never invent things an artist said. Every quote needs a source.
- Artist voices (optional, a few per level): a short line in a speaker's speech bubble, at most 25 words for an imagined line and 30 for a quote. Each voice must match the speaker's documented personality and must never step outside the sourced facts of the level. A line written for them is marked as an imagined voice; a real quote is used only when it is documented, word for word in a published translation, with its source cited. Anything that can't be sourced is written "TBD", never invented. An artist only speaks about what they could have known in their lifetime (Leonardo can't comment on the 1911 theft). Wrong-answer branches can be voiced by another fitting person with a documented link to the work. When the maker is unknown, the artwork itself speaks, limited to its documented history. The voices are scripted and checked in advance; there is no live AI conversation. Rules and personas: see the playbook.
- Each question's options play three roles: the right answer, a near miss (a real neighbouring idea, e.g. chiaroscuro next to sfumato) and a common myth. No filler or joke options. A wrong-answer branch first credits the instinct, then says plainly that it isn't right, and carries a `correction`: why the idea is tempting, what is actually true, and the evidence that settles it. Contested points are never turned into right/wrong questions unless the evidence clearly favours one answer; otherwise the right answer is "nobody knows for sure" and the branches explain the positions.
- After the branches, every path rejoins the same main-line passage (the merge line). Anything everyone must remember goes there, so every player sees it whatever they picked.

### Content sample

The full scripts for all 5 artworks are in the [Branching Story Playbook](https://claude.ai/code/artifact/ff9f143f-3ac4-458a-8037-1c68ebbee5a8): how a level plays, writing rules, the production workflow and QA checklist, a script template, a batch-production prompt, and 5 levels with 25 questions. Write new content in its format and by its rules. The [revised playbook with artist voices](https://claude.ai/artifact/HmaiNoKUVeHwC2YBZ8AZox) (2026-10-09) merges scripted artist voices, persona cards and the optional voice fields into the same workflow, template, prompt and levels. Its depth revision (same link, 2026-10-09) adds the depth standard with shallow-vs-deep examples, the wrong-answer correction rules and a depth check in the QA checklist, and carries the rewritten levels.

### Data format

One JSON file per artwork. A level is a set of nodes; each node is one passage or one question, linked by `next`. Below is the opening of the Mona Lisa level (question 1 of the content sample), which is also the model for tone:

```json
{
  "museum": { "id": "louvre", "name": "The Louvre", "city": "Paris" },
  "artwork": {
    "id": "mona-lisa", "title": "Mona Lisa", "artist": "Leonardo da Vinci", "year": "c. 1503–1519",
    "image": "/images/mona-lisa.jpg", "imageCredit": "Wikimedia Commons · Public Domain",
    "medium": "Oil on poplar panel", "dimensions": "79.4 × 53.4 cm",
    "museumUrl": "https://collections.louvre.fr/ark:/53355/cl010062370"
  },
  "speakers": {
    "leonardo": { "name": "Leonardo da Vinci", "kind": "artist", "avatar": "leonardo" }
  },
  "lessons": [{
    "id": "mona-lisa-1", "order": 1, "title": "A face that seems to think", "start": "n1", "narrator": "leonardo",
    "nodes": {
      "n1": { "type": "story", "text": "Forget she's famous for a moment. A woman sits close to you, nearly life-size, her body turned slightly away. No crown, no halo. Then her eyes come round to meet yours.", "next": "q1",
              "voice": { "speaker": "leonardo", "kind": "imagined", "text": "Before you judge her, look. Her body turns one way, and her eyes come round to you. Living people move like that." } },
      "q1": { "type": "question", "text": "Where did your eye land first?",
              "choices": [ { "label": "Her eyes", "next": "b1a" }, { "label": "Her mouth", "next": "b1b" }, { "label": "Her hands", "next": "b1c" } ] },
      "b1a": { "type": "branch", "text": "Most people start there. Her eyes are on you, but her body hasn't finished turning. It's as if she sat down, then turned to hear what you were saying.", "next": "n2" },
      "b1b": { "type": "branch", "text": "The famous smile. Keep it in mind: in a minute you'll try to find exactly where it starts, and you won't be able to.", "next": "n2" },
      "b1c": { "type": "branch", "text": "Good eye; few people start there. Her hands rest one on the other, calm and heavy. They'll come back later, because they hide one of Leonardo's techniques.", "next": "n2" },
      "n2": { "type": "story", "text": "Here's why she feels alive: her face and body don't turn quite the same way. Now try something. Point to the exact spot where the shadow at the corner of her mouth ends.", "next": "q2" }
    },
    "takeaway": "Chiaroscuro makes her solid; sfumato keeps her edges soft. Together they make a face that seems to be thinking.",
    "sources": ["https://collections.louvre.fr/ark:/53355/cl010062370"]
  }]
}
```

There are only three node types: `story` (main line), `question` and `branch`. A `story` may lead to another `story` (up to three screens of main line between questions); the merge line is the first story after the branches. An option can carry `"correct": true`; questions with no right answer leave it out.

Optional fields (added 2026-10-09; a file without them still works, and the app must not require them):

| Where | Field | What it holds |
|---|---|---|
| `artwork` | `medium`, `dimensions`, `museumUrl` | The museum label next to the photo: medium, size as the Louvre records it, and the work's page on collections.louvre.fr ("View at the Louvre →") |
| top level | `speakers` | Who can speak in this file, by id: `name` (shown under the head), `kind` (`artist`, `artwork` when a statue with no known maker speaks, or `person` for another documented figure), `avatar` (id of the hand-drawn SVG: a painted head, or a doodled object for artworks and living artists) |
| `lessons[]` | `narrator` | Speaker id of the level's main narrator, shown on the route and the level page. Missing means no head |
| `branch` node | `correction` | Added 2026-10-09 for wrong-answer branches: `tempting` (why the idea is tempting, at most 30 words), `truth` (what is actually true, at most 35), `evidence` (the detail in the work or the documented fact that settles it, at most 35), optional `kind` (`near-miss` or `myth`, which sets the default heading "Close, but not quite" or "Not quite: a popular idea, but wrong") and optional `verdict` (a custom heading, at most 6 words). Shown as an ink-lined paper card under the branch text, with handwriting labels "Why it's tempting", "What's actually true", "How we know"; never red. The content check warns when a wrong choice (in a question that has a right answer) leads to a branch without one |
| `story` / `branch` node | `voice` | One line in a speech bubble beside the speaker's head: `speaker` (an id from `speakers`), `text` (at most 25 words; a quote at most 30), `kind` (`imagined` or `quote`). A `quote` also needs `cite` (short attribution shown under the bubble, e.g. "Letter to his brother, 28 Oct 1830") and `source` (URL, also listed in the level's `sources`) |

The node's `text` stays the friendly narration shown in print; `voice.text` is the speaker's own line, shown in handwriting in the bubble. An `imagined` voice always shows a small tag under the speaker's name, "Imagined voice, built from sourced facts"; a `quote` shows quotation marks and its `cite`. Nodes without `voice` show the narrator's head with no bubble. In 1.0, `story` and `branch` nodes gain an `audio` field pointing to that passage's audio. This structure maps one-to-one onto the 1.0 database tables, so upgrading is an import, not a rewrite.

### Challenge files

One file per artwork in `content/challenge/`, named like the level files (`01-mona-lisa.json`). It uses the same lesson and node format as a level, with these differences:

| Where | Field | What it holds |
|---|---|---|
| top level | `artworkId` | The level file's `artwork.id`; title, museum label, credit and speakers come from that file |
| top level | `zoomImage` | The reference image: `file` (Commons file name), `commons` (its file page), `width` and `height` in pixels, `licence`, `credit`, and `overview` (path of the "see where" image under `public/`) |
| `lessons[]` | `kind`, `unlock` | `"challenge"` and `"all-base-levels"` |
| `lessons[]` | `roundSize` | `2` |
| `lessons[]` | `pool` | Ordered intro-node ids of the questions in the rotation. Replaces `start` |
| `lessons[]` | `held` | `[{ "start", "why" }]`: sourced questions kept out of the rotation, with the reason |
| `lessons[]` | (no `takeaway`) | The cleared page shows the round's two merge lines instead |
| `story` / `question` node | `zoom` | `{ x, y, w, h, label, image }`: the normalized box, a description that doubles as alt text, and the crop's path under `public/`. The same on a question's intro and question node |
| `question` node | `sources` | `[{ "title", "url" }]`: the question's sources as players see them under the merge line |
| `choices[]` | `role` | `"right"`, `"near-miss"`, or `"myth"` for an approved exception |
| merge node | (no `next`) | The player goes on to the round's next question, or the cleared page |
| top level | `review` | Per question node id (`c1q`, …): `extends` (`nodes` in the level file, `concept`), `framing`, `what_you_learn`, `regionSources` and `choiceSources` (title, URL, the exact quoted passage, a translation marked "our translation" if not English, what it supports; `choiceSources` keyed by wrong-branch id), `confidence`, `notes`, `quoteCheck` and `cropCheck` (when and how quotes and crop were checked), and `exception` where an approved exception (a `myth` option) applies. Ignored by the app: it is the audit trail |

Node ids per question: `cN` intro, `cNq` question, `cNa`/`cNb`/`cNc` branches in option order, `cNm` merge. `npm run check-content` also checks challenge files: 3 options with one `right` and two wrong (`near-miss`, or `myth` where approved); a `correction` and a `choiceSources` entry for every wrong option; at least one `regionSources` quote; a `zoom` inside 0–1 on intro and question, the same on both, and its crop file in `public/`; every branch leads to the question's merge line; the word caps; every round the rotation can show within 144 s; and every node named in `review.extends` exists in the level file.

### Catalogue file

Added 2026-10-13 for 0.6. One file, `content/modules.json`, holds the catalogue: the wings, the 15 modules, the appendix, and for every work its place, display status and the date checked. Level files don't change: a work is linked to its level by `levelId`, and the level file's `artwork.id` equals the work's `id`. It is generated once from `catalogue/modules.csv` (verified rows only; display notes from `catalogue/top-100.csv`) and from then on edited by hand.

```json
{
  "museum": "louvre",
  "wings": [
    { "id": "denon", "name": "Denon", "floors": [-1, 0, 1] },
    { "id": "sully", "name": "Sully", "floors": [-1, 0, 1, 2] },
    { "id": "richelieu", "name": "Richelieu", "floors": [-1, 0, 1, 2] }
  ],
  "modules": [
    {
      "id": "09", "slug": "italian-high-renaissance-venetian-masters",
      "title": "Italian High Renaissance & Venetian Masters", "status": "open",
      "works": [
        {
          "id": "mona-lisa", "title": "Mona Lisa", "artist": "Leonardo da Vinci", "date": "1503–1519", "medium": "Oil on poplar panel",
          "department": "Paintings", "inventory": "INV 779",
          "location": { "wing": "denon", "floor": 1, "room": "711", "roomName": "Salle des États" },
          "display": "on-display", "checkedOn": "2026-10-13",
          "museumUrl": "https://collections.louvre.fr/en/ark:/53355/cl010062370",
          "levelId": "mona-lisa-1"
        },
        {
          "id": "la-belle-ferronniere", "title": "La Belle Ferronnière", "artist": "Leonardo da Vinci", "date": "c. 1490–1497", "medium": "Oil on walnut panel",
          "department": "Paintings", "inventory": "INV 778",
          "location": null, "display": "not-on-display",
          "displayNote": "Record: current location \"non exposé\".", "checkedOn": "2026-10-13",
          "museumUrl": "https://collections.louvre.fr/en/ark:/53355/cl010062372"
        }
      ]
    }
  ],
  "appendix": { "id": "beyond", "slug": "beyond-the-15", "title": "Beyond the 15", "works": [] }
}
```

| Where | Field | What it holds |
|---|---|---|
| top level | `wings` | `id`, `name`, and the `floors` the catalogue uses in that wing |
| `modules[]` | `id`, `slug`, `title` | `"01"` … `"15"` (the module number, also its route), a URL-safe name and the title |
| `modules[]` | `status` | `"open"`, or `"rooms-closed"` with `closedNote` and `checkedOn` (module 11) |
| `modules[]`, `appendix` | `works` | The works, already in module order (see "Order") |
| work | `id` | Unique across the file; for a work with a level, the level file's `artwork.id` |
| work | `title`, `artist`, `date`, `medium`, `department`, `inventory` | The museum label, as the record gives it (`artist` holds the culture when the maker is unknown; `medium` is the record's materials and technique in English, or "TBD" when not confirmed) |
| work | `titleFr` | Optional: the record's own French title, when it differs from `title`; shown on the label sheet with `lang="fr"` |
| work | `location` | `{ wing, floor, room, roomName? }`; `room` is a string ("711"), or `null` with `place` for a spot with no room number ("Escalier Mollien (upper)"). `null` when the work is not on display, on loan or by appointment only; kept for `room-closed` |
| work | `display` | `on-display`, `restricted`, `tbd`, `room-closed`, `not-on-display`, `on-loan` or `appointment-only` |
| work | `displayNote` | For any `display` other than `on-display`: the reason, in the record's own words where it has them |
| work | `checkedOn` | The date the record was checked, `YYYY-MM-DD` |
| work | `museumUrl` | The collections.louvre.fr record, or `null` for a work with no Louvre record (the Gallery of Five Continents works carry Musée du quai Branly inventory numbers) |
| work | `levelId` | Optional: the lesson id of the work's level (`"mona-lisa-1"`). Missing means "Coming soon" |
| work | `note` | Optional editorial note on the placement, for people; not shown to players |

`npm run check-content` also checks the catalogue: every work in exactly one module or the appendix (ids unique); every label field present (`medium` may be "TBD"), and `titleFr`, when given, different from `title`; every `levelId` names an existing lesson whose `artwork.id` equals the work's `id`, and every level file's artwork is in the catalogue; module ids `01`–`15` in order, each once; `location` well formed (a known wing, a floor that wing lists, a room of digits or `null` with a `place`; `null` only for off-view works); works in module order (on view by room number, then on view without a room number, then not on view); `display` from the list, with `displayNote` when not `on-display`; `checkedOn` a real date, with a warning when it is more than 90 days old.

---

## 03 · DESIGN — doodles and painted heads on a beige page, real art in the frames

Fresh, light and playful, like a child's sketchbook left open in a museum. Two references work together:

- **Doodles and handwriting** (the hand-drawn museum videos and HeyTea posters Steven shared): the interface is drawn with one black ink line, a little crayon colour and childlike handwriting.
- **After Hours** (a MoMA artists project by @llleahb, from the screen recording Steven shared): flat painted artist heads, a warm page, one ultramarine accent, and the real artwork photo beside a museum-style label.

They don't compete because each has its own job: **ink doodles and handwriting are the chrome, painted heads are the characters, photos and labels are the museum.** The artworks stay exactly as they are: always the official photograph, never drawn.

**Three layers, never mixed:**

- **Doodle layer (the chrome):** buttons, the level route, icons, small stickers, headlines, speech bubbles and frames. One black ink line, one stroke weight, slightly wobbly, plus a little crayon colour. Text that is "spoken" (headlines, questions, options, buttons, speech bubbles) is in handwriting.
- **Character layer (the narrators):** each artist is a flat painted head: blocks of colour with no outlines, playful colours (a pink face, an orange or blue nose), features as a few small dark marks. A head sits inside a hand-drawn ink circle on the beige "stage" under the artwork and talks in a hand-drawn ink speech bubble. This is where ink meets paint: the line belongs to the frame and the bubble, never to the head. Living artists (from later museums) get a doodled object instead of a face. When the artwork itself speaks (a statue with no known maker), its avatar is a doodled object (default: a marble block on a plinth), never a drawing of the artwork.
- **Artwork layer (the museum):** the public-domain photo of the work on a plain white mat, straight edges, no filters, nothing drawn over it. Beside or under it, a small museum-style label in print type with straight edges: artist, title, year, medium, size, and "View at the Louvre →" linking to the work's page on collections.louvre.fr. Zoom-ins are crops of the same original photo, never redrawn.

> **Don't:** draw, trace or "cute-ify" an artwork; let a doodle, head or bubble overlap an artwork or its label; outline the painted heads; copy After Hours' own drawings (ours are drawn for this project); use AI-generated illustrations (doodles and heads are drawn by a person); glossy gradients, stacked shadows, screens full of emoji.

Style mockup: https://claude.ai/artifact/4bXH7X41KuFCAuQ1L4D49x

### Colours (suggested, can change)

| Use | Colour | Value |
|---|---|---|
| Page background | Warm beige off-white | `#F5F0E6` |
| Stage under the artwork, where heads sit | Deeper beige | `#ECE4D3` |
| Mat around the artwork, label card, speech bubbles | Paper white | `#FFFDF8` |
| Doodle line and body text | Ink | `#1F1F1F` |
| Secondary text | Warm grey | `#6E6A63` |
| The one accent: main button, current level, selection | Ultramarine | `#2A3F8F` |
| Done, streaks | Gold-brown | `#B08D57` |
| Dividers, card and label borders | Light warm grey | `#E2DACB` |
| Crayon touches inside doodles only (stickers, a scribble under a headline) | Crayon yellow, crayon coral | `#F2C14E`, `#E8836B` |

Ultramarine is the only accent, so it always means "this is the thing to tap" or "you are here". It has a story: in the Renaissance it was ground from lapis lazuli, cost more than gold, and was often used for the Virgin's robe. Crayon colours stay inside doodles and never mark a state. The painted heads may use their own playful colours. Wrong answers are never shown in red; plain text explains them.

### Type and layout

- Handwriting for voice: headlines, questions, answer options, buttons, route labels and speech bubbles use a childlike hand font (default: Gaegu, Google Fonts). Later it can be replaced by real children's handwriting, as HeyTea does.
- Print for reading: story and branch text, the museum label, the "imagined voice" tag and sources use a clean rounded sans-serif (default: Nunito, Google Fonts), so longer passages stay easy to read.
- Designed for a 375px-wide phone; on desktop, content is at most 640px wide, centred.
- Body text 17px, line height 1.7; buttons at least 48px tall for one-handed use.
- Buttons and answer options are hand-drawn ink pills with handwriting labels: the main action filled ultramarine with white text, others paper white with the ink line; the selected option gets an ultramarine line.
- The level route is a squiggly ink line; each level node is its narrator's painted head in an ink circle. Done gets a gold-brown tick, the current level an ultramarine ring and "Start" ("Continue" once it has been left mid-way), locked levels are faded.
- Artworks and their labels get no rounded corners and no filters. Doodle shapes, heads and bubbles may be wobbly and rounded; artworks never are.
- Doodles are simple SVG line drawings, hand-drawn, one stroke weight. Heads are flat SVG shapes drawn by a person, friendly rather than accurate portraits.

### Motion

Added 2026-10-13, from the approved plan (project files, `animation/PLAN.md`, and its demo) and the product owner's decisions on it.

Motion copies the language of After Hours (heads that rise into place, a quiet idle float, the speaker lifting while it talks, a bubble that comes from the speaker), never its drawings and never its streamed text.

- **Only the doodle chrome and the narrator heads move.** The artwork photo, the close-up crops, the "see where" thumbnail and the museum label never move, scale, pan, re-render, change filter or get anything drawn over them.
- **Nothing waits for motion.** Text appears complete, the whole line at once (no typing effect, no "typing…" dots); buttons work from the first frame; screen changes happen on tap. Added waiting time per level: 0 s.
- **Right and wrong are told by the narrator, never by red:** a small hop and three ink strokes for a right answer, a thoughtful head tilt for a wrong one (then the correction card rises as one block), and the progress segment fills gold either way. Questions with no right answer get no reaction.
- **Where it moves:** on a level or challenge screen, the narrator rises into place on the first screen of a visit (or when a new speaker takes over), floats 2 px while you read, and lifts and chatters while its bubble is new; options rise in quickly one after another. Challenge rounds use exactly the same head motion; the crops stay as still as the photos. On the level-cleared page the narrator hops once above the stars, which pop in, and the underline draws itself. On the route, the level just finished gets its tick and the route to the next level draws itself once; only the current level's head floats; a tapped locked level wiggles its padlock. On the first home visit after all five levels, the Close-Up Challenge unlocks once: the magnifier turns ultramarine, the padlock opens and the line reads "Close-ups unlocked."; on later visits that line is gone.
- **Small and calm:** 2 px idle float, moves of at most 7 px, 150–700 ms one-shots; at most one looping movement per screen (plus a blink; the 0.6 map is the one approved exception); no confetti, shake or flashing.
- **Reduced motion:** the app follows the device's "reduce motion" setting (no in-app switch in 0.5). Then nothing moves; things that appear fade in 150 ms at most, and drawn lines are shown already drawn. Everything reads and works the same.
- **Built with CSS** (`transform`, `opacity` and the stroke drawing of ink lines), no animation library. Heads animate through named layers (`head`, optional `eyes`, `mouth-closed`/`mouth-open`), so a hand-drawn head drops in without code changes. The layer contract is in `animation/PLAN.md` §4 in the project files: artist heads come with closed and open mouths; doodled objects (statues, later living artists) need no eyes or mouth.
- **Saved progress is untouched.** The two one-shot home moments are remembered in one extra localStorage key, `louvre-before-you-go:moments:v1`; losing it only replays or skips a moment.

### Reference products

| Reference | Learn from | Don't copy |
|---|---|---|
| Duolingo | Level route, a little every day, small celebration on clearing a level | Saturated colours, a single mascot |
| After Hours (@llleahb, MoMA artists project) | Flat painted artist heads, warm quiet page, one blue accent, label card beside the real artwork, artists talking in bubbles | Their drawings themselves, and the live AI chat mode (we don't use AI at runtime; our artist voices are scripted and sourced in advance) |
| HeyTea posters | Childlike handwriting and loose doodles; fresh and relaxed | Drawing over the product itself (for us: the artwork) |
| Google Arts & Culture | Large artwork images, zooming into details | Pages that are too dense |
| Louvre collections site<br>`collections.louvre.fr` | Restrained layout, how artwork information and labels are written | Archive-style stacks of fields |
| 2–3 website screenshots from the product owner | Overall feel and colours | To be added |

When building pages, the screenshots take precedence over this text. Where they conflict, follow the screenshots.

---

## 03 · TECH — technical plan

One rule for every choice: common, free, and maintainable later by someone who doesn't code. Code lives on GitHub, and pushing code deploys it: GitHub Pages for 0.5, then Vercel for 1.0 once there is login and a database.

| Layer | Choice | 0.5 | 1.0 |
|---|---|---|---|
| Front end | Next.js (App Router) + TypeScript + Tailwind CSS | Yes | Yes |
| Code repository | GitHub | Yes | Yes |
| Hosting and deploy | GitHub Pages (0.5) → Vercel (1.0), both deploy on push | GitHub Pages | Vercel |
| Content | JSON files under `content/` | Yes | Imported into Supabase by script |
| Audio | After the text is final, generate mp3s offline with an English TTS tool (e.g. ElevenLabs or OpenAI TTS), one voice throughout | No | Stored in Supabase Storage |
| Progress | Browser localStorage | Yes | Supabase after login; localStorage when not logged in |
| Database, login, file storage | Supabase | No | Yes |
| Artwork images | Public-domain images from Wikimedia Commons | In `public/images/` | In Supabase Storage |
| Analytics | Vercel Analytics | No | Yes |
| Domain | The free default address first | `username.github.io/repo-name` | `xxx.vercel.app`, custom domain optional |

> **No database in 0.5; publish on GitHub Pages.** One less service is one less thing to break. 0.5 is a fully static site: turn on Next.js static export (`output: 'export'`, with `basePath` set to the repo name) and let GitHub Actions build and publish on every push. Use `npm run dev` to preview locally.

### 1.0 Supabase tables

| Table | Stores | Key fields |
|---|---|---|
| museums | Museums | id, name |
| artworks | Artworks | museum_id, title, artist, year, image_url, image_credit |
| hotspots | Info points on an artwork | artwork_id, x, y, text |
| lessons | Levels | artwork_id, order, title, takeaway, sources |
| nodes | Story nodes | lesson_id, type, text, next_node_id |
| choices | Question options | node_id, label, correct, next_node_id |
| progress | User progress | user_id, lesson_id, completed_at |

- Content tables are readable by everyone; `progress` is readable and writable only by its owner (RLS on).
- Login by email magic link, no passwords.
- Streak days are computed from `progress` completion dates, not stored separately.
- Keys live in Vercel environment variables, never in the repository.

Cost: the site and database stay within free tiers. Only two things may cost money: generating 1.0 audio (one-off) and a custom domain.

---

## 03 · DONE & SCOPE — when these are done, it's done

Every item can be ticked, no gut feeling. When all are ticked, the version is done.

### 0.5 acceptance

- [ ] All 5 artworks, 5 levels and 25 questions live; every fact checked and sourced
- [ ] On a phone, each level finishes in about 5 minutes, and never more than 7; one work (level plus close-up round) within 10 minutes; the whole Close-Up Challenge (5 rounds) within 12 minutes
- [ ] Close the browser and reopen it: progress is still there
- [ ] Leave a level mid-way and reopen it: it continues from the same question
- [ ] 3 people who didn't help build it play it; at least 2 finish all 5 levels without prompting
- [ ] Published on GitHub Pages with a public link that opens on a phone, with page screenshots good enough to show
- [ ] Adding one new JSON file, without changing code, adds one more artwork

### 0.6 acceptance

- [ ] All 100 works in the catalogue appear, each in exactly one module or the appendix, and `npm run check-content` passes
- [ ] Every module opens from the contents page within two taps, and every module with works on view also from the map
- [ ] Every work not on view shows its reason and the date checked, and is listed last in its module
- [ ] A player with 0.5 progress keeps every tick and saved place
- [ ] The five existing levels play both from their modules and from the "Start here" trail
- [ ] On a 375 px phone every new page works without horizontal scrolling, and the map is never the only way in

### 1.0 acceptance

- [ ] Each of the 5 artworks deepened to 5 levels, 25 levels live, all checked and voiced
- [ ] Deployed to Vercel with a public link
- [ ] Finishing an artwork's 5 levels unlocks its artwork card, and every info point on the card opens
- [ ] After login, progress carries over to another device
- [ ] Of 10 playtesters, at least half come back on their own and play on 3 or more days in the first week
- [ ] Monthly running cost is $0

> **The playtest item matters most: people come back on their own.**
> Duolingo works not because it has lots of content, but because you want to open it again tomorrow.

### Boundaries: neither 0.5 nor 1.0 does these

One principle covers most boundaries: content is written in advance and checked by a person; the website only presents it.

| Not doing | Why |
|---|---|
| On-site guiding, identifying artworks from photos | The product is only for before the trip; general AI chat can already identify artworks from photos |
| Real-time AI-generated content or audio | Every use calls an API, which is costly, and the content can't be checked in advance |
| Talking with the artist (AI playing Leonardo) | Uses lots of tokens and easily invents things that never happened; to be tested separately later. Scripted artist voices, written and source-checked in advance, are fine (see "How to write") |
| 3D or virtual tours, turn-by-turn routes, live open-room data | The product is for before the trip. A schematic map for finding modules is in scope from 0.6 (see "0.6 · Museum framework"); on-site guiding is not |
| Museums other than the Louvre | Coming, but 0.5 and 1.0 do one museum thoroughly first |
| An in-depth academic edition | Target users are beginners, not scholars. Professional depth in plain language is in scope (see "Depth standard"); footnotes, jargon and exhaustive coverage are not |
| App, payments, comments and community | Not needed now |

> **Image rights:** use only public-domain images of artworks (e.g. those marked Public Domain on Wikimedia Commons), and credit the source on the "About and sources" page. No AI-generated "copies" of artworks.

---

## 04 · NEXT — 1.0 and beyond

Once the 0.5 template works, 1.0 only changes content and adds features. It still covers only the Louvre and the same 5 artworks, each in more depth.

| | 0.5 | 1.0 | Later |
|---|---|---|---|
| Museums | The Louvre | The Louvre | Add as needed, e.g. the Uffizi, the Musée d'Orsay |
| Artworks | 5 masterpieces | The same 5, each deeper | About 10 per museum |
| Levels | 5 (1 per artwork), 25 questions | 25 (5 per artwork), 125 questions | — |
| Entry point | One level route | The same route, in sections by artwork, 5 levels each | Choose a museum, set a departure date, countdown route |
| Hosting | GitHub Pages, public link | Move to Vercel (for login and database) | Custom domain |
| Audio | None, text only | Main line and branches read aloud, auto-play, with pause, replay and mute; questions and options not read | — |
| Artwork card | None | Unlocked after an artwork's 5 levels: large image + 2–3 tappable info points | — |
| Animation and effects | Narrator heads and doodle chrome, restrained (see "Motion") | Lip-sync to audio, artwork cards | — |
| Progress | Saved in the browser | Optional email login, progress across devices; daily streak | Daily reminders |
| Database | Not needed | Supabase | Supabase |

### 1.0 goes deeper: each artwork grows from 1 level to 5

Five levels are five angles on the same work. 5 questions per level, each level under 5 minutes. Mona Lisa as an example (sample only; the product owner's final version decides):

| | Angle | A sample question |
|---|---|---|
| 1 | Look first | Where did your eye land first? |
| 2 | Is she smiling? | Do you think she's smiling? Why can't you be sure? |
| 3 | The man who painted her | Why did Leonardo dissect human bodies? |
| 4 | The woman in the picture | Who do you think she is? |
| 5 | The painting's fate | It was stolen in 1911. Guess who took it? |

### Open questions: go with the default in brackets, then ask the product owner

- What is the official name? (For now: Louvre Before You Go; decide an umbrella name when other museums are added)
- Which story does each artwork's first level tell? (Default: the topics in the "Five levels, five artworks" table)
- Which five masterpieces? (Decided: Mona Lisa, Venus de Milo, Winged Victory of Samothrace, Liberty Leading the People, The Raft of the Medusa)
- Is 0.5 in Chinese or English? (Decided: English, for content, interface and this spec)
- Fonts and look? (Decided 2026-10-09: doodle chrome and handwriting combined with After Hours-style flat painted heads, a beige page, one ultramarine accent, and real artwork photos with museum labels; fonts default to Gaegu for handwriting and Nunito for reading)
- Photos of the two sculptures: the photographer owns the copyright of a sculpture photo, so find ones marked Public Domain or CC0. (Done 2026-10-09: CC0 photos from Wikimedia Commons, Venus de Milo by Shonagon and Winged Victory by Wilfredor)
- Which voice for 1.0 audio? (Default: a warm English female voice; generate the first level as a test before deciding)
- Is login required in 1.0? (Default: no; login only syncs progress)
- Version name for the museum framework? (Decided 2026-10-13: 0.6)
- Modules locked or free? (Decided 2026-10-13: free, with "Next up" inside each module)
- Close-ups per work or one gate per module? (Decided 2026-10-13: per work, when that work's level is done; the "Start here" trail keeps its all-five gate)
- Works not on view: stay in their module or move to the appendix? (Decided 2026-10-13: stay, listed last)
- The map's art style? (Decided 2026-10-14: Map A, the illustrated doodle map, with all its idle animations kept as an approved exception to the one-loop rule)

---

You build it yourself; we help you get there.
