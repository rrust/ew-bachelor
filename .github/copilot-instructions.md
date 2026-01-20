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
- ⚠️ **Interaktive Typen: ALLE Felder im YAML-Frontmatter!** Bei `self-assessment-mc`, `matching`, `fill-in-the-blank`, `ordering`, `calculation`, `practice-exercise`, `self-assessment` stehen **alle Felder im Frontmatter** – es gibt keinen Markdown-Body! Nur `learning-content` und `youtube-video` haben einen Markdown-Body.
- ⚠️ **NIEMALS ASCII-Art oder Box-Zeichnungen verwenden!** Dies ist VERBOTEN:
  ```
  ┌────────┐      +--------+      |  Box  |
  │  Box   │  OR  |  Box   |  OR  +-------+
  └────────┘      +--------+
  ```
  **Stattdessen verwenden:** Tabellen, Listen, Blockquotes (`>`), Mermaid-Diagramme, oder einfache Textbeschreibungen.
- ⚠️ **Mermaid: Nur stabile Diagrammtypen** - Erlaubt: `flowchart`, `graph`, `sequenceDiagram`, `classDiagram`, `stateDiagram`. NICHT: `xychart-beta`, `timeline`, `mindmap`.
- ⚠️ **Mermaid: Max. 3-5 Wörter pro Box** - Lange Texte werden auf Mobile abgeschnitten. Keine `<br/>`-Tags. Bei komplexen Zusammenhängen Tabellen/Listen bevorzugen.
- ⚠️ **MC-Antworten: Korrekte Antwort NICHT die längste!** - Alle Optionen ähnliche Länge, mind. 1 Distraktor länger als korrekte Antwort.
- ⚠️ **KaTeX: Aggregatzustände in `\text{}`** - z.B. `\text{Na}_{\text{(s)}}` nicht `\text{Na}_{(s)}`
- ⚠️ **KaTeX: Ionen mit Aggregatzuständen vermeiden** - Formeln wie `\text{Na}^+_{(aq)}` rendern nicht im Browser! Aggregatzustände im Text erklären, nicht in der Formel.
- ⚠️ **NIEMALS fehlende Items hinten anhängen!** - Jedes lecture-item hat seinen sinnvollen Platz in der didaktischen Reihenfolge (gemäß CONTENT_PLAN). Fehlende Items müssen an der RICHTIGEN Stelle eingefügt werden, ggf. durch Umnummerierung aller nachfolgenden Dateien.

## Content Generation: 3-Phasen-Workflow

⚠️ **VERBINDLICHER WORKFLOW - Keine Schritte überspringen!**

### Phase 1: Rohmaterial (bereits erledigt)

Material liegt in `studies-material/{studyId}/NN-modul/NN-vorlesung/`

### Phase 2: CONTENT_PLAN.md erstellen/prüfen

Plan definiert exakte Struktur der zu generierenden Dateien

### Phase 3: Content generieren NACH dem CONTENT_PLAN

⚠️ **CONTENT_PLAN.md ist VERBINDLICH!**

- Erstelle **EXAKT** die Dateien aus dem CONTENT_PLAN
- Verwende **EXAKT** die dort definierten Typen und Dateinamen
- Erfinde **KEINE eigene Struktur** - der Plan ist das Gesetz
- Wenn der Plan `04-video-stoechiometrie.md` sagt, erstelle `04-video-stoechiometrie.md`

**Workflow:**

⚠️ **KRITISCH - Schritt 0: Zielordner ermitteln!**
Die Ordnernamen in `studies-material/` und `content/` können unterschiedlich sein!

- **ZUERST** mit `list_dir` den content-Ordner prüfen: `content/{studyId}/`
- Den **existierenden** Modul-Ordner verwenden, NICHT blind den Namen aus studies-material übernehmen
- Beispiel: `studies-material/.../02-grundlagen-chemie/` → `content/.../02-chemie-grundlagen/`

1. **ZUERST:** Lies `CONTENT_PLAN.md` im Material-Ordner - **DAS IST DIE VERBINDLICHE STRUKTUR**
2. **Read** `docs/AI-Content-Creation-Setup.md` for full workflow
3. **Check module folder** for additional resources:
   - Fachliteratur-Fragen (z.B. `mortimer-questions.md`)
   - Prüfungsfragen und -lösungen
   - `overview.md` mit Modulinfos und Prüfungsmodalitäten
4. **Check lecture folder** for `Videos.md` with verified YouTube videos
5. **Verify YouTube videos** with oEmbed API (if no Videos.md exists):
   ```bash
   curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
   ```

   - Success: JSON with `title`, `author_name` → video available
   - Error: HTTP 401/403/404 → DO NOT use this video
6. **Extract sources** (Titel + Link) from material file header
7. **Add `sources`** array to `lecture.md`
8. **Process `[cite: X-Y]`** markers → add `sourceRefs` to lecture-items
9. **Remove citation markers** from output text
10. **Run `npm run build`** to regenerate JSON files
11. **Run `npm run validate:content`** to check for errors
12. **Run `npx markdownlint-cli2 "content/**/\*.md"`\*\* to check formatting
13. **Run `node scripts/generate-test-progress.js`** to regenerate test data
14. **Validate** with Tools → "Inhalte validieren"

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
- **Atomic commits:** One logical change per commit
- **Commits:** `feat:`, `fix:`, `docs:`, `content:` prefixes
- **PRs via `gh` CLI:** `gh pr create --title "..." --body "..."`
- **If `gh` not installed:** `brew install gh && gh auth login`

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
