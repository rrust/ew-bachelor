# AI Coding Agent Instructions

This document provides instructions for AI coding agents to effectively contribute to this project. The goal is to create a web application for learning nutritional science with a playful and engaging user experience.

The maintainer of this repository is not a software engineer, so the AI agent is expected to handle most of the engineering challenges, from architecture to implementation. The technology stack should be kept as simple as possible.

## Big Picture Architecture

The project is a single-page, client-side web application built with **plain HTML, CSS, and vanilla JavaScript**. There is no backend server, and no complex frameworks like React should be used. All logic, content rendering, and user progress are managed in the browser.

- **Content Source**: Learning content is stored in `content/` as Markdown (`.md`) files.
- **State Management**: User progress is stored in the browser's `localStorage`.
- **UI**: The user interface is a single `index.html` file. Different "pages" or "views" are managed by showing and hiding DOM elements with JavaScript. Styling is done using **Tailwind CSS** (via CDN) for a modern, responsive design.
- **Learning Flow**: The app has two modes per module: **Learning Mode** (for studying content and taking small lecture quizzes) and **Exam Mode** (a final module exam unlocked after achieving 80% average across lecture quizzes).

## Developer Workflows

### Setup

There is no complex setup. Simply open the `index.html` file in a browser. For development, it's recommended to use a simple live server extension in your editor to handle auto-reloading.

### Build & Run

There is no build step. The application runs directly in the browser.

### Content Validation

**Critical:** Always validate content before completing tasks:

1. Open `validate-content.html` in browser with Live Server
2. Click "Alle Content-Dateien validieren"
3. Fix all errors and warnings
4. Re-validate until all green

Or access via the app: Header → "Tools" → "Content Validator"

**For detailed content development guidelines, see:**
→ **[docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)**

### YAML Formatting Rules

1. **List syntax:** Always use `-` (dash) with 2-space indentation, NEVER `*` (asterisk)

   ```yaml
   # ✅ CORRECT
   options:
     - 'Option 1'
     - 'Option 2'
   
   # ❌ WRONG - will cause parsing errors
   options:
   
   * 'Option 1'
   * 'Option 2'
   ```

2. **Required fields:**
   - `multiple-choice`: type, question, options (array), correctAnswer
   - `self-assessment-mc`: type, topic, question, options (array), correctAnswer
   - `learning-content`: type

3. **correctAnswer must exactly match one option** (case-sensitive)

4. **Minimum 2 options** for multiple choice questions

### Content Templates

See `docs/CONTENT_TEMPLATES.md` for copy-paste templates.

---

## Linting

Markdown content should be linted using **markdownlint-cli2** via **npx** (no installation required):

```bash
# Lint all markdown files
npx markdownlint-cli2 "**/*.md"

# Fix auto-fixable issues
npx markdownlint-cli2 --fix "**/*.md"

# Lint specific directories
npx markdownlint-cli2 "content/**/*.md" "WIP/**/*.md"

# Fix specific directories
npx markdownlint-cli2 --fix "content/**/*.md" "WIP/**/*.md"
```

**Why lint markdown?**

- Ensures consistent formatting across all content files
- Catches common markdown syntax errors
- Improves readability and maintainability
- Helps content maintainers follow best practices

### Test

Testing is done by manually interacting with the application in the browser.

## Project-Specific Conventions

- **Language:** The user-facing language of the application is German. The code, comments, and commit messages should be in English.

### Content Format

Learning content is defined in Markdown files with a clear, human-friendly hierarchical structure optimized for maintainability.

**Content Organization:**

```text
content/
  modules.json                                    # Module metadata
  01-ernaehrungslehre-grundlagen/                # Module folder (numbered for order)
    01-grundlagen-zellbiologie/                  # Lecture folder (numbered for order)
      lecture.md                                  # Main lecture content
      quiz.md                                     # Graded quiz questions
      questions/                                  # Optional: Individual question files
        01-mitochondrien-funktion.md
        02-golgi-apparat.md
    02-makronaehrstoffe-detail/
      lecture.md
    03-fette-oele/
      lecture.md
```

**Naming Conventions:**

- **Modules:** `NN-descriptive-name/` - Number prefix for ordering, descriptive name for clarity
- **Lectures:** `NN-descriptive-topic/` - Subfolder containing all lecture materials
- **Files:** `lecture.md` and `quiz.md` - Standard names, no prefixes needed at this level
- **Questions (optional):** `NN-topic.md` - Numbered for order within questions subfolder

**Benefits:**

- Clear hierarchy that's easy to navigate manually
- Numbers only indicate order within their context (not duplicated across levels)
- Each file has a manageable length
- Self-documenting structure (folder names describe content)
- Easy to add new content without code changes

**Module Metadata:**
All module information is stored in `content/modules.json`:

