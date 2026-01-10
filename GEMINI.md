# AI Coding Instructions

Instructions for AI coding agents working on this project.

## Core Principles

1. **Keep it simple** - No frameworks, no build step, no TypeScript
2. **Work autonomously** - Implement features fully, then announce ready for testing
3. **Validate content** - Always run `validate-content.html` after content changes
4. **Don't over-engineer** - This is maintained by a non-engineer

## Tech Stack (Do Not Change)

- **Plain HTML/CSS/JS** - No React, Vue, Angular, etc.
- **Tailwind CSS via CDN** - No npm-based CSS
- **No build step** - Everything runs directly in browser
- **localStorage** - For user progress, no backend

## Architecture

```text
index.html      → Single page, all views
app.js          → Orchestration, passes state to modules
js/*.js         → Feature modules (quiz.js, lecture.js, modules.js, etc.)
content/*.md    → Learning content in Markdown
```

**Module Pattern:**
- Logic lives in `js/` modules (exported via `window.ModuleName`)
- `app.js` has thin wrappers that pass closure state to modules
- Don't add new patterns, follow existing code style

## Content Development

**For content rules, see:** [docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)

**Quick rules:**
- YAML lists use `-` (dash), NEVER `*` (asterisk)
- `correctAnswer` must exactly match an option
- Files numbered `NN-name.md` for ordering
- Always validate before committing

## Language

- **Code/comments:** English
- **User-facing text:** German
- **Commit messages:** English

## Validation Checklist

Before completing any task:

1. ✅ Test in browser (Live Server auto-reloads)
2. ✅ Validate content: `validate-content.html`
3. ✅ Lint markdown: `npx markdownlint-cli2 "**/*.md"` (NO --fix flag!)
4. ✅ Check for console errors

## What NOT to Do

❌ Add build tools (webpack, vite, etc.)
❌ Add TypeScript
❌ Add npm dependencies for runtime
❌ Create complex abstractions
❌ Refactor working code without reason
❌ Add "future-proofing" features

## Communication Style

- Implement features autonomously
- Announce when ready for testing
- Don't ask permission for each step
- If something breaks, fix it
