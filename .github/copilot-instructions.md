# Copilot Instructions

This document provides instructions for AI coding agents to effectively contribute to this project. The goal is to create a web application for learning nutritional science with a playful and engaging user experience.

The maintainer of this repository is not a software engineer, so the AI agent is expected to handle most of the engineering challenges, from architecture to implementation. The technology stack should be kept as simple as possible.

## Big Picture Architecture

The project is a single-page, client-side web application built with **plain HTML, CSS, and vanilla JavaScript**. There is no backend server, and no complex frameworks like React should be used. All logic, content rendering, and user progress are managed in the browser.

- **Content Source**: Learning content is stored in `src/content` as Markdown (`.md`) files.
- **State Management**: User progress is stored in the browser's `localStorage`.
- **UI**: The user interface is a single `index.html` file. Different "pages" or "views" are managed by showing and hiding DOM elements with JavaScript. Styling is done with a `style.css` file, focusing on responsiveness for mobile devices.
- **Learning Flow**: The app has two modes per module: **Learning Mode** (for studying content and taking small lecture quizzes) and **Exam Mode** (a final test unlocked after sufficient progress).

## Developer Workflows

### Setup

There is no complex setup. Simply open the `index.html` file in a browser. For development, it's recommended to use a simple live server extension in your editor to handle auto-reloading.

### Build & Run

There is no build step. The application runs directly in the browser.

### Test

Testing is done by manually interacting with the application in the browser.

## Project-Specific Conventions

- **Language:** The user-facing language of the application is German. The code, comments, and commit messages should be in English.

### Content Format

Learning content is defined in Markdown files, using YAML frontmatter for metadata. A lightweight JavaScript library will be used to parse these files.

**Example: Multiple Choice Question**
```markdown
---
type: 'multiple-choice'
lecture: 'Metabolism Basics'
topic: 'Macronutrients'
question: 'Which of the following is a macronutrient?'
options:
  - 'Vitamin C'
  - 'Protein'
  - 'Iron'
  - 'Calcium'
correctAnswer: 'Protein'
---

**Explanation:** Proteins are one of the three main macronutrients...
```

### Code Structure

- **`index.html`**: The single HTML file containing the structure for all views.
- **`style.css`**: The main stylesheet.
- **`app.js`**: The main JavaScript file for application logic, event handling, and DOM manipulation.
- **`js/`**: A directory for additional JavaScript utilities (e.g., `parser.js`, `progress.js`).
- **`content/`**: Markdown files containing all learning and quiz materials.

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

## Agent Behavior

- **Autonomy:** Work autonomously. Implement features until you reach a state that is ready for user testing. Do not ask for permission to proceed on each small step. Announce when a feature is ready for testing, and I will provide feedback.
- **Communication:** Don't tell me what you will implement or ask if you should. Just implement until you are at a point where I can test the changes. Then, tell me, and I will test and tell you if it works or not.
