# Development Setup

## Quick Start

1. **Open in VS Code** with Live Server extension
2. **Right-click `index.html`** → "Open with Live Server"
3. **Done!** The app runs at `http://127.0.0.1:5500`

## Tech Stack

- **No build step** - everything runs directly in browser
- **Plain HTML/CSS/JS** - no React, no frameworks
- **Tailwind CSS** via CDN - no npm for styling
- **localStorage** for user progress

## Required Tools

### VS Code Extensions

```bash
# Essential
code --install-extension ritwickdey.LiveServer
code --install-extension DavidAnson.vscode-markdownlint

# Recommended
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

### Node.js (for linting only)

```bash
brew install node  # macOS
```

Used only for markdown linting:

```bash
npx markdownlint-cli2 "**/*.md"
```

## Project Structure

```text
index.html          # Main UI (single page app)
app.js              # Orchestration (calls modules)
js/                 # Feature modules
  ├── lecture.js    # Lecture player
  ├── quiz.js       # Quiz logic
  ├── modules.js    # Module cards
  ├── parser.js     # Content parsing
  └── ...           # Other utilities
content/            # Learning content
  ├── studies.json  # Master list of study programs
  ├── bsc-ernaehrungswissenschaften/  # Study program 1
  │   ├── modules.json
  │   ├── content-list.json
  │   └── 01-modul-name/...
  └── bsc-lebensmittel-biotechnologie/  # Study program 2
      └── ...
test-data/          # Test progress data for debugging
docs/               # Documentation
```

## Development Workflow

1. **Make changes** to HTML/JS/CSS or content
2. **Live Server auto-reloads** the browser
3. **Test in browser** manually
4. **Validate content** if you changed Markdown:
   - In-App: Tools menu → "Inhalte validieren"
5. **Validate views** if you added a new view: `node validate-views.js`
6. **Lint markdown**: `npx markdownlint-cli2 "**/*.md"` (no --fix!)
7. **Commit and push**

## Key Files

| File                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `app.js`                              | Main orchestration, passes state to modules        |
| `js/router.js`                        | URL routing and navigation                         |
| `js/lecture.js`                       | Lecture player, content rendering                  |
| `js/quiz.js`                          | Quiz logic, scoring                                |
| `js/alerts.js`                        | Achievement expiration alerts and renewal          |
| `js/notifications.js`                 | Local notifications and app badge                  |
| `js/parser.js`                        | Parses Markdown content                            |
| `js/snapshots.js`                     | Progress backup/restore (Dev Mode)                 |
| `content/{studyId}/modules.json`      | Module metadata per study                          |
| `content/{studyId}/content-list.json` | Registry of content files per study                |
| `content/studies.json`                | Master list of all study programs (auto-generated) |

## Adding New Features

The codebase follows a simple pattern:

1. **Logic** goes in `js/` modules (lecture.js, quiz.js, etc.)
2. **Wrappers** in app.js pass closure state to modules
3. **UI** is in index.html with Tailwind classes
4. **Content** is Markdown in `content/` folder

## Language Convention

- **Code/Comments:** English
- **User-facing text:** German
- **Commit messages:** English

## Developer Tools

| Tool                        | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `validate-views.js`         | CLI validator for view registration          |
| `validate-content.js`       | CLI content validator (no npm deps)          |
| `generate-content-list.js`  | Generates content-list.json and modules.json |
| `generate-test-progress.js` | Creates mock progress data for testing       |

### In-App Dev Mode

Enable Dev Mode in the app (Tools → Enable Dev Mode) for:

- **Test Data Loading** - Load predefined progress states
- **Snapshot Management** - Save/restore progress states
- **Demo Alerts** - Generate test alerts for debugging
- **Content Validator** - Validate all content files

### Testing Progress States

```bash
# Generate test progress data
node scripts/generate-test-progress.js

# Or use in-app: Dev Mode → Test-Daten laden
# Select: Fresh, Beginner, Intermediate, Advanced, Complete, Mixed, Alerts
```
