# Louvre Before You Go · Product Spec

> Product spec · version 0.6 (Museum framework) · last revised 19 Oct 2026
> Taopai Studio · live at https://leslylou0457.github.io/louvre-before-you-go/
>
> This file is the source of truth for what the product is and how it is built. It describes the product as it is now and the road ahead; how each rule was reached is in git and, in short, in "Decision log" at the end. When a requirement changes, this file changes first, then the code.

**Duolingo for art history. See it before you go; recognise it when you're there.**
One level, one small story about one artwork, a few minutes a day.

## At a glance

| | Item | Content |
|---|---|---|
| 01 | Mission | An educational product: players learn real, sourced art history while they play. Accuracy and depth come before charm, and every fact has two independent sources |
| 02 | Version | 0.6, "Museum framework": a cover, a contents page, 15 chapters and an appendix holding 100 Louvre works, a schematic map, and the 0.5 "Start here" trail |
| 03 | Content today | 28 playable works, each with one level and one close-up round (see "Content status"); the other 72 works show as "Coming soon" or "Not on view" |
| 04 | How it grows | In research batches, one work at a time: reviewed research, a rights-checked photo, a level and a close-up round (see "Content pipeline") |
| 05 | Limits | No AI calls at runtime, no database, no audio, no sign-up; progress lives in the browser |
| 06 | Done when | The acceptance lists under "Done and scope" are ticked |

---

## 01 · THE PRODUCT — a small art history course that gets you ready to go

Louvre Before You Go is "Duolingo for art history". When you are planning to visit a museum or see an exhibition, it spends a few minutes a day with you before you leave: one level, one small story about one artwork.

> **See it before you go; recognise it when you're there.**
> When you stand in front of the work, you know it, and you know what happened behind it, like meeting an old friend.

How it differs from what exists: a full video lecture is too long and your mind wanders; an encyclopedia is too dry and nothing sticks. Here, knowledge is cut into short stories, and questions pull you back in. Storytelling comes first, but the knowledge is real: every level carries professional art-history analysis (context, form, technique, sources, reception, open debates), told the way a friend who is an art historian would tell it. It is a learning product: a player who finishes a level should be able to say something true and specific about the work that they did not know before.

### Product logic: the whole product does one thing, before the trip

From deciding to visit a museum to the day you leave.

Pick a destination (a museum or an exhibition) → set a departure date (countdown route, up to 100 days) → one level a day (story · question · branch, about 5 minutes) → clear it, move on → go (you've already "met" the masterpieces)

Today the product covers one museum, the Louvre, as a book of chapters you can open freely. Choosing a museum, a departure date and a countdown come later (see "Next").

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

## 02 · VERSIONS — what is live and what comes next

| Version | What it is | State |
|---|---|---|
| 0.5 | 5 Louvre masterpieces, 1 level each, 25 questions, on one route; the Close-Up Challenge after all five; restrained motion | Built and live. It lives on as the "Start here" trail |
| 0.6 | The Louvre as a book: cover, contents, 15 chapters and an appendix (100 works), a schematic map, close-up rounds per work, and new levels added in batches | Live since 14 Oct 2026; content (build step 8) in progress, 28 of 100 works playable |
| 1.0 | Audio, login and progress across devices, Vercel and Supabase | Not started (see "Next") |

### The "Start here" trail: the five 0.5 levels

The trail is the five 0.5 levels in a fixed route order, with the Close-Up Challenge unlocked after all five. Its five lesson ids are fixed in code (`src/lib/trail.ts`); levels added later never join it.

| | Artwork | Artist | What the level is about | A sample question |
|---|---|---|---|---|
| 1 | Mona Lisa | Leonardo da Vinci | How sfumato, chiaroscuro and atmospheric perspective make a face seem to think; who she was, who kept her, and what time has done to her | You can't find the edge of the shadow at her mouth. What is that trick called? |
| 2 | Venus de Milo | Greek, Hellenistic period | A Hellenistic remake of a Classical ideal: contrapposto and spiral pose, the lost signature and the dating fight, what her arms held, where she stood | Are the lines across her shoulders and hips parallel? |
| 3 | Winged Victory of Samothrace | Greek, Hellenistic period | Look down first: the ship, the wind in the drapery, the hilltop setting (and the disproved fountain), who dedicated her and why nobody can say, how much is restored | No wind was carved. So how do you know it's blowing? |
| 4 | Liberty Leading the People | Eugène Delacroix | July 1830, allegory meets street fight: pyramid and colour, the crowd's classes, the repentir, the 2024 restoration, and a painting the state kept hiding | Is she a real woman who fought that day? |
| 5 | The Raft of the Medusa | Théodore Géricault | A real political scandal, the moment the painter chose, two pyramids, heroic bodies from Michelangelo, the darkening, and how readings still divide | You're Géricault. Which moment do you paint? |

### Content status (19 Oct 2026)

28 works have a level and a close-up round. `content/modules.json` is the live list (a work with a `levelId` is playable), and `npm run check-content` prints the counts and every level's timing.

| Chapter | Works with a level |
|---|---|
| 02 · Ancient Persia & the Levant | Frieze of Archers; Capital from the Apadana |
| 04 · Ancient Greece: Gods & Mythology | Head from Keros; Lady of Auxerre; Rampin Head; Kore of Samos; Venus de Milo; Plaque of the Ergastines; Winged Victory of Samothrace |
| 05 · Ancient Rome & Etruscan Civilizations | Borghese Gladiator; Sleeping Hermaphroditus; Sarcophagus of the Spouses |
| 09 · Italian High Renaissance & Venetian Masters | Mona Lisa; The Virgin of the Rocks; The Virgin and Child with Saint Anne; The Wedding Feast at Cana; Portrait of Baldassare Castiglione; The Death of the Virgin; Woman with a Mirror; La Belle Ferronnière (not on view); Pastoral Concert (not on view) |
| 10 · French Neoclassicism & Romanticism | Liberty Leading the People; The Raft of the Medusa; The Coronation of Napoleon; The Oath of the Horatii; The Intervention of the Sabine Women; The Death of Sardanapalus; La Grande Odalisque |

Chapters 09 and 10 have a level for every work, and Chapter 04 for every work except the off-view Antaios Krater. Next in line: Diana of Versailles (Chapter 05) and the Mesha Stele (Chapter 02), with the Seated Scribe (Chapter 03) as an alternative (see "Next").

---

## 02 · How a level plays — tell a story, ask, branch, return

**Flow of one level · a loop of questions (how many depends on the work)**

```
Main line: tell a story → ask a question ─┬─ pick A → branch A ─┬→ back to main line
                                          └─ pick B → branch B ─┘     │
                                             (a wrong answer never blocks you)
        ↑──────────── next question (3 or more per level) ─────────────┤
                                                                       └─ all answered → level cleared
```

### Rules for one level

1. The main line tells a short story: one to three screens between questions, each 2–4 sentences.
2. A question appears, with 2–3 options.
3. The choice leads to a short branch (1–3 sentences), then back to the main line.
4. Repeat for every question, then clear the level. The number of questions is flexible per work: more for a rich work, fewer for a thin one, at least 3; the time budget below is the only cap. Today's levels have 4 to 6.

### Three details

- **A wrong answer never blocks you, and it is always corrected.** A wrong pick opens its own branch. The branch says plainly that the answer isn't right, then a correction card explains why the idea is tempting, what is actually true, and the evidence (a detail in the work or a documented fact) that settles it. Never shown in red. A wrong answer is another chance to tell a story.
- **Some questions have no right answer.** For example, "Where did your eye land first?": each option leads to a different branch.
- **A level takes about 5 minutes, never more than 7.** One screen shows one passage or one question; tap to move on. Everything about one work, its level plus its close-up round, stays within 10 minutes. `npm run check-content` times every level with the challenge's reading model (0.3 s a word, counting each screen's text, voice line, options and, on a wrong branch, its correction card; plus a 1 s tap per screen and 5 s per question to choose): it fails a level whose slowest path (every answer wrong, every card read) is over 7 minutes, warns when the all-right path is over 6, and fails a work whose level plus its heaviest close-up play is over 10 minutes. The deploy runs the same check before it builds, so a level over budget can't ship.

