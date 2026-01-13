# GitHub Copilot Instructions

**Read and follow: [`GEMINI.md`](../GEMINI.md)**

## Quick Reference

- **Tech:** Plain HTML/CSS/JS, Tailwind CDN, no build step
- **Code:** English | **UI text:** German
- **Build:** `npm run build` after content changes
- **Validate:** Open `validate-content.html` in browser (NOT via node/shell!)
- **Lint:** `npx markdownlint-cli2 "**/*.md"` (no --fix!)

## Critical Content Rules

- YAML lists use `-` (dash), NEVER `*` (asterisk)
- ⚠️ **NEVER use `---` in Markdown content** - parser sees it as YAML separator
- Use `***` for horizontal lines or just `##` headings for visual separation
- `correctAnswer` must exactly match an option
- ⚠️ **Keine ASCII-Art in Code-Blöcken** - Die App rendert Code-Blöcke als Code. Verwende stattdessen Tabellen, Listen oder Mermaid-Diagramme für Visualisierungen.
- ⚠️ **Mermaid: Nur stabile Diagrammtypen** - Erlaubt: `flowchart`, `graph`, `sequenceDiagram`, `classDiagram`, `stateDiagram`. NICHT: `xychart-beta`, `timeline`, `mindmap`.
- ⚠️ **NIEMALS fehlende Items hinten anhängen!** - Jedes lecture-item hat seinen sinnvollen Platz in der didaktischen Reihenfolge (gemäß CONTENT_PLAN). Fehlende Items müssen an der RICHTIGEN Stelle eingefügt werden, ggf. durch Umnummerierung aller nachfolgenden Dateien.

## Content Generation V4: Lernen → Überprüfen → Anwenden

When generating content from `studies-material/` files, follow this structure:

**Jeder Abschnitt:**

1. 📚 **Lerninhalte** (learning-content) - Theorie, Konzepte
2. ✅ **Verständnis-Checks** (direkt danach!) - self-assessment-mc, fill-in-the-blank, matching, ordering
3. 🧮 **Praxis-Übung** - practice-exercise, calculation
4. 📺 **Video** - an thematisch passender Stelle

**Am Ende der Vorlesung:**

- 📋 **Selbsttest** (self-assessment) - Bereitschafts-Checkliste
- 📝 **Vorlesungs-Test** (questions/) - NUR multiple-choice-multiple, schwer
- 🎓 **Modul-Prüfungsfragen** - 2 sehr schwierige pro Vorlesung

**Workflow:**

1. **Read** `docs/AI-Content-Creation-Setup.md` for full workflow
2. **Read** CONTENT_PLAN.md in the material folder for structure
3. **Check module folder** for additional resources:
   - Fachliteratur-Fragen (z.B. `mortimer-questions.md`)
   - Prüfungsfragen und -lösungen
   - `overview.md` mit Modulinfos und Prüfungsmodalitäten
4. **Check lecture folder** for `Videos.md` with verified YouTube videos
5. **Extract sources** (Titel + Link) from material file header
6. **Add `sources`** array to `lecture.md`
7. **Process `[cite: X-Y]`** markers → add `sourceRefs` to lecture-items
8. **Remove citation markers** from output text
9. **Run `npm run build`** to regenerate JSON files
10. **Run `npm run validate:content`** to check for errors
11. **Run `node scripts/generate-test-progress.js`** to regenerate test data
12. **Validate** with Tools → "Inhalte validieren"

## Lecture Versioning

The `version` field in `lecture.md` follows semantic versioning:

| Change    | Version Bump      | When to use                             |
| --------- | ----------------- | --------------------------------------- |
| **Patch** | `1.0.0` → `1.0.1` | Format fixes, typos, minor wording      |
| **Minor** | `1.0.0` → `1.1.0` | Content item edited substantively       |
| **Major** | `1.0.0` → `2.0.0` | Complete regeneration from CONTENT_PLAN |

## Git Workflow

- **Never commit to main** - Always use feature branches
- **Branch naming:** `feature/description` or `fix/description`
- **Commits:** `feat:`, `fix:`, `docs:`, `content:` prefixes

## Don't

- Add frameworks, TypeScript, or build tools
- Over-engineer or refactor without reason
- Ask permission for each step
- Guess at bug fixes without checking console

## Do

- Work autonomously, announce when ready for testing
- Keep code simple
- Fix what breaks
- Check browser console first when debugging
