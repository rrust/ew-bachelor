# AI Coding Instructions

Instructions for AI coding agents working on this project.

## Core Principles

1. **Keep it simple** - No frameworks, no build step, no TypeScript
2. **Work autonomously** - Implement features fully, then announce ready for testing
3. **Validate content** - Use Tools menu → "Inhalte validieren" in the app
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

**For AI content generation, see:** [docs/AI-Content-Creation-Setup.md](docs/AI-Content-Creation-Setup.md)

**Quick rules:**
- YAML lists use `-` (dash), NEVER `*` (asterisk)
- `correctAnswer` must exactly match an option
- `multiple-choice-multiple` uses `correctAnswers` (plural!), not `correctAnswer`
- Files numbered `NN-name.md` for ordering
- ⚠️ **NEVER use `---` in Markdown content** - parser sees it as YAML separator. Use `***` for horizontal lines or just use `##` headings for visual separation.
- Always validate before committing

### Content Types Reference

| Type                       | Required Fields                                       | Notes                        |
| -------------------------- | ----------------------------------------------------- | ---------------------------- |
| `multiple-choice`          | `type`, `question`, `options`, `correctAnswer`        | Single correct answer        |
| `multiple-choice-multiple` | `type`, `question`, `options`, `correctAnswers`       | **Plural!** Multiple correct |
| `self-assessment`          | `type`, `question`, `checkpoints`                     | Checklist, not quiz          |
| `self-assessment-mc`       | `type`, `question`, `options`, `correctAnswer`        | Quiz-style self-check        |
| `learning-content`         | `type`                                                | Main lecture content         |
| `mermaid-diagram`          | `type`                                                | Flowcharts, diagrams         |
| `youtube-video`            | `type`, `url`                                         | Embedded video               |
| `achievement`              | See [CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md) | Cheat-sheets                 |

### Valid Icon Names (for achievements)

Only use these icons: `search`, `menuDots`, `sun`, `moon`, `close`, `modules`, `chart`, `cog`, `map`, `trophy`, `phone`, `phoneDownload`, `checkCircle`, `book`, `zoomIn`, `zoomOut`, `reset`, `externalLink`, `lock`, `unlock`, `clock`, `hourglass`, `document`, `clipboard`, `apple`, `beaker`, `graduationCap`, `download`, `upload`, `hourglassEmpty`, `check`, `rocket`, `fire`, `muscle`, `star`, `wave`

### Content Generation from Study Materials

When generating content from `studies-material/` files:

1. **Extract sources** from material file header:

   ```markdown
   Titel: "Vorlesungsfolien Kapitel 1"
   Link: https://moodle.univie.ac.at/path/to/file.pdf
   ```

2. **Add sources to `lecture.md`:**

   ```yaml
   sources:
     - id: 'vorlesung-k1'
       title: 'Vorlesungsfolien Kapitel 1'
       url: 'https://moodle.univie.ac.at/...'
       type: 'pdf'
   ```

3. **Process citations** `[cite_start]...[cite: X-Y]` → add `sourceRefs` to items:

   ```yaml
   sourceRefs:
     - sourceId: 'vorlesung-k1'
       pages: '23-25'
   ```

4. **Remove citation markers** from final content (keep text, remove `[cite_start]` and `[cite: X-Y]`)

### Content File Structure

```text
studies-material/{studyId}/NN-modul/NN-vorlesung/
├── Vorlesung.md            → Source with citations
└── CONTENT_PLAN.md         → Plan for app content
                ↓ generates ↓
content/{studyId}/NN-modul/NN-vorlesung/
├── lecture.md              → sources array
├── lecture-items/
│   └── 01-topic.md         → sourceRefs array
└── questions/
    └── 01-question.md
```

## Adding New Views

**When adding a new view (e.g., alerts, search, settings), you MUST update ALL of these:**

1. ✅ `index.html` - Add `<div id="newview-view">` with content
2. ✅ `app.js` - Add to `views` object (~line 23): `newview: document.getElementById('newview-view')`
3. ✅ `js/router.js` - Add route parsing: `else if (parts[offset] === 'newview') { route.view = 'newview'; }`
4. ✅ `app.js` - Add route handling in `navigateFromURL()`: `else if (route.view === 'newview') { showView('newview'); ... }`
5. ✅ `app.js` - Add header injection in `reinjectHeaders()` and initial setup
6. ✅ `sw.js` - Add any new JS files to cache

**Validate with:** `node validate-views.js`

## Language

- **Code/comments:** English
- **User-facing text:** German
- **Commit messages:** English

## Validation Checklist

Before completing any task:

1. ✅ Test in browser (Live Server auto-reloads)
2. ✅ Validate content: Use Tools menu → "Inhalte validieren" in the app
3. ✅ Validate views: `node validate-views.js`
4. ✅ Lint markdown: `npx markdownlint-cli2 "**/*.md"` (NO --fix flag!)
5. ✅ Check for console errors

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