```json
{
  "id": "01-ernaehrungslehre-grundlagen",
  "title": "Grundlagen der Ernährungslehre",
  "ects": 6,
  "status": "unlocked",
  "order": 1,
  "description": "Einführung in die Grundlagen der Ernährungswissenschaft"
}
```

**Lecture Structure:**
A `lecture.md` file contains a **series of learning items**, separated by `---`. Each item begins with a YAML frontmatter block that defines its `type` and other metadata. This allows a lecture to be a sequence of text, images, videos, and self-assessments.

The graded quiz for a lecture is stored in `quiz.md` within the same lecture folder and contains items of type `multiple-choice`.

**Example: A Multi-Item Lecture File (`01-grundlagen-zellbiologie.md`)**

```markdown
---
type: 'learning-content'
# This is the first item: a block of text.
---

## Die Zelle: Baustein des Lebens

Die Zelle ist die kleinste lebende Einheit aller Organismen. Man unterscheidet zwischen prokaryotischen und eukaryotischen Zellen.

---
type: 'self-assessment-mc'
# This is the second item: a non-graded, multiple choice self-assessment.
question: 'Was ist die kleinste lebende Einheit?'
options:
  - 'Das Organ'
  - 'Die Zelle'
  - 'Das Molekül'
correctAnswer: 'Die Zelle'
---

**Erklärung:** Super! Die Zelle ist der fundamentale Baustein.

---
type: 'learning-content'
# This is the third item: more text content.
---

### Wichtige Organellen

*   **Zellkern:** Enthält die DNA.
*   **Mitochondrien:** Sind die Kraftwerke der Zelle.
```

**Example: A Graded Quiz Question (`01-grundlagen-zellbiologie-quiz.md`)**

```markdown
---
type: 'multiple-choice'
question: 'Welches Organell ist für die Energieproduktion zuständig?'
options:
  - 'Zellkern'
  - 'Mitochondrien'
  - 'Ribosomen'
correctAnswer: 'Mitochondrien'
---
```

**Example: Individual Question File (`01-frage-mitochondrien-funktion.md`)**

```markdown
---
type: 'multiple-choice'
lecture: 'lecture-1'
topic: 'Grundlagen der Zellbiologie'
question: 'Was ist die Hauptfunktion der Mitochondrien?'
options:
  - 'Proteinsynthese'
  - 'Energiegewinnung (ATP-Produktion)'
  - 'Speicherung von Erbinformation'
  - 'Abbau von Abfallprodukten'
correctAnswer: 'Energiegewinnung (ATP-Produktion)'
---

**Erklärung:** Mitochondrien sind die "Kraftwerke" der Zelle.
```

### Code Structure

- **`index.html`**: The single HTML file containing the structure for all views.
- **`app.js`**: The main JavaScript file for application logic, event handling, and DOM manipulation.
- **`js/`**: A directory for additional JavaScript utilities (e.g., `parser.js`, `progress.js`).
- **`content/`**: Markdown files and JSON metadata for all learning materials:
  - `modules.json`: Module metadata (title, ECTS, status, etc.)
  - `content-list.json`: List of content files to load
  - `XX-module-name/`: Folders containing lectures and quizzes for each module

### Progress Tracking

The user's progress is stored in `localStorage` under the key `userProgress`. Functions to interact with `localStorage` should be abstracted in `js/progress.js`.

**Example `userProgress` Object:**

```json
{
  "userName": "Alex",
  "modules": {
    "modul-5": {
      "status": "in-progress",
      "examUnlocked": false,
      "lectures": {
        "lecture-1": { "score": 95, "badge": "gold" },
        "lecture-2": { "score": 75, "badge": "silver" }
      }
    }
  }
}
```

### UI Components

**Module Cards:**

- Display module title, ECTS points, status badge (locked/unlocked), and overall progress badge
- Progress badge shows: 🥇 (gold ≥90%), 🥈 (silver ≥70%), 🥉 (bronze ≥50%), or ⚪ (incomplete/none)
- Two icon buttons: 📚 (view lectures) and 📝 (module exam)
- Exam button is disabled until average quiz score reaches 80%
- Tooltips show detailed progress information on hover
- Cards have uniform height (min-height: 240px) with buttons right-aligned at bottom

**Lecture List:**

- Shows all lectures for a module with "Vorlesung" and "Quiz" buttons
- Badge emoji appears next to Quiz button if completed, showing achievement level
- Tooltip on badge shows exact percentage score

**Quiz Flow:**

- When starting a completed quiz, unified results view shows existing score with option to retake
- Quiz questions displayed one at a time with progress bar and live score
- Results view shows percentage, badge, and appropriate actions based on context

## Agent Behavior

- **Autonomy:** Work autonomously. Implement features until you reach a state that is ready for user testing. Do not ask for permission to proceed on each small step. Announce when a feature is ready for testing, and I will provide feedback.
- **Communication:** Don't tell me what you will implement or ask if you should. Just implement until you are at a point where I can test the changes. Then, tell me, and I will test and tell you if it works or not.