> **Audio waits for 1.0:** the product is text only for now; get the story and pacing right first. Write it the way people speak, so the 1.0 voice-over needs no rewrite.

### Pages and interaction

| Page | Route | What it does |
|---|---|---|
| Cover (home) | `/` | See "0.6 · Museum framework" |
| Start here | `/start/` | The trail: a vertical route of the 5 level nodes in three states (done, current, locked); the current level has "Start", a level left mid-way has "Continue". Below it, the Close-Up Challenge, locked until all 5 levels are done |
| Lesson page | `/lesson/<id>/` | Top half: the artwork (tap to zoom). Bottom half: one passage or one question, with the narrator on the stage. Progress bar at the top ("Question 3 of 5") and an exit button |
| Level cleared page | `/lesson/<id>/done/` | The level's narrator above the stars, then "One thing to remember today": a one-sentence summary of the level; then where to go next (see "Progress, 'Next up' and seals") |
| Close-up round | `/challenge/<id>/`, `/challenge/<id>/done/` | See "Close-up rounds" |
| About and sources | `/about/` | Image sources and references, the voice tags, one line about Lesly |

- Tapping a locked trail level shows a light hint, "Finish the previous level first", not a pop-up.
- Leaving mid-level saves your place in the browser: reopening the level (or reloading the page) picks up at the same passage or question, with a small "Start over" link to replay it from the beginning. The saved place is cleared when the level is finished. Finished levels can be replayed.
- Restrained motion (see "Motion"): the narrator rises into place, floats, talks and reacts to right and wrong answers; bubbles, options, correction cards, stars and the route move a little. Nothing ever waits for an animation, and the artwork never moves. No full-screen confetti.
- The first time a player meets Lesly (her first screen on the stage in any level), one extra line in her handwriting under her head introduces her, once: "Welcome, my friend! I'm Lesly, a student at UVA, and today I'll be your guide through the Louvre's world of art!" (the product owner's wording, 18 Oct 2026). The costume is our own drawing of our character, not a claim about any artwork. Remembered as `leslyMet` in `louvre-before-you-go:moments:v1`; losing it only shows the line again.

---

## 02 · Close-up rounds — zoom into the real work

From the approved design (project files, `challenge/DESIGN.md`) and the product owner's decisions on it.

Every work with a level has one **close-up round**: a few questions, each zooming into one region of the real artwork, a crop of a high-resolution photo, and asking a harder question built on something the level taught. "Challenge" means advanced; nothing is paid. On the "Start here" trail the five rounds form the **Close-Up Challenge**; in the chapters each round opens on its own (see "Close-ups per work").

### Rules for a round

1. **Unlock.** On the trail: all 5 trail levels finished; before that the challenge shows locked with one line saying why ("Finish all five levels to unlock the close-ups"), not a pop-up, and its rounds then open one at a time in route order (finished rounds can be replayed). In a chapter: as soon as that work's level is done.
2. **A few questions per round, flexible per work:** each round sets its `roundSize`, from 1 to 4 (every round so far uses 2), within the time budget below. Each artwork keeps an ordered **pool** of fully sourced questions, at least `roundSize` long. Play *k* (0, 1, 2, …) shows pool items *k*·size to *k*·size + size − 1, counted round the pool (indices modulo the pool size), so the first play is always the first ones and a replay shows the next. One play counter per artwork in localStorage; it moves on when a round is finished. A pool of 3 repeats a question on the third play; a pool of 2 shows the same pair every time.
3. **One question is 4 screens,** the usual loop: an intro with the zoomed crop, the question with 3 options, the branch (a wrong pick gets the usual correction card), and the merge line every player sees. The crop stays on screen for the whole question, with a small "see where" thumbnail of the whole work with the region outlined; tapping the crop opens it full screen, tapping the thumbnail opens the whole work with the outline. The round's cleared page repeats its merge lines.
4. **Sources on screen:** each question's merge screen lists its sources in small print, with links.
5. **Saved like a level:** leaving or reloading mid-round picks up at the same screen of the same questions, with "Start over"; the place is cleared when the round is finished.

### Options: one right answer, two near misses

- Exactly **3 options**: one right and **two near misses**. A near miss is a real alternative from the work's own world: a technique, device or reading genuinely used in the period, or a documented fact about this very object (a yellowed varnish, a documented retouching, a tear). Picked and corrected, it still teaches something true. Never silly, obviously wrong or irrelevant.
- Every wrong option leads to a branch with a `correction` card, and the source of what the card says.
- **"Nobody can tell"** counts as a near miss only where a source shows the evidence does exist.
- **Approved exception:** the Mona Lisa horizon question keeps the documented "uneven horizon" misreading as its second wrong option (role `myth`).
- Live debates are never right/wrong. If a fact is settled but its meaning is open, the right answer states the fact and the merge line says what's unknown.
- Every question extends the level: a new place in the work, the physical mechanism, the reason, or the correction of a common misreading. It never repeats a level question with a new picture. Where a source gives the reason a feature sits in that exact place, ask **why it is there**.
- The round title, the crop's alt text and the intro never give the answer away.

### Accuracy rule (non-negotiable)

- **A zoom region is used only if a source explicitly places that technique, feature or condition in that exact area of the work.** No source locating it, no question.
- Every quoted passage and fact is checked against the source text, and every crop is checked by eye against the region the source describes, before a question ships. A question whose crop can't show its feature clearly, or whose source is not yet strong enough, is kept out of the rotation in `held`, with the reason. Held today: Venus de Milo c2, Winged Victory c1 and c4, Raft of the Medusa c1, Saint Anne c3.
- Preferred sources: the museum (collections.louvre.fr, the Louvre's Focus guides and teaching files, curators' statements), the C2RMF and peer-reviewed technical studies, primary sources, then established scholarship and reference works. Page numbers or editions not yet checked stay "TBD" in the review notes and are never shown to players as claims.

### Time budget

Every work's level plus its close-up round stays within **10 minutes** (see "Three details"). The trail's whole challenge, all 5 rounds, takes at most **12 minutes** (720 s), even when every answer is wrong and every correction card is read; that is 144 s a round on average. These are the hard limits; a single round over 144 s only gets a warning.

Model (also used by the content check): reading at 200 words per minute (0.3 s a word, the low end of adult silent reading; Brysbaert 2019, *Journal of Memory and Language* 109, 104047); per question 6 s looking at the zoom, 5 s choosing and 4 taps of 1 s (15 s); per round, the title and the cleared page's merge lines plus 2 taps.

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

At the caps the worst path is 160 words (63 s) and the right path 105 words (46.5 s) per question, so 2 questions fit a 144 s share and a 3- or 4-question round needs a lighter level or lighter questions. The content check computes every set of questions the rotation can show, warns when one is over 144 s, and fails a work whose level plus its heaviest play is over 10 minutes and a trail whose five heaviest plays are over 12.

### Images

- Zooms come from a high-resolution reference image: for the Mona Lisa the uncropped C2RMF scan on Wikimedia Commons, for the other works the same Commons file the level photo comes from. Public domain or CC0 only; credits as for the level photos, and the About page links the reference file.
- Regions are normalized boxes `{ x, y, w, h }`: fractions 0–1 of the full reference image, top-left origin, measured on the full image.
- Crops are cut once, offline, at about 1200 px on the long side (never upscaled) into `public/images/challenge/<artwork id>/<question id>.jpg`, plus `overview.jpg`, a small copy of the whole reference image for the "see where" thumbnail. The multi-megabyte originals are not kept in the repo.
- Crops are never redrawn, filtered or drawn on. The only outline is drawn by the page over the overview thumbnail, around the region; the image file itself stays untouched.

---

## 02 · 0.6 · Museum framework — a cover, a contents page, 15 modules and a map

From the approved framework design (project files: `framework/DESIGN.html`, its clickable `framework/prototype.html`, and the mapping `catalogue/modules.csv` with `catalogue/top-100.csv` and `catalogue/module-candidates.csv`) and the product owner's decisions on it.

0.6 turns the five-level route into a book for the whole museum: a cover, a contents page, **15 modules** and an appendix, "Beyond the 15", and a map of the three wings. The book holds **100 Louvre works** (`catalogue/top-100.csv`), each in exactly one module or the appendix, whether or not its level exists yet. Levels arrive one work at a time, each with a record recheck, a rights-checked photo, its level and its close-up round (see "Content pipeline").

### Words used in this section

- **Module:** a group of neighbouring rooms of one region or period, in the product owner's own curatorial structure, not an official Louvre route. On screen it is called a chapter ("Chapter 09"), as in the design's book: the cover, the contents page and room numbers used as page numbers.
- **Floor:** one of the Louvre's floors, −1 to 2, keeping the Louvre's own numbering. On screen it is labelled "Floor 1", never "Level 1"; the screen, this spec and the data all say "floor" so it is never confused with a game level.
- **Level:** the game about one work (at least 3 questions).

### Structure and navigation

```
Cover → Map → Wing → Floor → Module → Work → Close-up round
Cover → Contents → Module
Cover → "Start here" trail → the 5 trail levels and the Close-Up Challenge
```

| Page | Route | What it does |
|---|---|---|
| Cover (home) | `/` | The title with a small flat drawing of the Louvre at its right (the palace and the glass pyramid against a pale-blue swash of sky, with "LOUVRE" on the ground and "PARIS" below in the handwriting font; our own drawing, never traced), the cover copy (below), "Open the map", "Contents", the "Start here" card (continue where you left off), a "Continue · <work>" button when a chapter level is left mid-way (the one most recently played, opened in its chapter), and the sticker book: one mark per work, module by module |
| Start here | `/start/` | The trail and the Close-Up Challenge |
| Map | `/map/` | The three wings, tappable (see "The map") |
| Wing | `/map/denon/`, `/map/sully/`, `/map/richelieu/` | The map zoomed to one wing and its floors, top floor first, each with its module and work counts and room range. Picking a floor (page state, with a `#level-1` anchor) lists the modules with works on that floor, with "also on Sully, Floor 0"-style notes when a module continues elsewhere. Static pages, so they can be linked |
| Contents | `/contents/` | All 15 modules and the appendix: number, title, wings and floors, progress, and the room range on the right like page numbers in a book; a wing filter |
| Module | `/chapter/01/` … `/chapter/15/`, `/chapter/beyond/` | Number, title, wings and floors, room range, progress dots, the "not a walking route" line, then the works under room headings ("Room 711") in module order, works not on view last under "Not on view right now", and the module's close-up rounds at the bottom. A work with a level shows its narrator's head, small and still, at the end of its row; a work without one shows no head. Generated from `content/modules.json` |
| Work | label sheet on the module page | The work's museum label: artist, title, date, where (wing, floor, room), display status with the date checked, and "View at the Louvre →". A work with a level opens its level |
| Lesson, challenge, about | | A level or round opened from a module (`?from=09`) returns to that module |

- A tab bar with **Cover, Map, Contents** reaches any module in two taps. Back always returns to where the module was opened from.
- Cover copy, exactly: "The Louvre is home to treasures from across the world and across thousands of years. Meet 100 of its masterpieces, and the stories behind them, before you go."
- Page numbers: module number plus room number ("Chapter 09, room 711"). Room numbers are the Louvre's own, so they stay stable when works are added; positions like "4 of 9" are computed, never stored.
- A missing page shows the static export's `404.html` (`app/not-found.tsx`, served by GitHub Pages under the base path) in the doodle chrome, with the same fonts and colours: one line saying the page isn't here, and links back to the cover and Contents.

### The map

- **Behaviour:** the three wings, Denon, Sully and Richelieu, are tappable buttons; the Cour Carrée, the Pyramid, rue de Rivoli and the Seine are drawn only to orient. Tapping a wing zooms the map to it, fades the other wings and shows its floors, top floor first, like a cross-section of the building. Picking a floor lists its modules; picking a module opens it.
- **Honest:** labelled "Schematic, not to scale". It draws no rooms, no routes, no walking times and no artworks, so it can never send anyone the wrong way. It is for finding modules before the trip, not for guiding on site.
- **Visual style:** Map A from the prototype: an illustrated bird's-eye doodle of the palace seen from above the Seine, with slate roofs, warm stone, crayon greens and a blue Seine, hand-lettered banners for the three wings, and labels as HTML laid over the drawing so the zoom never re-lays out text. The drawing lives in one swappable component (`src/doodles/map.ts`), like the other doodles, so a person's illustration drops in without code changes, and it follows the three-layer rule in "03 · DESIGN".
- **A list for every map:** the contents page and the wing's floor list hold everything the map does; the map is never the only way in. Each wing is a real button with a spoken name built from the data, like "Denon wing: 6 chapters, 29 works on view, floors −1 to 1", reachable by keyboard, with tap targets of at least 48 px.

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
- **Placement calls:** room 348's three statues stay together in Rome (05); Canova's Psyche sits in 07 with Michelangelo's room 403; Caravaggio's Death of the Virgin sits in 09 because it hangs in room 712; the two Byzantine ivories of room 501 sit in 06.

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

- The last four are **not on view**: the work keeps its place in its module, is listed last, its row shows the reason in plain words (`rowNote`) in one small line under its chip when it says more than the chip (e.g. La Belle Ferronnière: on loan to the National Art Center, Tokyo, 9 Sep – 13 Dec 2026), and its label gives the reason (the record's own words, `displayNote`) and the date checked. Off-view works are written last.
- Every status carries the date it was checked. Never red: these are facts, not errors. State is never colour alone: each chip has a word and a mark.
- No fake levels and no drawn stand-ins: a work gets its photo only when its level ships, after a rights check.
- Room data is soft: the Louvre's own records warn room data may be out of date. Every work's record is rechecked before its level ships, and the content check warns about a work checked more than 90 days ago.
- **Record recheck tool:** `npm run recheck-records` fetches every work's collections.louvre.fr record as JSON (`<record url>.json`, one request per second, a User-Agent naming this repo) and prints a Markdown report, also saved under `scratch/` (not committed): per work, ours against the record for room, display status (the record has no on-display field, so it is read from `currentLocation`, `room` and `longTermLoanTo`), inventory number, date, and for works with a level the dimensions and image credit, plus the record's last-modified date against `checkedOn`, with a count of mismatches. Works with no Louvre record are skipped and listed. It is read-only: a person reads the report and edits `content/` by hand. Metadata is the Musée du Louvre's, under the Etalab Open Licence; the report says so and gives the records' update dates.

### Progress, "Next up" and seals

- **Modules are free to open,** none is locked: people prepare for the wing they will visit. Inside a module, the first work in module order that has a level and isn't met yet is marked **"Next up"**. Any ready level in a module can be played.
- **Module progress:** "2 met · 1 ready · 6 coming soon · 2 not on view", plus one dot per work. A module earns a gold seal when every ready level in it and each one's close-up round are done; a new level later adds a dot, and the seal waits for it. A module with no ready level has no seal to earn. (The seal is not built yet; see "Build steps".)
- **Museum progress:** the sticker book on the cover shows all 100 works with honest counts, e.g. "2 met · 1 in progress · 2 ready · 73 coming soon · 22 not on view"; it never pretends unwritten works are playable.
- **The "Start here" trail** keeps the five trail levels in their route order, with the Close-Up Challenge. Levels added later never join the trail: they live in their chapters, and their level-cleared page points to the chapter's "Next up" (its first level not met yet) instead of unlocking one; when every level in the chapter is met, it says so and offers the next chapter with a level to play. A trail level opened from a chapter (`?from=09`) gets the same chapter cleared page, with links that keep `?from`; opened from the trail or the cover, it unlocks the next trail level. The trail's 12-minute cap covers its five rounds only. The same level can also be opened from its module at any time; it is the same level with the same progress key, so finishing it in either place counts in both.
- **Storage:** no new progress key. Work and module states are derived from the existing `progress:v1` and `place:v1` keys and the challenge progress; progress keys are lesson ids, which don't change, so existing players keep every tick. The cover's "Continue" button reads the most recently played level from the order of `place:v1` (a saved place moves to the end each time it is saved). The `louvre-before-you-go:moments:v1` key holds the one-shot moments (`justCompleted`, `challengeUnlockSeen`, `leslyMet`); it gains `sealSeen` (modules whose seal has played) when the seal is built.

### Close-ups per work

Each work keeps one close-up round, in the format above. In a module, **a work's round opens as soon as that work's level is done**, not behind a gate for the whole module (a growing module would re-lock). The module page lists its rounds in module order. The "all five levels" gate applies only on the "Start here" trail. A round opened from a chapter (`?from=09`) returns there when it is left or finished; its cleared page shows no "next close-up", which belongs to the trail. The challenge file's `unlock` stays `"all-base-levels"`: it names the trail gate, and the chapter page applies the per-work rule.

### Motion and accessibility

- Motion follows "Motion": the map's ink lines draw themselves once per browser session (about 1.3 s, tappable from the first frame; later visits in the same session show it drawn), the map zooms to a tapped wing while the other wings fade, floors and rows rise in, the work's label sheet slides up. CSS `transform`, `opacity` and stroke drawing only; at most one loop per screen, except on the map (below); nothing waits for motion; artwork photos never move, scale or pan. Reduced motion follows the device setting.
- **Approved exception, the map only** (product owner, 14 Oct 2026: "keep everything; the mission is that the content stands out clearly"): Map A keeps all of its idle loops, the water shimmer, a passing boat, a few walking visitors, a glint on the Pyramid and the floating pin, so the map screen has more than one loop. They are small, pause while a wing is zoomed, and stop entirely under reduced motion, where the zoom is also instant. The chosen wing lifts only after the zoom has landed, so the two never move in the same frame. Every other screen keeps the one-loop rule.
- Real buttons, tap targets of at least 48 px (module and work rows 64 px or more, the whole row is the button), a visible ultramarine focus ring; rooms are headings; the label sheet is a dialog that takes focus and closes with Escape; the sticker book is one button with a spoken summary; French room names carry `lang="fr"`. "Met" chips use ink on gold, since white on gold is too faint.

### Build steps

Small PRs, each run and checked at phone width (390 and 320 px) before committing.

| Step | What | State |
|---|---|---|
| 0 | This spec, the "Boundaries" edit, the scope line in AGENTS.md and CLAUDE.md | Done |
| 1 | `content/modules.json` generated from `catalogue/modules.csv`, its types, and the content-check rules in "Catalogue file" | Done |
| 2 | Contents and module pages: status chips, placeholder tiles, the museum label sheet, "View at the Louvre" | Done |
| 3 | Cover as home: the route moves to `/start/`; the tab bar; the sticker book; a finished level returns to its module | Done |
| 4 | The map: one swappable map drawing, the wing pages and their floors; the Map tab and the cover's "Open the map" | Done |
| 5 | Motion for the new screens, with reduced motion | Done, except the seal stamp (no seal yet). The map's draw-once is remembered in memory for the browser session, not in `moments:v1` |
| 6 | Close-ups per work in modules; the trail keeps its all-five gate | Done |
| 7 | Recheck routine: `npm run recheck-records` and the 90-day warning; a person rechecks the records before a release | Done |
| 8 | Content in batches. Each work: record recheck, rights-checked photo, level, close-up round | In progress: 28 of 100 |
| — | Module gold seal, its one-shot stamp and `sealSeen` | Not built |

### Not in 0.6

- **A visit planner** waits: a "1-hour route" would promise walking times and open rooms we can't verify. Now that more than 20 levels exist, a "My visit list" sorted by wing, floor and room, with "check on the day", is the honest version; it needs the product owner's go.
- No turn-by-turn routes, no live open-room data, no in-app reduce-motion switch.

---

## 02 · CONTENT — content rules and data format

> All content is written in advance and checked by a person; the website only presents it.
> No AI is called at runtime.

### How to write

- Content is written in English.
- Talk like a friend telling you a story in front of the artwork: "you", short sentences, spoken style. A main-line passage is at most 45 words, a branch at most 40, a question at most 15.
- One level, one through-line. Each level follows one question about the work, and goes deep on it rather than listing facts.
- **Depth standard.** Conversational doesn't mean shallow. "Observe and describe" is the starting point, never the whole level. Across its questions, every level must cover, in plain spoken language:
  1. Context: the historical and political moment, and who commissioned, paid for or bought the work (or that nobody knows).
  2. Form, explained as why it matters: composition, space, light, colour, line, scale, viewpoint. Not "there is a triangle" but what the triangle does to you.
  3. Technique and materials: how it was physically made, and what that tells us.
  4. Iconography and sources: what the symbols mean and which earlier works or models it borrows from.
  5. Reception and afterlife: how it was received, displayed, restored, and how scholars' readings have changed.
  6. Real debates and open questions, presented as debates: name the positions (and a scholar or institution where possible), say what evidence each side has, and say what is still unknown.
  Shallow vs deep, for example: "Her hips tilt" (shallow) vs "Her weight sits on one leg so hips and shoulders tilt against each other: contrapposto, a Classical invention that makes stone look ready to step forward; her sculptor winds it into a spiral" (deep). The playbook has more examples and a depth check in its QA checklist.
- The first time a technical term appears, explain it in one plain sentence.

### Facts and sources

- **Two independent sources for every fact** a player sees: in a story line, a question, an option, a branch, a correction card, a takeaway, a voice line or a close-up. Two pages of one institution, or two texts repeating one author, are one source. All Louvre outlets count as one source group: the collection record, louvre.fr, Louvre publications and exhibitions the Louvre organises or co-organises.
- Only sources that were opened and read count, with the supporting passage logged in the work's research ledger. Wikipedia, blogs, tourist sites and AI output are leads, never sources.
- Anything that can't be sourced is written "TBD", never invented. Every fact is traceable to a source listed in the level's `sources`.
- **Contested points are taught only as "scholars disagree"**: name the positions and their evidence. They are never turned into right/wrong questions unless the evidence clearly favours one answer; otherwise the right answer is "nobody knows for sure" (or "scholars disagree") and the branches explain the positions. "Nobody can tell" is an option only where a source shows what evidence exists.
- Questions never ask about a value the sources disagree on (for example a statue's height when sources give different figures).

### Questions and options

- Each question's options play roles: the right answer, a near miss (a real neighbouring idea, e.g. chiaroscuro next to sfumato) and, where useful, a common myth. No filler or joke options.
- The right answer is not always in the same position: across a level, it moves.
- Nothing before the answer gives it away: story lines, narrator lines, crop alt text and close-up titles never contain or point to the answer of the question that follows.
- A wrong-answer branch first credits the instinct, then says plainly that it isn't right, and carries a `correction`: why the idea is tempting, what is actually true, and the evidence that settles it.
- After the branches, every path rejoins the same main-line passage (the merge line). Anything everyone must remember goes there, so every player sees it whatever they picked.

### Narrators and voices

- **Who narrates.** A known artist with a documented likeness narrates his own works, even when none of his words passes the quote rule. Today: Leonardo (Mona Lisa, The Virgin of the Rocks, Saint Anne, La Belle Ferronnière), Delacroix (Liberty, Sardanapalus), Géricault (the Raft), Veronese (the Wedding Feast at Cana, his quotes from his 1573 Inquisition testimony), Ingres (La Grande Odalisque), Jacques-Louis David (the Coronation, the Horatii, the Sabine Women), Caravaggio (the Death of the Virgin) and Titian (Woman with a Mirror). Another documented figure can narrate (speaker kind `person`): Baldassare Castiglione narrates his own portrait. **Lesly**, the museum guide, narrates every work whose maker is unknown, whose attribution is contested, or whose maker left no documented likeness: all the Greek, Cycladic, Etruscan, Roman and Persian works so far, the Pastoral Concert (Titian, long attributed to Giorgione) and the Borghese Gladiator (signed by Agasias of Ephesus, of whom no likeness exists). The artwork itself never speaks.
- **Lesly** (speaker kind `guide`, avatar `guide`) is our own character: a young museum guide, a tuxedo cat dressed after Vermeer's Girl with a Pearl Earring, "a student at UVA". She talks about the work in the third person, limited to its documented history and the level's sourced facts; her lines are mostly looking prompts.
- **Voice lines** (optional, a few per level): a short line in a speaker's speech bubble, at most 25 words for an imagined line and 30 for a quote. Each voice matches the speaker's documented personality and never steps outside the sourced facts of the level. An artist only speaks about what he could have known in his lifetime (Leonardo can't comment on the 1911 theft). Wrong-answer branches can be voiced by another fitting person with a documented link to the work.
- **Imagined lines.** An artist's imagined line copies only his voice and tone: the first person, a confident maker talking to a visitor. Every fact in it meets the two-source rule and is one the level or its research ledger already sources; it puts no invented intention, opinion or feeling in his mouth on a contested point, and says nothing he could not have known. It carries the visible tag "Imagined voice · not his own words" (the same tag for every artist and person), has no quotation marks, and is never presented as a real quote. Lesly's lines carry "Imagined voice, built from sourced facts". The tag's pronoun follows the speaker: a woman speaker other than Lesly needs "not her own words" (none yet; it needs a small code change). `npm run check-content` fails an imagined line that contains quotation marks.
- **Real quotes.** Never invent things an artist said. A quote is used only when it is documented word for word in a published English translation, with an independent printing in the original language, at most 30 words, and its source cited on screen (`cite`) and in the level's `sources`.
- The voices are scripted and checked in advance; there is no live AI conversation.

### Content sample

The method for writing a level is in the [Branching Story Playbook](https://claude.ai/code/artifact/ff9f143f-3ac4-458a-8037-1c68ebbee5a8): how a level plays, writing rules, the production workflow and QA checklist, a script template, and the five trail levels. The [revised playbook with artist voices](https://claude.ai/artifact/HmaiNoKUVeHwC2YBZ8AZox) adds scripted artist voices, persona cards, the depth standard with shallow-vs-deep examples, the wrong-answer correction rules and a depth check in the QA checklist. Where the playbook and this spec differ, this spec wins.

### Data format

One JSON file per artwork in `content/`, numbered in the order the levels were built (`01-mona-lisa.json` … `28-capital-from-the-apadana.json`). A level is a set of nodes; each node is one passage or one question, linked by `next`. Below is the opening of the Mona Lisa level, which is also the model for tone:

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

Optional fields (a file without them still works, and the app must not require them):

| Where | Field | What it holds |
|---|---|---|
| `artwork` | `medium`, `dimensions`, `museumUrl` | The museum label next to the photo: medium, size as the Louvre records it, and the work's page on collections.louvre.fr ("View at the Louvre →") |
| top level | `speakers` | Who can speak in this file, by id: `name` (shown under the head), `kind` (`artist`, `person` for another documented figure, or `guide` for Lesly), `avatar` (id of the hand-drawn SVG: a painted head, or a doodled object for living artists; the ids are listed in `src/lib/avatar-ids.ts`, and the content check fails a speaker whose avatar has no drawing) |
| `lessons[]` | `narrator` | Speaker id of the level's main narrator, shown on the trail, the chapter row and the level page. Missing means no head |
| `branch` node | `correction` | For wrong-answer branches: `tempting` (why the idea is tempting, at most 30 words), `truth` (what is actually true, at most 35), `evidence` (the detail in the work or the documented fact that settles it, at most 35), optional `kind` (`near-miss` or `myth`, which sets the default heading "Close, but not quite" or "Not quite: a popular idea, but wrong") and optional `verdict` (a custom heading, at most 6 words). Shown as an ink-lined paper card under the branch text, with handwriting labels "Why it's tempting", "What's actually true", "How we know"; never red. The content check warns when a wrong choice (in a question that has a right answer) leads to a branch without one |
| `story` / `branch` node | `voice` | One line in a speech bubble beside the speaker's head: `speaker` (an id from `speakers`), `text` (at most 25 words; a quote at most 30), `kind` (`imagined` or `quote`). A `quote` also needs `cite` (short attribution shown under the bubble, e.g. "Letter to his brother, 28 Oct 1830") and `source` (URL, also listed in the level's `sources`) |

The node's `text` stays the friendly narration shown in print; `voice.text` is the speaker's own line, shown in handwriting in the bubble. An `imagined` voice always shows its tag under the speaker's name (see "Narrators and voices"); a `quote` shows quotation marks and its `cite`. Nodes without `voice` show the narrator's head with no bubble. In 1.0, `story` and `branch` nodes gain an `audio` field pointing to that passage's audio. This structure maps one-to-one onto the 1.0 database tables, so upgrading is an import, not a rewrite.

Every level and close-up file also has an entry in `content/README.md`: what was built, from which research, and the checks run.

### Challenge files

One file per artwork in `content/challenge/`, named like the level files (`01-mona-lisa.json`). It uses the same lesson and node format as a level, with these differences:

| Where | Field | What it holds |
|---|---|---|
| top level | `artworkId` | The level file's `artwork.id`; title, museum label, credit and speakers come from that file |
| top level | `zoomImage` | The reference image: `file` (Commons file name), `commons` (its file page), `width` and `height` in pixels, `licence`, `credit`, and `overview` (path of the "see where" image under `public/`) |
| `lessons[]` | `kind`, `unlock` | `"challenge"` and `"all-base-levels"` |
| `lessons[]` | `roundSize` | Questions per play, 1 to 4 |
| `lessons[]` | `pool` | Ordered intro-node ids of the questions in the rotation. Replaces `start` |
| `lessons[]` | `held` | `[{ "start", "why" }]`: sourced questions kept out of the rotation, with the reason |
| `lessons[]` | (no `takeaway`) | The cleared page shows the round's merge lines instead |
| `story` / `question` node | `zoom` | `{ x, y, w, h, label, image }`: the normalized box, a description that doubles as alt text, and the crop's path under `public/`. The same on a question's intro and question node |
| `question` node | `sources` | `[{ "title", "url" }]`: the question's sources as players see them under the merge line |
| `choices[]` | `role` | `"right"`, `"near-miss"`, or `"myth"` for an approved exception |
| merge node | (no `next`) | The player goes on to the round's next question, or the cleared page |
| top level | `review` | Per question node id (`c1q`, …): `extends` (`nodes` in the level file, `concept`), `framing`, `what_you_learn`, `regionSources` and `choiceSources` (title, URL, the exact quoted passage, a translation marked "our translation" if not English, what it supports; `choiceSources` keyed by wrong-branch id), `confidence`, `notes`, `quoteCheck` and `cropCheck` (when and how quotes and crop were checked), and `exception` where an approved exception (a `myth` option) applies. Ignored by the app: it is the audit trail |

Node ids per question: `cN` intro, `cNq` question, `cNa`/`cNb`/`cNc` branches in option order, `cNm` merge. `npm run check-content` also checks challenge files: 3 options with one `right` and two wrong (`near-miss`, or `myth` where approved); a `correction` and a `choiceSources` entry for every wrong option; at least one `regionSources` quote; a `zoom` inside 0–1 on intro and question, the same on both, and its crop file in `public/`; every branch leads to the question's merge line; the word caps; `roundSize` from 1 to 4 and a pool at least that long; every play the rotation can show timed (a warning over 144 s), with the work's level plus its heaviest play within 10 minutes; and every node named in `review.extends` exists in the level file.

### Catalogue file

One file, `content/modules.json`, holds the catalogue: the wings, the 15 modules, the appendix, and for every work its place, display status and the date checked. Level files don't change: a work is linked to its level by `levelId`, and the level file's `artwork.id` equals the work's `id`. It was generated once from `catalogue/modules.csv` (verified rows only; display notes from `catalogue/top-100.csv`) and is now edited by hand. A shortened example:

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
          "displayNote": "Record: current location \"non exposé\".",
          "rowNote": "On loan to the National Art Center, Tokyo, 9 Sep – 13 Dec 2026.",
          "checkedOn": "2026-10-13",
          "museumUrl": "https://collections.louvre.fr/en/ark:/53355/cl010062372",
          "levelId": "la-belle-ferronniere-1"
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
| work | `rowNote` | Optional, only for a work not on view: the reason in plain player-facing words, shown on the chapter row under the chip. Left out when it would only repeat the chip ("Not on display", "On loan"); every fact in it is sourced like any other |
| work | `checkedOn` | The date the record was checked, `YYYY-MM-DD` |
| work | `museumUrl` | The collections.louvre.fr record, or `null` for a work with no Louvre record (the Gallery of Five Continents works carry Musée du quai Branly inventory numbers) |
| work | `levelId` | Optional: the lesson id of the work's level (`"mona-lisa-1"`). Missing means "Coming soon" |
| work | `note` | Optional editorial note on the placement, for people; not shown to players |

Label format, the same in level files (`artwork.artist`, `artwork.year`) and the catalogue (`artist`, `date`): years as BC and AD, never BCE or CE; circa as "c. " with a space; a maker who is unknown is named by the culture the record gives ("Greek, Hellenistic period"), never "Unknown" or "Anonymous". Only the formatting is fixed; the values stay the record's.

`npm run check-content` also checks the catalogue: every work in exactly one module or the appendix (ids unique); every label field present (`medium` may be "TBD"), and `titleFr`, when given, different from `title`; every `levelId` names an existing lesson whose `artwork.id` equals the work's `id`, and every level file's artwork is in the catalogue; module ids `01`–`15` in order, each once; `location` well formed (a known wing, a floor that wing lists, a room of digits or `null` with a `place`; `null` only for off-view works); works in module order (on view by room number, then on view without a room number, then not on view); `display` from the list, with `displayNote` when not `on-display`; `rowNote`, when given, is text and only on a work not on view; `checkedOn` a real date, with a warning when it is more than 90 days old.

---

## 02 · CONTENT PIPELINE — how a work becomes a level

New levels arrive in research batches, in the order the product owner picks from `catalogue/top-100.csv` (finish a chapter, keep the route compact, mix materials and periods). The research and planning files live in the shared project folder, outside this repo; the repo receives only the finished level, close-up, photo and catalogue entry.

1. **Research in.** For each work the product owner sends a research file written to the research brief (`research/brief/RESEARCH_BRIEF.pdf`): bilingual memos, a source list and a claims ledger.
2. **Review.** Every claim is checked against two independent sources that were actually opened (the Louvre record first, via its ark URL plus `.json`); errors are fixed, what can't be verified becomes "TBD", and each work gets a change log (`research/works/<slug>/REVIEW.md`) and a checked ledger (`ledger.json`).
3. **Batch PDF.** The batch is compiled into one bilingual PDF with every edit highlighted, for the product owner to read (`research/batches/batch-NN/`).
4. **Question plan.** `content-plans/<slug>/QUESTIONS.md`: the label, the narrator, every screen with its ledger claim ids, what is kept out and why. It follows "Facts and sources" and "Questions and options"; it does not wait for approval.
5. **Narrator.** A known maker with a documented likeness gets a painted head (traits sourced in `content-plans/artist-voices/<NAME>_HEAD.md`); otherwise Lesly narrates.
6. **Photos first.** All the batch's photos are fetched and rights-checked before any level is built (`images/<slug>/` with `credit.json`, and a row in `images/INDEX.md`): public domain or CC0, never credited to the Louvre or the RMN.
7. **Build.** One pull request per work, stacked in order when they touch the same files: the level file, the challenge file and its crops, the photo, the work's `levelId`, a `content/README.md` entry. Each passes `npm run check-content`, `tsc --noEmit` and the build, and is played through at 390 and 320 px before it is opened.
8. **Merge and verify.** The product owner merges in order; the deploy runs; each new level is played on the live site and the research progress tracker is ticked.

---

## 03 · DESIGN — doodles and painted heads on a beige page, real art in the frames

Fresh, light and playful, like a child's sketchbook left open in a museum. Two references work together:

- **Doodles and handwriting** (the hand-drawn museum videos and HeyTea posters Steven shared): the interface is drawn with one black ink line, a little crayon colour and childlike handwriting.
- **After Hours** (a MoMA artists project by @llleahb, from the screen recording Steven shared): flat painted artist heads, a warm page, one ultramarine accent, and the real artwork photo beside a museum-style label.

They don't compete because each has its own job: **ink doodles and handwriting are the chrome, painted heads are the characters, photos and labels are the museum.** The artworks stay exactly as they are: always the official photograph, never drawn.

**Three layers, never mixed:**

- **Doodle layer (the chrome):** buttons, the level route, icons, small stickers, headlines, speech bubbles and frames. One black ink line, one stroke weight, slightly wobbly, plus a little crayon colour. Text that is "spoken" (headlines, questions, options, buttons, speech bubbles) is in handwriting.
- **Character layer (the narrators):** each speaker is a flat painted head: blocks of colour with no outlines, playful colours (a pink face, an orange nose), features as a few small dark marks. A head sits inside a hand-drawn ink circle on the beige "stage" under the artwork and talks in a hand-drawn ink speech bubble. This is where ink meets paint: the line belongs to the frame and the bubble, never to the head. Leonardo's head is the benchmark, and every head matches it and the After Hours manner (never its drawings): head only, little or no neck (no ID-photo shoulders); slightly irregular hand-painted shapes, not perfect circles; skin in varied flat tones (pink, peach, ochre, orange); like a child's drawing (the HeyTea reference), each head has its own face shape, a slight tilt and uneven placement (no uniform baby-cute faces), and one or two of the person's documented traits exaggerated (skin, hair colour and style, beard, whiskers, freckles, a hat or a signature accessory) so that it is recognisable at a glance from its silhouette alone, even at 44 px (where the record is unsure, the head stays generic but distinct); features as thin dark brush marks (dot eyes, line brows, a small line mouth), simple ear blobs, and the nose one flat shape in a deeper tone of the skin or a warm terracotta (Leonardo keeps his orange one), never a random blue, green or purple. Heads are hand-typed SVG in `src/doodles/avatars.tsx`. Lesly, the museum guide: a black-and-white tuxedo cat dressed after Vermeer's Girl with a Pearl Earring, in the same flat style (our own drawing): an ultramarine headwrap with the pale-yellow cloth falling behind, ears poking out, big round amber eyes, a tiny pink nose and a pearl earring, the head turned a little; never a drawing of the artwork or an object standing in for it. Living artists (from later museums) get a doodled object instead of a face.
- **Artwork layer (the museum):** the public-domain photo of the work on a plain white mat, straight edges, no filters, nothing drawn over it. Beside or under it, a small museum-style label in print type with straight edges: artist, title, year, medium, size, and "View at the Louvre →" linking to the work's page on collections.louvre.fr. Zoom-ins are crops of the same original photo, never redrawn.

> **Don't:** draw, trace or "cute-ify" an artwork; let a doodle, head or bubble overlap an artwork or its label; outline the painted heads; copy After Hours' own drawings (ours are drawn for this project); use AI-generated illustrations (doodles and heads are drawn by a person); glossy gradients, stacked shadows, screens full of emoji.

Style mockup: https://claude.ai/artifact/4bXH7X41KuFCAuQ1L4D49x

### Colours

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

- Handwriting for voice: headlines, questions, answer options, buttons, route labels and speech bubbles use a childlike hand font (Gaegu, Google Fonts). Later it can be replaced by real children's handwriting, as HeyTea does.
- Print for reading: story and branch text, the museum label, the "imagined voice" tag and sources use a clean rounded sans-serif (Nunito, Google Fonts), so longer passages stay easy to read.
- Designed for a phone (checked at 390 and 320 px); on desktop, content is at most 640px wide, centred.
- Body text 17px, line height 1.7; buttons at least 48px tall for one-handed use.
- Buttons and answer options are hand-drawn ink pills with handwriting labels: the main action filled ultramarine with white text, others paper white with the ink line; the selected option gets an ultramarine line.
- The trail is a squiggly ink line; each level node is its narrator's painted head in an ink circle. Done gets a gold-brown tick, the current level an ultramarine ring and "Start" ("Continue" once it has been left mid-way), locked levels are faded.
- Artworks and their labels get no rounded corners and no filters. Doodle shapes, heads and bubbles may be wobbly and rounded; artworks never are.
- Doodles are simple SVG line drawings, hand-drawn, one stroke weight. Heads are flat SVG shapes drawn by a person, friendly rather than accurate portraits.

### Motion

From the approved plan (project files, `animation/PLAN.md`, and its demo) and the product owner's decisions on it. Built in plain CSS in `src/app/motion.css` (the map's own in `src/app/map.css`).

Motion copies the language of After Hours (heads that rise into place, a quiet idle float, the speaker lifting while it talks, a bubble that comes from the speaker), never its drawings and never its streamed text.

- **Only the doodle chrome and the narrator heads move.** The artwork photo, the close-up crops, the "see where" thumbnail and the museum label never move, scale, pan, re-render, change filter or get anything drawn over them.
- **Nothing waits for motion.** Text appears complete, the whole line at once (no typing effect, no "typing…" dots); buttons work from the first frame; screen changes happen on tap. Added waiting time per level: 0 s.
- **Right and wrong are told by the narrator, never by red:** a small hop and three ink strokes for a right answer, a thoughtful head tilt for a wrong one (then the correction card rises as one block), and the progress segment fills gold either way. Questions with no right answer get no reaction.
- **Where it moves:** on a level or challenge screen, the narrator rises into place on the first screen of a visit (or when a new speaker takes over), floats 2 px while you read, and lifts and chatters while its bubble is new, its mouth opening and closing; on a question screen the question is the narrator's spoken line, so the narrator talks the same way while the question is new (no bubble, no extra words); options rise in quickly one after another. Close-up rounds use exactly the same head motion; the crops stay as still as the photos. On the level-cleared page the narrator hops once above the stars, which pop in, and the underline draws itself. On the trail, the level just finished gets its tick and the route to the next level draws itself once; only the current level's head floats; a tapped locked level wiggles its padlock. On the first visit after all five trail levels, the Close-Up Challenge unlocks once: the magnifier turns ultramarine, the padlock opens and the line reads "Close-ups unlocked."; on later visits that line is gone.
- **Small and calm:** 2 px idle float, moves of at most 7 px, 150–700 ms one-shots; at most one looping movement per screen (plus a blink; the map is the one approved exception); no confetti, shake or flashing.
- **Reduced motion:** the app follows the device's "reduce motion" setting (no in-app switch). Then nothing moves; things that appear fade in 150 ms at most, and drawn lines are shown already drawn. Everything reads and works the same.
- **Built with CSS** (`transform`, `opacity` and the stroke drawing of ink lines), no animation library. Heads animate through named layers (`head`, optional `eyes`, `mouth-closed`/`mouth-open`), so a hand-drawn head drops in without code changes. The layer contract is in `animation/PLAN.md` §4 in the project files: every head (the artists and the guide) comes with eyes and closed and open mouths, and the mouth swaps while the head talks; doodled objects (later living artists) need no eyes or mouth.
- **Saved progress is untouched.** The one-shot moments are remembered in one extra localStorage key, `louvre-before-you-go:moments:v1`; losing it only replays or skips a moment.

### Reference products

| Reference | Learn from | Don't copy |
|---|---|---|
| Duolingo | Level route, a little every day, small celebration on clearing a level | Saturated colours, a single mascot |
| After Hours (@llleahb, MoMA artists project) | Flat painted artist heads, warm quiet page, one blue accent, label card beside the real artwork, artists talking in bubbles | Their drawings themselves, and the live AI chat mode (we don't use AI at runtime; our artist voices are scripted and sourced in advance) |
| HeyTea posters | Childlike handwriting and loose doodles; fresh and relaxed | Drawing over the product itself (for us: the artwork) |
| Google Arts & Culture | Large artwork images, zooming into details | Pages that are too dense |
| Louvre collections site<br>`collections.louvre.fr` | Restrained layout, how artwork information and labels are written | Archive-style stacks of fields |

---

## 03 · TECH — technical plan

One rule for every choice: common, free, and maintainable later by someone who doesn't code. Code lives on GitHub, and pushing code deploys it: GitHub Pages until 1.0, then Vercel once there is login and a database.

| Layer | Choice | Now (0.5–0.6) | 1.0 |
|---|---|---|---|
| Front end | Next.js (App Router) + TypeScript + Tailwind CSS | Yes | Yes |
| Code repository | GitHub | Yes | Yes |
| Hosting and deploy | GitHub Pages → Vercel, both deploy on push | GitHub Pages | Vercel |
| Content | JSON files under `content/` | Yes | Imported into Supabase by script |
| Audio | After the text is final, generate mp3s offline with an English TTS tool, one voice throughout | No | Stored in Supabase Storage |
| Progress | Browser localStorage | Yes | Supabase after login; localStorage when not logged in |
| Database, login, file storage | Supabase | No | Yes |
| Artwork images | Public-domain or CC0 images from Wikimedia Commons | In `public/images/` | In Supabase Storage |
| Analytics | Vercel Analytics | No | Yes |
| Domain | The free default address first | `leslylou0457.github.io/louvre-before-you-go` | `xxx.vercel.app`, custom domain optional |

> **No database until 1.0; publish on GitHub Pages.** One less service is one less thing to break. The site is fully static: Next.js static export (`output: 'export'`, with `basePath` set to the repo name), and GitHub Actions (`.github/workflows/deploy.yml`) runs `npm run check-content`, builds and publishes on every push to `main`. There is no pull-request CI, so every PR is checked by hand before it is opened (`npm run check-content`, `npx tsc --noEmit`, `npm run build`). Use `npm run dev` to preview locally.

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

Every item can be ticked, no gut feeling. When all are ticked, the version is done. The product owner ticks them.

### 0.5 acceptance

- [ ] All 5 artworks, 5 levels and 25 questions live; every fact checked and sourced
- [ ] On a phone, each level finishes in about 5 minutes, and never more than 7; one work (level plus close-up round) within 10 minutes; the whole Close-Up Challenge (5 rounds) within 12 minutes
- [ ] Close the browser and reopen it: progress is still there
- [ ] Leave a level mid-way and reopen it: it continues from the same question
- [ ] 3 people who didn't help build it play it; at least 2 finish all 5 levels without prompting
- [ ] Published on GitHub Pages with a public link that opens on a phone, with page screenshots good enough to show
- [ ] Adding one new JSON file, without changing code, adds one more artwork

Status, 19 Oct 2026: everything except the playtest is built and live, and the content check passes the time budgets. The playtest (project files, `playtest/KIT.html`: three testers, a beginner, a casual visitor and an art fan) has not been run yet.

### 0.6 acceptance

- [ ] All 100 works in the catalogue appear, each in exactly one module or the appendix, and `npm run check-content` passes
- [ ] Every module opens from the contents page within two taps, and every module with works on view also from the map
- [ ] Every work not on view shows its reason and the date checked, and is listed last in its module
- [ ] A player with 0.5 progress keeps every tick and saved place
- [ ] The five trail levels play both from their modules and from the "Start here" trail
- [ ] On a phone every new page works without horizontal scrolling, and the map is never the only way in

Status, 19 Oct 2026: the framework is live and these items are built; still open from the 0.6 spec are the module seal and the content of build step 8 (28 of 100 works playable).

### 1.0 acceptance

- [ ] Each of the 5 trail artworks deepened to 5 levels, 25 levels live, all checked and voiced
- [ ] Deployed to Vercel with a public link
- [ ] Finishing an artwork's 5 levels unlocks its artwork card, and every info point on the card opens
- [ ] After login, progress carries over to another device
- [ ] Of 10 playtesters, at least half come back on their own and play on 3 or more days in the first week
- [ ] Monthly running cost is $0

> **The playtest item matters most: people come back on their own.**
> Duolingo works not because it has lots of content, but because you want to open it again tomorrow.

### Boundaries: none of these versions does these

One principle covers most boundaries: content is written in advance and checked by a person; the website only presents it.

| Not doing | Why |
|---|---|
| On-site guiding, identifying artworks from photos | The product is only for before the trip; general AI chat can already identify artworks from photos |
| Real-time AI-generated content or audio | Every use calls an API, which is costly, and the content can't be checked in advance |
| Talking with the artist (AI playing Leonardo) | Uses lots of tokens and easily invents things that never happened; to be tested separately later. Scripted artist voices, written and source-checked in advance, are fine (see "Narrators and voices") |
| 3D or virtual tours, turn-by-turn routes, live open-room data | The product is for before the trip. A schematic map for finding modules is in scope (see "The map"); on-site guiding is not |
| Museums other than the Louvre | Coming, but the Louvre is done thoroughly first |
| An in-depth academic edition | Target users are beginners, not scholars. Professional depth in plain language is in scope (see "Depth standard"); footnotes, jargon and exhaustive coverage are not |
| App, payments, comments and community | Not needed now |

> **Image rights:** use only public-domain or CC0 images of artworks (for a sculpture the photographer's own licence counts, so it must be CC0 or public domain), and credit the source on the "About and sources" page. No AI-generated "copies" of artworks.

---

## 04 · NEXT — 0.6 content, then 1.0

**Now (0.6, build step 8):** keep adding works in batches through the content pipeline until all 100 works in the catalogue have a level and a close-up round. Next in line: Diana of Versailles (the last work on view in Chapter 05) and the Mesha Stele (Chapter 02), or the Seated Scribe as the first Egyptian work. Then the last 0.6 items: the module seal, and the 0.5 playtest.

**1.0** only changes content and adds features. The plan below was written for the five trail artworks before the museum framework existed; how far it applies to the other works is an open question for the product owner.

| | Now (0.6) | 1.0 | Later |
|---|---|---|---|
| Museums | The Louvre | The Louvre | Add as needed, e.g. the Uffizi, the Musée d'Orsay |
| Artworks | 100 in the book, 28 playable, growing | The trail's 5, each deeper; the book keeps growing | More museums |
| Levels | 1 per playable work | 5 per trail artwork, 25 in all | — |
| Entry point | Cover, contents, map, chapters, the "Start here" trail | The same, with the trail in sections by artwork, 5 levels each | Choose a museum, set a departure date, countdown route |
| Hosting | GitHub Pages, public link | Move to Vercel (for login and database) | Custom domain |
| Audio | None, text only | Main line and branches read aloud, auto-play, with pause, replay and mute; questions and options not read | — |
| Artwork card | None | Unlocked after an artwork's 5 levels: large image + 2–3 tappable info points | — |
| Animation and effects | Narrator heads and doodle chrome, restrained (see "Motion") | Lip-sync to audio, artwork cards | — |
| Progress | Saved in the browser | Optional email login, progress across devices; daily streak | Daily reminders |
| Database | Not needed | Supabase | Supabase |

### 1.0 goes deeper: each trail artwork grows from 1 level to 5

Five levels are five angles on the same work. Mona Lisa as an example (sample only; the product owner's final version decides):

| | Angle | A sample question |
|---|---|---|
| 1 | Look first | Where did your eye land first? |
| 2 | Is she smiling? | Do you think she's smiling? Why can't you be sure? |
| 3 | The man who painted her | Why did Leonardo dissect human bodies? |
| 4 | The woman in the picture | Who do you think she is? |
| 5 | The painting's fate | It was stolen in 1911. Guess who took it? |

### Open questions: the default in brackets is what ships until the product owner decides

- What is the official name? (For now: Louvre Before You Go; an umbrella name when other museums are added)
- How far does the 1.0 "five levels per work" plan reach beyond the five trail works? (Default: the trail works only, as written)
- Mona Lisa's date: the level label says "c. 1503–1519", the catalogue keeps the record's "1503–1519". (Default: both as they are)
- "BCE" still appears inside some Venus de Milo and Winged Victory story and option text, while labels use BC. (Default: unchanged until decided)
- Narrator for works with a known maker but no likeness or a contested attribution: the Borghese Gladiator (Agasias) and the Pastoral Concert. (Default: Lesly)
- La Belle Ferronnière: kept as `not-on-display` with the Tokyo loan in its `rowNote`, rather than `on-loan`. (Default: as is)
- Label wording for the batch 3 and 4 works, e.g. "Cycladic, Early Bronze Age" (Head from Keros) and "Achaemenid Persian, Susa" (Frieze of Archers, Capital from the Apadana). (Default: as shipped)
- Sleeping Hermaphroditus, question 1 names in plain words what the statue's far side shows. (Default: kept)
- Level photos from the later batches are 1920 px renderings because Wikimedia refused larger files. (Default: re-fetch larger ones later)
- Which voice for 1.0 audio? (Default: a warm English female voice; generate the first level as a test before deciding)
- Is login required in 1.0? (Default: no; login only syncs progress)

---

## Decision log

The decisions behind this spec, newest first. The details live in the sections named.

| Date | Decision |
|---|---|
| 2026-10-19 | `rowNote`: a plain-words reason on the chapter row for works not on view ("Status"). This spec rewritten to describe the live product |
| 2026-10-18 | Lesly's one-time introduction line ("Pages and interaction"); the standard batch pipeline for the 100 works ("Content pipeline") |
| 2026-10-17 | More artists' voices, not only Lesly; one tag for every imagined line ("Narrators and voices"). Floors are "Floor", never "Level". Navigation fixes: chapter cleared pages, `?from`, the cover's "Continue" |
| 2026-10-15 | Painted-head standard with Leonardo as benchmark; Lesly replaces the marble block; the cover's Louvre drawing ("03 · DESIGN"). Flexible question counts, with the time budgets as the only cap ("Rules for one level") |
| 2026-10-14 | Map A with its idle loops as the one motion exception; close-ups per work in chapters; the trail stays the five 0.5 levels ("0.6 · Museum framework") |
| 2026-10-13 | Version 0.6, the museum framework: free chapters with "Next up", per-work close-ups, off-view works stay listed last. Restrained motion in the After Hours manner ("Motion") |
| 2026-10-09 | Depth standard and correction cards ("How to write"); the Close-Up Challenge; doodle chrome with painted heads, Gaegu and Nunito; CC0 sculpture photos (Venus de Milo by Shonagon, Winged Victory by Wilfredor) |
| 2026-10-07 | The five trail artworks; the product, its content and this spec are in English |

---

You build it yourself; we help you get there.
