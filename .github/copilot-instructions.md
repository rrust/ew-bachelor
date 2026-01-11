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

## Content Generation

When generating content from `studies-material/` files:

1. **Read** `docs/AI-Content-Creation-Setup.md` for full workflow
2. **Extract sources** (Titel + Link) from material file header
3. **Add `sources`** array to `lecture.md`
4. **Process `[cite: X-Y]`** markers → add `sourceRefs` to lecture-items
5. **Remove citation markers** from output text
6. **Run `npm run build`** to regenerate JSON files
7. **Validate** with Tools → "Inhalte validieren"

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
