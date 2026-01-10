# GitHub Copilot Instructions

**Read and follow: [`GEMINI.md`](../GEMINI.md)**

## Quick Reference

- **Tech:** Plain HTML/CSS/JS, Tailwind CDN, no build step
- **Code:** English | **UI text:** German
- **Validate:** `validate-content.html` after content changes
- **Lint:** `npx markdownlint-cli2 "**/*.md"` (no --fix!)

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
