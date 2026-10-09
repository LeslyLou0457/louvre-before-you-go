# Louvre Before You Go · Product Spec

> Product spec · first edition · ready to hand to an AI
> Taopai Studio · October 2026 · taopai-studio.pages.dev
>
> Transcribed to Markdown from the product owner's PDF (PRODUCT BRIEF · v0.5).
> Revised 2026-10-07 at the product owner's request: the five artworks now match the story playbook, which is the content sample (see "Five levels, five artworks" and "Content sample"); the product, its content and this spec are in English.

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

How it differs from what exists: a full video lecture is too long and your mind wanders; an encyclopedia is too dry and nothing sticks. Here, knowledge is cut into 5-minute stories, and questions pull you back in. Storytelling comes first; technique and analysis only when they're worth it.

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
| 1 | Mona Lisa | Leonardo da Vinci | How sfumato and chiaroscuro make a face seem to think | You can't find the edge of the shadow at her mouth. What is that trick called? |
| 2 | Venus de Milo | Unknown | Contrapposto, and the action she has lost | Are the lines across her shoulders and hips parallel? |
| 3 | Winged Victory of Samothrace | Unknown | Look down first: the ship under her feet | No wind was carved. So how do you know it's blowing? |
| 4 | Liberty Leading the People | Eugène Delacroix | Who is the woman with the flag? | Is she a real woman who fought that day? |
| 5 | The Raft of the Medusa | Théodore Géricault | A real shipwreck, and the moment the painter chose | You're Géricault. Which moment do you paint? |

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

1. The main line tells a short story (2–4 sentences).
2. A question appears, with 2–3 options.
3. The choice leads to a short branch (1–3 sentences), then back to the main line.
4. Repeat 5 times, clear the level, unlock the next.

### Three details

- **A wrong answer never blocks you.** A wrong pick also opens a branch, which gives the right answer and one sentence of why. A wrong answer is another chance to tell a story.
- **Some questions have no right answer.** For example, "Where did your eye land first?": each option leads to a different branch.
- **A level takes under 5 minutes.** One screen shows one passage or one question; tap to move on.

> **Audio waits for 1.0:** 0.5 is text only; get the story and pacing right first. Write it the way people speak, so the 1.0 voice-over needs no rewrite.

### 0.5 pages and interaction: just 4 pages, open and play, no sign-up

| Page | What it does |
|---|---|
| Level route (home) | A vertical route of 5 level nodes in three states: done, current, locked; the current level has a "Continue" button |
| Lesson page | Top half: the artwork (tap to zoom). Bottom half: one passage or one question. Progress bar at the top ("Question 3 of 5") and an exit button |
| Level cleared page | "One thing to remember today": a one-sentence summary of the level; unlock the next level, back to the route |
| About and sources | Image sources and references |

- Tapping a locked level shows a light hint, "Finish the previous level first", not a pop-up.
- Leaving mid-level restarts that level next time (it's 5 minutes; no need to remember the question number). Finished levels can be replayed.
- Restrained motion: a soft fade between screens, a small celebration when a level is cleared, no full-screen confetti. No character animation in 0.5.

---

## 02 · CONTENT — content rules and data format

> All content is written in advance and checked by a person; the website only presents it.
> No AI is called at runtime.

### How to write

- 0.5 content is written in English.
- Talk like a friend telling you a story in front of the artwork: "you", short sentences, spoken style. A main-line passage is at most 45 words, a branch at most 40, a question at most 15.
- One level, one thing. Explain one detail well rather than listing five facts.
- The first time a technical term appears, explain it in one plain sentence.
- Every fact must be traceable to a source, listed in the level's `sources`. For disputed claims, write "one theory is".
- Never invent things an artist said. Every quote needs a source.
- Artist voices (optional, a few per level): a short line in a speaker's speech bubble, at most 25 words for an imagined line and 30 for a quote. Each voice must match the speaker's documented personality and must never step outside the sourced facts of the level. A line written for them is marked as an imagined voice; a real quote is used only when it is documented, word for word in a published translation, with its source cited. Anything that can't be sourced is written "TBD", never invented. An artist only speaks about what they could have known in their lifetime (Leonardo can't comment on the 1911 theft). Wrong-answer branches can be voiced by another fitting person with a documented link to the work. When the maker is unknown, the artwork itself speaks, limited to its documented history. The voices are scripted and checked in advance; there is no live AI conversation. Rules and personas: see the playbook.
- Each question's options play three roles: the right answer, a near miss (a real neighbouring idea, e.g. chiaroscuro next to sfumato) and a common myth. No filler or joke options. A wrong-answer branch first credits the instinct, then says what that idea really is.
- After the branches, every path rejoins the same main-line passage (the merge line). Anything everyone must remember goes there, so every player sees it whatever they picked.

