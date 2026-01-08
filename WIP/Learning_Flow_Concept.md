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
- **Main View (Module Map):** The central UI is a "Module Map," which visually represents the entire curriculum. Modules are displayed as cards or nodes.
- **Unlocking Logic:**
    - **STEOPs (Grundlagen):** The initial set of modules (e.g., Modul 1-5) are unlocked by default.
    - **Dependencies:** Higher-level modules are visually "locked." Hovering reveals the prerequisites (e.g., "Requires completion of Modul 5 & 8").
    - **Completion:** Once a module's exam is passed, its card gets a golden border and a "Completed" checkmark.
- **Module Cards:** Each card shows the module title, the user's current progress (as a percentage or progress bar), and the ECTS points.

### 4.2. Learning & Exam Modes

- **Learning Mode:** This is where the primary teaching occurs. When a user enters a lecture, they are in Learning Mode.
    -   **Content Delivery:** For each topic, content is presented in various formats: reading material, embedded media, and interactive formats like flashcards.
    -   **Lecture Quiz:** At the end of each lecture, a short quiz is presented. Based on the score, the user earns a **Bronze, Silver, or Gold badge**.
- **Exam Mode:** The "Exam" is the final test for an entire module.
    -   **Unlocking:** The Exam is locked until the user achieves an **average score of 80% or higher across all lecture quizzes** within that module.
    -   **Format:** The exam is a longer, timed test pulling questions from all lectures in the module.

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
    -   **AC:** It contains functions to `getUserProgress`, `updateUserProgress`, and `resetUserProgress` in `localStorage`.
-   [x] Task 3.2: Implement Lecture Quiz Logic
    -   **AC:** A function in `app.js` renders questions from parsed markdown into the DOM.
    -   **AC:** It checks answers, calculates a score, and updates the user's progress via the `progress.js` utility.
-   **[ ] Task 3.3: Implement Progress Backup**
    -   **AC:** A button triggers a function to download the `localStorage` progress object as a JSON file.
