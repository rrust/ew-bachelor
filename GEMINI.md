# AI Coding Instructions

Instructions for AI coding agents working on this project.

## Core Principles

1. **Keep it simple** - No frameworks, no build step, no TypeScript
2. **Work autonomously** - Implement features fully, then announce ready for testing
3. **Validate content** - Always run `validate-content.html` after content changes
4. **Don't over-engineer** - This is maintained by a non-engineer (nutrition science student)
5. **Debug with evidence** - Never guess at fixes; check console/logs first

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

## Git Workflow

### Branch Policy

**Never commit directly to `main` branch!**

1. Create a feature branch: `git checkout -b feature/descriptive-name`
2. Make changes and commit
3. Push and create Pull Request
4. Merge via GitHub

### Commit Messages

Use conventional commit format:
- `feat: add new quiz question type` - New features
- `fix: correct answer validation bug` - Bug fixes
- `docs: update content development guide` - Documentation
- `content: add cell biology lecture` - Learning content

### Destructive Git Commands ⚠️

**Before running these, always check `git status` first:**
- `git restore <path>` - Discards uncommitted changes
- `git reset --hard` - Discards all uncommitted work
- `git clean -fd` - Deletes untracked files

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
2. ✅ Validate content: Open `validate-content.html` in browser (NOT via node/shell!)
3. ✅ Lint markdown: `npx markdownlint-cli2 "**/*.md"` (NO --fix flag!)
4. ✅ Check for console errors

**Note:** The content validator is browser-only. Do NOT try to run it via Node.js.

## Debugging Protocol

**When something doesn't work - NEVER GUESS!**

1. **Check browser console first** - Most issues show errors there
2. **Add strategic console.log** - At key decision points
3. **Verify code is running** - Is the function even being called?
4. **Look at actual data** - What values are being processed?
5. **Fix based on evidence** - Not assumptions

**Wrong approach:** Trying random code changes hoping something works
**Right approach:** Understand WHY it fails, then fix once correctly

## What NOT to Do

❌ Add build tools (webpack, vite, etc.)
❌ Add TypeScript
❌ Add npm dependencies for runtime
❌ Create complex abstractions
❌ Refactor working code without reason
❌ Add "future-proofing" features
❌ Guess at bug fixes without checking console first

## Communication Style

- Implement features autonomously
- Announce when ready for testing
- Don't ask permission for each step
- If something breaks, fix it