### Content sample

The full scripts for all 5 artworks are in the [Branching Story Playbook](https://claude.ai/code/artifact/ff9f143f-3ac4-458a-8037-1c68ebbee5a8): how a level plays, writing rules, the production workflow and QA checklist, a script template, a batch-production prompt, and 5 levels with 25 questions. Write new content in its format and by its rules. The [revised playbook with artist voices](https://claude.ai/artifact/HmaiNoKUVeHwC2YBZ8AZox) (2026-10-09) merges scripted artist voices, persona cards and the optional voice fields into the same workflow, template, prompt and levels.

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

There are only three node types: `story` (main line), `question` and `branch`. An option can carry `"correct": true`; questions with no right answer leave it out.

Optional fields (added 2026-10-09; a file without them still works, and the app must not require them):

| Where | Field | What it holds |
|---|---|---|
| `artwork` | `medium`, `dimensions`, `museumUrl` | The museum label next to the photo: medium, size as the Louvre records it, and the work's page on collections.louvre.fr ("View at the Louvre →") |
| top level | `speakers` | Who can speak in this file, by id: `name` (shown under the head), `kind` (`artist`, `artwork` when a statue with no known maker speaks, or `person` for another documented figure), `avatar` (id of the hand-drawn SVG: a painted head, or a doodled object for artworks and living artists) |
| `lessons[]` | `narrator` | Speaker id of the level's main narrator, shown on the route and the level page. Missing means no head |
| `story` / `branch` node | `voice` | One line in a speech bubble beside the speaker's head: `speaker` (an id from `speakers`), `text` (at most 25 words; a quote at most 30), `kind` (`imagined` or `quote`). A `quote` also needs `cite` (short attribution shown under the bubble, e.g. "Letter to his brother, 28 Oct 1830") and `source` (URL, also listed in the level's `sources`) |

The node's `text` stays the friendly narration shown in print; `voice.text` is the speaker's own line, shown in handwriting in the bubble. An `imagined` voice always shows a small tag under the speaker's name, "Imagined voice, built from sourced facts"; a `quote` shows quotation marks and its `cite`. Nodes without `voice` show the narrator's head with no bubble. In 1.0, `story` and `branch` nodes gain an `audio` field pointing to that passage's audio. This structure maps one-to-one onto the 1.0 database tables, so upgrading is an import, not a rewrite.

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
- The level route is a squiggly ink line; each level node is its narrator's painted head in an ink circle. Done gets a gold-brown tick, the current level an ultramarine ring and "Continue", locked levels are faded.
- Artworks and their labels get no rounded corners and no filters. Doodle shapes, heads and bubbles may be wobbly and rounded; artworks never are.
- Doodles are simple SVG line drawings, hand-drawn, one stroke weight. Heads are flat SVG shapes drawn by a person, friendly rather than accurate portraits.
- No animation in 0.5 beyond the soft fade between screens.

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
- [ ] On a phone, each level finishes in under 5 minutes
- [ ] Close the browser and reopen it: progress is still there
- [ ] 3 people who didn't help build it play it; at least 2 finish all 5 levels without prompting
- [ ] Published on GitHub Pages with a public link that opens on a phone, with page screenshots good enough to show
- [ ] Adding one new JSON file, without changing code, adds one more artwork

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
| Museum maps, 3D or virtual tours | The product is only for before the trip: knowing an artwork doesn't require knowing its room |
| Museums other than the Louvre | Coming, but 0.5 and 1.0 do one museum thoroughly first |
| An in-depth academic edition | Target users are beginners, not scholars |
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
| Animation and effects | None (soft fades only) | Heads and page effects animated in the style of the After Hours reference | — |
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

---

You build it yourself; we help you get there.
