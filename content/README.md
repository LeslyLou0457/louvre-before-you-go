# Louvre 0.5 content

Five level files built from the playbook doc (https://claude.ai/code/artifact/ff9f143f-3ac4-458a-8037-1c68ebbee5a8), in the PRODUCT.md JSON format and the filenames from 0.5-plan.md. Owned by the "English Louvre storyplot playbook" thread; the app thread copies them into the repo's content/ folder.

- Each file: 1 lesson, 5 questions, start "n1", the last story node (n6, n6b or n6c) has no "next" (end of level).
- Checked: every "next" exists, every node reachable, sources non-empty, word budgets (story 45, branch 40, question 15).
- imageCredit (2026-10-09): verified on each photo's Wikimedia Commons page. Paintings are public-domain reproductions; the two sculpture photos are CC0 (Venus de Milo by Shonagon, Winged Victory by Wilfredor).
- 2026-10-09: added optional fields (backward compatible, nothing removed or renamed): `artwork.medium`, `artwork.dimensions`, `artwork.museumUrl` for the museum label; top-level `speakers`; `lessons[].narrator`; and a `voice` object on some story/branch nodes (`speaker`, `kind` "imagined" or "quote", `text`, plus `cite` and `source` for quotes). See PRODUCT.md "Data format". Narrators: Leonardo, the Venus de Milo itself, the Winged Victory itself, Delacroix, Géricault.
- 2026-10-09 (content depth): all five levels revised to the PRODUCT.md "Depth standard" (levels 2–5 rewritten, Mona Lisa lighter pass). Added the optional branch field `correction` ({ `kind`, `verdict`, `tempting`, `truth`, `evidence` }) on every wrong-answer branch; extra story screens between questions use ids like `n3b`. Question, merge-line and branch ids from the earlier version are kept, so saved mid-level places still resolve.
