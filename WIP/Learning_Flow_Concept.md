# Concept: Gamified Learning App for Nutritional Sciences

## 1. Overview

This document outlines the concept for a web-based learning game for the "Bachelorstudium Ernährungswissenschaften." The primary goal is to create an intuitive, engaging, and mobile-friendly experience for students.

- **No Backend, No Login:** The application is a pure client-side web app. All user data is stored directly in the browser's `localStorage`, eliminating the need for servers or user accounts.
- **Personalization:** Users can enter their name for a personalized touch.
- **Progress Management:** Users can track their learning journey, and their progress can be downloaded as a JSON file for backup or transfer between devices.

## 2. Core Principle: Learn, Practice, Test

The application will be structured around two distinct modes for each module: **Learning Mode** and **Exam Mode**. The goal is for a user to learn the material from the ground up within the app, practice it through interactive challenges, and finally prove their mastery in a formal exam.

## 3. Content Hierarchy

The curriculum is broken down into a clear, multi-level structure:

1.  **Module:** The highest level, corresponding to the official university curriculum (e.g., "Modul 5: Medizinische und biochemische Grundlagen").
2.  **Lecture:** Each module is composed of multiple lectures. A lecture represents a self-contained unit of teaching, similar to a chapter in a textbook.
3.  **Topic:** Each lecture covers several specific topics. A topic is the most granular piece of knowledge (e.g., "The Citric Acid Cycle").

## 4. UI and Navigation Flow

### 4.1. Welcome Screen & Module Map

The user is first greeted by a clean, welcoming screen.

- **Initial State:** If it's the user's first visit, the app asks for their name.
- **Returning User:** If progress is found in `localStorage`, it displays a "Welcome back, [Name]!" message.
- **Main View (Module Map):** The central UI is a "Module Map," which visually represents the entire curriculum. All 14 modules from the Bachelor's curriculum are displayed as cards.
- **Unlocking Logic:**
    - **STEOPs (Grundlagen):** The initial set of modules (Modul 1-5) are unlocked by default.
    - **Dependencies:** Higher-level modules (6-14) are visually "locked" (not yet implemented: automatic unlocking based on prerequisites).
    - **Completion:** Once a module's exam is passed (not yet implemented), its card displays completion status.
- **Module Cards:** Each card shows:
    - Module title and ECTS points
    - Status badge (locked/unlocked)
    - Overall progress badge: 🥇 (≥90% avg), 🥈 (≥70% avg), 🥉 (≥50% avg), or ⚪ (incomplete/no quizzes taken)
    - Two icon buttons at bottom (right-aligned): 📚 (view lectures) and 📝 (module exam)
    - Exam button disabled until 80% average quiz score is achieved
    - Tooltips show detailed progress on hover

### 4.2. Learning & Exam Modes

- **Learning Mode:** This is where the primary teaching occurs. When a user clicks the lectures icon (📚) on a module card, they see all lectures for that module.
    -   **Lecture List:** Each lecture shows title with two buttons: "Vorlesung" (learning) and "Quiz" (assessment).
    -   **Content Delivery:** Lecture content is presented as a sequence of items: text, self-assessment questions, and other learning materials.
    -   **Navigation:** Users navigate through lecture items using prev/next buttons or jump-to dropdown.
    -   **Self-Assessment:** Interactive multiple-choice questions with immediate feedback (not graded).
    -   **Lecture Quiz:** Separate graded quiz accessible via "Quiz" button. Based on score, user earns **Bronze (≥50%), Silver (≥70%), or Gold (≥90%) badge**.
    -   **Quiz Retake:** When accessing a completed quiz, users see their existing score and can choose to retake (overwrites previous score).
    -   **Badge Display:** Completed quizzes show badge emoji (🥇/🥈/🥉) next to Quiz button with percentage tooltip.
- **Exam Mode:** The "Exam" is the final test for an entire module (not yet implemented).
    -   **Unlocking:** The Exam button is disabled until the user achieves an **average score of 80% or higher across all lecture quizzes** within that module.
    -   **Format:** Planned as a longer, timed test pulling questions from all lectures in the module.

## 5. Gamification & Progress

### 5.1. Achievements & Badges

Users earn badges for specific achievements to stay motivated.
- **Lecture Badges:** Bronze, Silver, or Gold for lecture quiz performance.
- **Special Achievements:**
    - **"Biochemie-Adept":** Complete 80%+ in the "Medizinische und biochemische Grundlagen" module exam.
    - **"Nachteule":** Complete a session after 10 PM.
    - **"Prüfungs-Champion":** Ace an exam with a perfect 100% score.
- A dedicated "My Achievements" section will display all earned badges.

### 5.2. Progress Dashboard

A separate page will provide a detailed overview of the user's progress.

- **Overall Completion:** A master progress bar for the entire degree.
- **Module Breakdown:** Detailed stats for each module (score, time spent, badges earned).
- **Data Management:** Buttons to **Download Progress** (exports the `localStorage` JSON object) and **Reset Progress**.

## 6. Implementation Plan & Tasks (Lo-Fi Vanilla JS)

This section breaks down the concept into actionable implementation steps using only **HTML, CSS, and plain JavaScript**.

### Phase 1: Project Scaffolding & Core UI

-   **[x] Task 1.1: Create Core HTML, CSS, and JS Files**
    -   **AC:** `index.html` is created with basic boilerplate and linked assets.
    -   **AC:** `style.css` is created for all styling.
    -   **AC:** `app.js` is created for all main application logic.
