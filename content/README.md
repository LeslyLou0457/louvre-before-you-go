# Louvre 0.5 content

Five level files built from the playbook doc (https://claude.ai/code/artifact/ff9f143f-3ac4-458a-8037-1c68ebbee5a8), in the PRODUCT.md JSON format and the filenames from 0.5-plan.md. Owned by the "English Louvre storyplot playbook" thread; the app thread copies them into the repo's content/ folder.

- Each file: 1 lesson, 5 questions, start "n1", last node "n6" has no "next" (end of level).
- Checked: every "next" exists, every node reachable, sources non-empty, word budgets (story 45, branch 40, question 15).
- Sculpture imageCredit is "TO CHECK" until public-domain or CC0 photos are found.
- 2026-10-09: added optional fields (backward compatible, nothing removed or renamed): `artwork.medium`, `artwork.dimensions`, `artwork.museumUrl` for the museum label; top-level `speakers`; `lessons[].narrator`; and a `voice` object on some story/branch nodes (`speaker`, `kind` "imagined" or "quote", `text`, plus `cite` and `source` for quotes). See PRODUCT.md "Data format". Narrators: Leonardo, the Venus de Milo itself, the Winged Victory itself, Delacroix, Géricault.
