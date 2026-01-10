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
content/            # Markdown learning content
docs/               # Documentation
```

## Development Workflow

1. **Make changes** to HTML/JS/CSS or content
2. **Live Server auto-reloads** the browser
3. **Test in browser** manually
4. **Validate content** if you changed Markdown:
   - Open `validate-content.html` in browser, or
   - Header → Tools → Content Validator
5. **Lint markdown**: `npx markdownlint-cli2 "**/*.md"` (no --fix!)
6. **Commit and push**

## Key Files

| File                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `app.js`                              | Main orchestration, passes state to modules        |
| `js/lecture.js`                       | Lecture player, content rendering                  |
| `js/quiz.js`                          | Quiz logic, scoring                                |
| `js/parser.js`                        | Parses Markdown content                            |
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