-   **[x] Task 1.2: Structure `index.html` with View Containers**
    -   **AC:** The `index.html` file contains `<div>` containers for each major view (e.g., `id="welcome-view"`, `id="module-map-view"`, `id="lecture-view"`).
    -   **AC:** A JavaScript function in `app.js` manages showing/hiding these views to simulate page navigation.
-   **[x] Task 1.3: Create Basic Folder Structure**
    -   **AC:** `js/` directory is created for helper scripts (e.g., `progress.js`, `parser.js`).
    -   **AC:** `content/` directory is created to hold markdown learning materials.
-   [x] Task 1.4: Implement Welcome Screen & User Personalization
    -   **AC:** On first load, the `welcome-view` is shown.
    -   **AC:** A script saves the user's name from an input field to `localStorage`.
    -   **AC:** On subsequent loads, the `module-map-view` is shown with a "Welcome back, [Name]!" message.

### Phase 2: Content & Learning Mode

-   **[x] Task 2.1: Develop Markdown Content Parser**
    -   **AC:** Add a lightweight library (like `marked.js` or `showdown.js`) to parse markdown.
    -   **AC:** Create a utility in `js/parser.js` to fetch and parse `.md` files from the `content/` directory.
-   **[x] Task 2.2: Build Module Map Dashboard**
    -   **AC:** A function in `app.js` dynamically creates and appends module cards to the `module-map-view`.
    -   **AC:** Module cards are styled with CSS and display the title.
-   **[x] Task 2.3: Implement Lecture & Topic Views**
    -   **AC:** Clicking a module card shows the `lecture-view`.
    -   **AC:** The `lecture-view` is populated with content rendered from the parsed markdown files.

### Phase 3: Quizzes, Exams & Progress Tracking

-   **[x] Task 3.1: Create Progress Management Utility**
    -   **AC:** A `js/progress.js` file is created.
    -   **AC:** It contains functions to `getUserProgress`, `updateLectureProgress`, `resetLectureProgress`, and `resetUserProgress` in `localStorage`.
    -   **AC:** Progress includes score and badge (gold/silver/bronze) based on quiz performance.
-   **[x] Task 3.2: Implement Lecture Quiz Logic**
    -   **AC:** A function in `app.js` renders questions from parsed markdown into the DOM.
    -   **AC:** It checks answers, calculates a score, and updates the user's progress via the `progress.js` utility.
    -   **AC:** Quiz questions are rendered one at a time with progress tracking.
    -   **AC:** Live score display during quiz shows current points.
    -   **AC:** Final score is displayed at the end with percentage calculation.
-   **[x] Task 3.3: Implement Lecture Selection View**
    -   **AC:** Clicking a module card displays a list of available lectures for that module.
    -   **AC:** Each lecture shows its title (from markdown metadata) and two buttons: "Vorlesung" and "Quiz".
    -   **AC:** Badge emoji displays next to Quiz button if completed (🥇/🥈/🥉).
    -   **AC:** Tooltip on badge shows exact percentage score.
    -   **AC:** Users can directly start a lecture (learning mode) or jump to the quiz.
-   **[x] Task 3.4: Implement Lecture Player**
    -   **AC:** Learning items are displayed one at a time with navigation controls (prev/next/jump-to).
    -   **AC:** Self-assessment MC questions are interactive with immediate feedback.
    -   **AC:** A "Zum Abschlussquiz" button appears on the last lecture item if a quiz exists.
-   **[x] Task 3.5: Display Current Score on Quiz Start**
    -   **AC:** Unified results view shows existing score with badge when starting completed quiz.
    -   **AC:** "Quiz wiederholen" button allows retaking with automatic score reset.
    -   **AC:** Same view used for just-completed quizzes (without retake option).
-   **[x] Task 3.6: Implement Module-Level Progress**
    -   **AC:** Module cards display overall badge based on average quiz scores.
    -   **AC:** Badge shows: 🥇 (≥90%), 🥈 (≥70%), 🥉 (≥50%), or ⚪ (incomplete).
    -   **AC:** Tooltip displays "X of Y quizzes taken" or average percentage.
-   **[x] Task 3.7: Implement Exam Unlocking**
    -   **AC:** Exam button on module card requires 80% average to unlock.
    -   **AC:** Disabled exam button shows tooltip: "Your current score: X%, you need 80%".
    -   **AC:** Icon buttons (📚 for lectures, 📝 for exam) right-aligned at card bottom.
-   **[x] Task 3.8: Add All 14 Modules**
    -   **AC:** All modules from Bachelor's curriculum added to module map.
    -   **AC:** Modules 1-5 unlocked by default (STEOPs), modules 6-14 locked.
    -   **AC:** Cards have uniform minimum height for consistent appearance.
-   **[ ] Task 3.9: Implement Progress Backup**
    -   **AC:** A button triggers a function to download the `localStorage` progress object as a JSON file.

### Phase 4: Module Exams & Advanced Features

-   **[ ] Task 4.1: Implement Module Exam**
    -   **AC:** Module exam pulls questions from all lectures in the module.
    -   **AC:** Exam is timed and tracks completion.
    -   **AC:** Passing exam updates module status and unlocks dependent modules.
-   **[ ] Task 4.2: Implement Module Dependencies**
    -   **AC:** Higher-level modules show prerequisites when locked.
    -   **AC:** Modules automatically unlock when dependencies are met.
-   **[ ] Task 4.3: Add Progress Dashboard**
    -   **AC:** Dedicated view shows overall completion statistics.
    -   **AC:** Displays per-module breakdown with scores and time spent.
    -   **AC:** Shows all earned badges and achievements.
