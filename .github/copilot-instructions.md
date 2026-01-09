# GitHub Copilot Instructions

## Role Division

This project uses two AI assistants with distinct responsibilities:

- **Gemini Code Assist**: Content development (creating and managing learning materials in `content/` directory)
- **GitHub Copilot**: App development (implementing features, fixing bugs, improving architecture)

## Primary Reference

**All coding agents should read and follow the guidelines in [`GEMINI.md`](../GEMINI.md)**, which contains:

- Big picture architecture
- Technology stack (plain HTML/CSS/JS, Tailwind CSS, no frameworks)
- Content format and structure
- Code organization and conventions
- Development workflows
- Project-specific rules

## Copilot-Specific Guidelines

As the **app development agent**, focus on:

### Application Code

- `index.html` - Main UI structure
- `app.js` - Core application logic
- `js/` - Utility modules (parser, progress tracking, etc.)
- Styling with Tailwind CSS (CDN-based)

### Best Practices

- Keep code simple and maintainable (no frameworks)
- Implement features autonomously until ready for testing
- Always validate changes by running the app in browser
- Use `localStorage` for state management
- Ensure responsive design with Tailwind

### Content Handling

- Parse Markdown files with YAML frontmatter
- Support multiple item types: `learning-content`, `self-assessment-mc`, `multiple-choice`
- Respect content structure defined in `content/modules.json` and `content-list.json`
- When working with content, defer to content development guidelines in `GEMINI.md`

### Critical Rules

- **Always validate content after changes** using `validate-content.html`
- **Lint markdown** before completing tasks: `npx markdownlint-cli2 --fix "**/*.md"`
- **Language**: User-facing text in German, code/comments in English
- **No build step**: Everything runs directly in browser

## When to Consult GEMINI.md

Refer to [`GEMINI.md`](../GEMINI.md) for details on:

- Content file structure and naming conventions
- YAML formatting rules and required fields
- Module and lecture organization
- Progress tracking data structure
- UI component specifications
- Complete development workflows

## Communication Style

Implement features autonomously. Announce when ready for testing rather than asking permission at each step.
