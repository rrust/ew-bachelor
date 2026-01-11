# Achievement System - Concept

## Implementation Status (2026-01-11)

| Feature | Status | Notes |
|---------|--------|-------|
| Achievement content in Markdown | ✅ Done | Stored in `achievements/` folders |
| Unlock via quiz gold badge | ✅ Done | Automatic unlock after gold score |
| Time-limited validity | ✅ Done | Default 30 days, configurable |
| Expiration alerts | ✅ Done | Bell icon in header, alerts view |
| Quick renewal (1 question) | ✅ Done | For expiring-soon achievements |
| Full quiz for expired | ✅ Done | Must re-earn gold badge |
| Achievement gallery | ✅ Done | Filter by status, view content |
| Local notifications | ✅ Done | On app start if alerts exist |
| App badge (PWA) | ✅ Done | Shows alert count on icon |
| Unlock celebration animation | 🟡 Partial | Basic modal, no confetti yet |
| Multiple unlock conditions | ❌ Todo | Only lecture-quiz-gold for now |

---

## Philosophy: Why This App Exists

**The Problem with Existing Learning Apps:**

1. **Anki is only ONE learning pattern** - Pure spaced repetition is effective but monotonous. Students need variety: lectures, quizzes, self-assessments, visual aids, and summaries.

2. **Generic badges are meaningless** - Other apps offer achievements like "Completed 10 questions!" that have no relation to actual course content. The motivation to unlock them is low because they provide no real benefit.

**Our Solution:**

- **Content-related achievements** that unlock actual study materials (cheat sheets, diagrams, summaries)
- **Multiple learning patterns** within one app (read, test yourself, quiz, review)
- **Time-limited rewards** that encourage regular engagement, not just one-time completion

---

## Overview

The Achievement System adds **useful rewards** that help students with learning. Unlike purely decorative badges, achievements provide practical value such as cheat sheets, graphics, or summaries.

Achievements are **time-limited** and must be "kept alive" by correctly answering quiz questions. This promotes continuous repetition and refreshing of knowledge.

## Core Mechanics

### 1. Unlock Mechanism

Achievements can be unlocked in various ways:

- **After Lecture Completion**: Requires Gold Badge (≥90%) in Lecture Quiz
- **During Lecture**: Automatically upon reaching a specific Lecture Item
- **After Module Completion**: Requires Gold Badge in Module Exam
- **Combined**: Multiple conditions (e.g., Gold in multiple Lectures)

### 2. Expiration

Each achievement has a **validity period**:

- **Default Duration**: e.g., 30 days after unlock
- **Warning Stage**: 7 days before expiration → Status "locked soon"
- **Extension**: +14 days when correctly answering a random question

### 3. Maintenance through Quiz Questions

**Extension Process:**

1. Achievement shows "🔓 Expiring soon" status
2. Student clicks "Extend" button
3. System selects random question from associated quiz
4. **If answer is correct**: +14 days validity
5. **If answer is wrong**:
   - Achievement gets locked (Status: "locked")
   - Quiz score is reset to 0
   - Gold badge disappears
   - Achievement can only be regained by complete quiz retake

### 4. Achievement Status

- **`locked`**: Not yet unlocked (shows unlock conditions)
- **`unlocked`**: Active and available, expiration time running
- **`locked-soon`**: Warning, extension possible (≤7 days until expiration)
- **`expired`**: Expired, must be unlocked again

## Achievement Types

### Type 1: Lecture Cheat Sheet

**Example:** "Cell Biology Cheat Sheet"

- **Unlock**: Gold Badge in Lecture Quiz "Fundamentals of Cell Biology"
- **Content**: PDF/Markdown with compact summary of all important concepts
- **Benefit**: Quick reference for exam preparation

### Type 2: Visual Aid

**Example:** "Protein Synthesis Flowchart"

- **Unlock**: During lecture upon reaching Item 05 (after protein synthesis content)
- **Content**: Interactive graphic or high-resolution diagram
- **Benefit**: Visual understanding of complex processes

### Type 3: Deep Dive Content

**Example:** "Mitochondria Advanced"

- **Unlock**: Gold Badge in Lecture Quiz + at least 1 successful extension
- **Content**: Additional learning material with in-depth information
- **Benefit**: Advanced expertise for highly motivated students

### Type 4: Module Summary

**Example:** "Module 1 Master Guide"

- **Unlock**: Gold Badge in Module Exam
- **Content**: Comprehensive module summary with all key concepts
- **Benefit**: Overall overview and exam preparation

### Type 5: Bonus Material

**Example:** "Interview with Nutrition Expert"

- **Unlock**: Gold Badge in 3 consecutive Lectures
- **Content**: Video interview, podcast, or article
- **Benefit**: Practical relevance and motivation

## UI/UX Design

### Achievement Card

```text
┌─────────────────────────────────────────────┐
│ 🏆 Cell Biology Cheat Sheet                 │
│                                             │
│ Status: 🔓 Active (23 days left)           │
│                                             │
│ [Open]  [Info]                             │
└─────────────────────────────────────────────┘
```

**Status Variants:**

- **Locked**: `🔒 Locked` + show unlock conditions
- **Unlocked**: `🔓 Active (X days left)`
- **Locked Soon**: `⏰ Expiring soon (X days left)` + [Extend] Button
- **Expired**: `⌛ Expired` + show unlock conditions again

### Achievement Gallery

Central overview of all achievements:

- **Filter**: By module, status (locked/unlocked/expired)
- **Sorting**: By expiration time, alphabetically, by module
- **Preview**: Thumbnail and brief description
- **Progress Indicator**: X of Y unlocked

### In-Context Display

**In Module Card:**

```text
Module 1: Fundamentals of Nutritional Science
🥇 93% | 6 ECTS | 🏆 2/5 Achievements
```

**In Lecture List:**

```text
📚 Fundamentals of Cell Biology  [Lecture] [Quiz: 🥇 95%]
    🏆 Cheat Sheet active (12 days)
```

### Unlock Celebration Animation

When an achievement is unlocked, a celebration animation should provide positive feedback:

**Animation Sequence:**

1. **Trigger**: Immediately after quiz completion with gold badge
2. **Modal/Overlay**: Full-screen overlay with semi-transparent background
3. **Achievement Card Animation**:
   - Achievement card slides in from top with bounce effect
   - Icon pulses/grows 2-3 times
   - Confetti or sparkle particles around the card
4. **Sound Effect** (optional): Brief celebratory sound
5. **Text Animation**:
   - "Achievement Unlocked!" title fades in
   - Achievement title and description appear with typewriter or fade effect
6. **Action Buttons**:
   - [View Now] - Opens achievement content immediately
   - [View Later] - Dismisses modal, can be accessed from gallery
7. **Duration**: 3-5 seconds, auto-dismiss or user-triggered

**Technical Implementation:**

- CSS animations for slide-in, bounce, pulse effects
- Canvas or CSS-based confetti/particle system
- Smooth transitions (ease-out for natural feel)
- Responsive design (works on mobile)
- Accessibility: Can be skipped with ESC key, respects reduced motion preferences

**Visual Style:**

- Gradient background (e.g., blue to purple)
- Gold/yellow accent colors for celebration
- Large icon display (3x-4x normal size)
- Clear typography with emphasis on achievement title

### Content Type-Specific UI

Different achievement types require tailored presentation:

#### 1. Markdown Cheat Sheet

**Current Issue**: Plain markdown rendering lacks visual appeal and structure

**Improved Design:**

- **Two-column layout** (on desktop) for better space utilization
- **Sticky navigation**: Table of contents on side for quick jumps
- **Section cards**: Each major section in colored card with icon
- **Typography hierarchy**:
  - Large, bold headings with colored underlines
  - Code-style formatting for key terms
  - Highlighted boxes for important concepts
- **Print-friendly CSS**: Optimized layout for printing
- **Dark mode support**: Adjusted colors for comfortable reading
- **Quick reference bar**: Key facts always visible at top

**Example Layout:**

```text
┌─────────────────────────────────────────────┐
│ 📋 Zellbiologie Spickzettel      [Print] [↓]│
├─────────────────────────────────────────────┤
│ ┌─────────┐  Content Area                   │
│ │ TOC     │  ┌───────────────────┐          │
│ │ • Orga. │  │ 🔋 Mitochondrien  │          │
│ │ • Membr.│  │ - Energieprodukt. │          │
│ │ • Makro │  └───────────────────┘          │
│ │         │  ┌───────────────────┐          │
│ │         │  │ 📦 Golgi-Apparat  │          │
│ └─────────┘  └───────────────────┘          │
└─────────────────────────────────────────────┘
```

#### 2. PDF Viewer

- **Embedded PDF viewer** with controls (zoom, page navigation)
- **Download button** for offline access
- **Full-screen mode** for distraction-free reading
- **Thumbnail sidebar** for quick page access
- **Search functionality** within PDF

#### 3. Image/Diagram Gallery

- **Large preview** with zoom capabilities
- **Pinch-to-zoom** on mobile
- **Lightbox mode** for full-screen viewing
- **Image carousel** if multiple images
- **Download option** for high-resolution version
- **Annotations support** (optional - for interactive diagrams)

#### 4. Interactive Mermaid Diagrams

- **Pan and zoom** controls
- **Click to focus** on specific nodes
- **Export as PNG/SVG** option
- **Step-by-step reveal** animation (optional)
- **Responsive scaling** for different screen sizes

#### 5. Video Content

- **Embedded player** (YouTube, Vimeo, or native)
- **Timestamp markers** for key sections
- **Playback speed controls**
- **Captions/subtitles** support
- **Picture-in-picture** mode for multitasking

### Achievement Content Modal Design

**Enhanced Modal Layout:**

```text
┌─────────────────────────────────────────────┐
│ ┌───────────────────────────────────────┐ × │
│ │ 📋 Zellbiologie Spickzettel              │
│ │ 🔓 Aktiv • noch 23 Tage                  │
│ ├───────────────────────────────────────┤  │
│ │ [Print] [Download] [Extend]  [Share]    │
│ ├───────────────────────────────────────┤  │
│ │                                         │  │
│ │  Content Area with type-specific        │  │
│ │  rendering (scrollable)                 │  │
│ │                                         │  │
│ │                                         │  │
│ └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Features:**

- **Header**: Icon, title, status badge in one line
- **Action bar**: Context-appropriate buttons (print, download, extend)
- **Content area**: Scrollable with type-specific rendering
- **Footer** (optional): Tips, related achievements, feedback button
- **Close button**: Prominent X in top-right
- **Keyboard shortcuts**: ESC to close, arrow keys for navigation

## Data Structure

### Achievement Definition (Content)

```yaml
---
type: 'achievement'
id: 'cell-biology-cheatsheet'
title: 'Cell Biology Cheat Sheet'
description: 'Compact summary of all important cell biology concepts'
icon: '📋'
contentType: 'markdown' # or 'pdf', 'image', 'video', 'mermaid-diagram'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '01-grundlagen-zellbiologie'
  moduleId: '01-ernaehrungslehre-grundlagen'
defaultDuration: 30 # days
extensionDuration: 14 # days upon successful extension
warningThreshold: 7 # days before expiration for "locked-soon" status
---

# Cell Biology Cheat Sheet

## Cell Organelles

- **Mitochondria**: Energy production (ATP)
- **Golgi Apparatus**: Protein modification and sorting
- **ER**: Protein synthesis (rough) and lipid synthesis (smooth)
...
```

### User Progress (localStorage)

```json
{
  "userName": "Alex",
  "modules": {
    "01-ernaehrungslehre-grundlagen": {
      "status": "in-progress",
      "lectures": {
        "01-grundlagen-zellbiologie": {
          "score": 95,
          "badge": "gold"
        }
      },
      "achievements": {
        "cell-biology-cheatsheet": {
          "status": "unlocked",
          "unlockedAt": "2026-01-01T10:00:00Z",
          "expiresAt": "2026-01-31T10:00:00Z",
          "extensionCount": 0,
          "lastExtensionAt": null
        },
        "protein-synthesis-flowchart": {
          "status": "locked-soon",
          "unlockedAt": "2025-12-15T10:00:00Z",
          "expiresAt": "2026-01-17T10:00:00Z",
          "extensionCount": 2,
          "lastExtensionAt": "2026-01-03T10:00:00Z"
        }
      }
    }
  }
}
```

## Unlock Condition Types

### 1. Lecture Quiz Gold

```yaml
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '01-grundlagen-zellbiologie'
  moduleId: '01-ernaehrungslehre-grundlagen'
```

### 2. Lecture Item Reached

```yaml
unlockCondition:
  type: 'lecture-item-reached'
  lectureId: '01-grundlagen-zellbiologie'
  moduleId: '01-ernaehrungslehre-grundlagen'
  itemIndex: 5 # After the 5th item
```

### 3. Module Exam Gold

```yaml
unlockCondition:
  type: 'module-exam-gold'
  moduleId: '01-ernaehrungslehre-grundlagen'
```

### 4. Multiple Lecture Gold

```yaml
unlockCondition:
  type: 'multiple-lecture-gold'
  lectureIds:
    - '01-grundlagen-zellbiologie'
    - '02-makronaehrstoffe-detail'
    - '03-fette-oele'
  moduleId: '01-ernaehrungslehre-grundlagen'
```

### 5. Consecutive Lecture Gold

```yaml
unlockCondition:
  type: 'consecutive-lecture-gold'
  count: 3
  moduleId: '01-ernaehrungslehre-grundlagen' # optional: any module if not specified
```

### 6. Achievement with Extensions

```yaml
unlockCondition:
  type: 'achievement-with-extensions'
  achievementId: 'cell-biology-cheatsheet'
  minExtensions: 1
```

## Implementation Considerations

### Phase 1: Core System

1. **Data Structure**: Achievement definitions in content files
2. **Parser**: Load achievements from content
3. **Progress Tracking**: Achievement status in localStorage
4. **Basic UI**: Achievement Gallery View
5. **Unlock Logic**: Automatic unlocking upon quiz completion

### Phase 2: Expiration & Extension

1. **Time Tracking**: Calculate and display expiration time
2. **Warning System**: "Locked Soon" status
3. **Extension Flow**: Random Question → Answer → Extend/Lock
4. **Reset Logic**: Reset quiz score upon wrong answer

### Phase 3: Advanced Features

1. **In-Lecture Unlocks**: Unlock achievements during lecture
2. **Multiple Conditions**: Combined unlock conditions
3. **Statistics**: Achievement overview, success rate
4. **Notifications**: Reminders for expiring achievements

### Phase 4: Content Types

1. **Markdown Rendering**: For text-based achievements
2. **PDF Viewer**: For PDF cheat sheets
3. **Image Gallery**: For high-resolution graphics
4. **Video Embed**: For bonus videos
5. **Interactive Diagrams**: Advanced Mermaid diagrams

### Phase 5: Enhanced UX & Polish

1. **Unlock Celebration**: Celebration animation with confetti/particles
2. **Content-Specific UI**: Tailored rendering for each content type
   - Cheat sheet: Two-column layout with TOC
   - PDF: Embedded viewer with controls
   - Images: Lightbox with zoom
   - Diagrams: Interactive pan/zoom
3. **Modal Improvements**: Enhanced achievement modal with action buttons
4. **Print Optimization**: CSS for printing cheat sheets
5. **Accessibility**: Keyboard navigation, reduced motion support
6. **Mobile Optimization**: Touch-friendly interactions

## Technical Details

### Achievement Parser

```javascript
// In js/parser.js
function parseAchievement(content) {
  const { yaml, markdown } = extractFrontmatter(content);
  
  return {
    id: yaml.id,
    title: yaml.title,
    description: yaml.description,
    icon: yaml.icon || '🏆',
    contentType: yaml.contentType,
    unlockCondition: yaml.unlockCondition,
    defaultDuration: yaml.defaultDuration || 30,
    extensionDuration: yaml.extensionDuration || 14,
    warningThreshold: yaml.warningThreshold || 7,
    content: markdown
  };
}
```

### Achievement Checker

```javascript
// In js/achievements.js
function checkAchievementUnlock(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  const condition = achievement.unlockCondition;
  
  switch (condition.type) {
    case 'lecture-quiz-gold':
      return checkLectureQuizGold(condition);
    case 'lecture-item-reached':
      return checkLectureItemReached(condition);
    case 'module-exam-gold':
      return checkModuleExamGold(condition);
    // ... more conditions
  }
}
```

### Extension Flow

```javascript
async function extendAchievement(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  const quiz = getRelatedQuiz(achievement);
  const randomQuestion = selectRandomQuestion(quiz);
  
  // Show question in modal
  const answer = await showExtensionQuestionModal(randomQuestion);
  
  if (answer.correct) {
    // Extend achievement
    extendAchievementExpiration(achievementId, achievement.extensionDuration);
    showSuccessMessage();
  } else {
    // Lock achievement and reset quiz
    lockAchievement(achievementId);
    resetQuizScore(quiz.id);
    showFailureMessage();
  }
}
```

## Content Organization

### Folder Structure

```text
content/
  modules.json
  content-list.json
  01-ernaehrungslehre-grundlagen/
    achievements/
      01-cell-biology-cheatsheet.md
      02-protein-synthesis-flowchart.md
      03-module-master-guide.md
    01-grundlagen-zellbiologie/
      lecture.md
      quiz.md
      lecture-items/
      questions/
```

### Registration in modules.json

```json
{
  "id": "01-ernaehrungslehre-grundlagen",
  "title": "Grundlagen der Ernährungslehre",
  "achievements": [
    "01-cell-biology-cheatsheet",
    "02-protein-synthesis-flowchart",
    "03-module-master-guide"
  ]
}
```

## Gamification Aspects

### Motivation

- **Usefulness**: Achievements actually help with learning
- **Time Pressure**: Expiration creates incentive for regular repetition
- **Challenge**: Wrong answer = harsh consequence
- **Collection**: Achievement Gallery shows progress

### Balance

- **Not too easy**: Gold badge is already a challenge
- **Not too hard**: Extension question is just one question, not the whole quiz
- **Fair**: Clear communication of consequences
- **Rewarding**: Content is truly valuable and helpful

## Open Questions

1. **Extension Question Difficulty**: Should extension questions be harder than normal quiz questions?
2. **Multiple Extensions**: Limit for maximum extensions?
3. **Achievement Tiers**: Bronze/Silver/Gold achievements with different content?
4. **Offline Mode**: How does expiration work without internet connection?
5. **Reset Options**: Can students voluntarily reset an achievement?

---

## Future Learning Concepts

These features could enhance the learning experience but are not part of the initial achievement system:

### Spaced Repetition Review Mode

- **Feature:** Smart review system that resurfaces content at optimal intervals
- **Why valuable:** Combats forgetting curve, scientifically proven
- **Implementation idea:**
  - "Review Mode" presents questions from completed lectures
  - Algorithm tracks which topics need review based on time and performance
  - Could integrate with achievement extension system
- **Effort:** High (7-10 days)
- **Status:** Consider after core achievement system is stable

### Additional Question Types

- **Feature:** More interactive formats beyond multiple choice
- **Options:**
  - Fill-in-the-blank questions
  - Drag-and-drop matching exercises
  - Flashcard mode for terminology
- **Why valuable:** Active engagement improves memory encoding
- **Effort:** High (8-12 days per type)
- **Status:** Future enhancement

### Microlearning / Quick Review

- **Feature:** "Quick Review" mode (3-5 questions, 2 minutes)
- **Why valuable:** Fits into busy schedules, good for commutes
- **Could integrate with:** Achievement extension flow
- **Effort:** Low (1-2 days)
- **Status:** Good quick win after core system

## Implementation Plan

### Phase 1: Core System - Foundation ✅ Complete

- [x] **Concept Document**: Complete achievement system specification
- [x] **Achievement Parser**: Add parsing logic to `js/parser.js`
  - Parse achievement frontmatter (type, id, title, unlockCondition, etc.)
  - Extract achievement content (markdown body)
  - Store in `APP_CONTENT.achievements` object
- [x] **Achievement Module**: Create `js/achievements.js`
  - `checkAchievementUnlock(achievementId)` - Check if unlock conditions met
  - `unlockAchievement(achievementId)` - Unlock achievement and set expiration
  - `getAchievementStatus(achievementId)` - Get current status (locked/unlocked/locked-soon/expired)
  - `calculateExpirationStatus()` - Check and update expiration warnings
- [x] **Progress Integration**: Extend `js/progress.js`
  - Add achievement tracking to localStorage structure
  - `saveAchievementProgress(moduleId, achievementId, status)`
  - `getAchievementProgress(achievementId)`
- [x] **Content Files**: Create achievement content
  - Create `content/01-ernaehrungslehre-grundlagen/achievements/` folder
  - Add `01-cell-biology-cheatsheet.md` with unlock condition
  - Register in `content-list.json`
  - Add achievements array to module in `modules.json`
- [x] **Basic UI**: Achievement Gallery view
  - Create achievement gallery page/view
  - Display achievement cards with status
  - Show unlock conditions for locked achievements
  - Open achievement content modal
- [x] **Quiz Integration**: Auto-unlock on gold badge
  - Check for achievement unlocks when quiz completed
  - Show unlock notification
- [x] **Testing**: Validate core functionality
  - Test achievement parsing
  - Test unlock on quiz completion
  - Test content display

### Phase 2: Expiration & Extension - Time Management ⏸ Not Started

- [ ] **Time Tracking**: Calculate expiration dates
  - Add expiration date calculation on unlock
  - Display remaining days in UI
  - Update status based on time remaining
- [ ] **Warning System**: "Locked Soon" notifications
  - Check daily for achievements approaching expiration
  - Update status to "locked-soon" at threshold
  - Show warning indicators in UI
- [ ] **Extension Flow**: Random quiz question
  - Create extension modal with random question
  - Handle correct answer: extend expiration
  - Handle wrong answer: lock achievement, reset quiz
- [ ] **Reset Logic**: Quiz score reset on failure
  - Reset quiz score to 0
  - Remove gold badge
  - Lock achievement
  - Show failure message with instructions

### Phase 3: Advanced Features - Enhanced Unlocking 🔒 Not Started

- [ ] **In-Lecture Unlocks**: Unlock during lecture
  - Track lecture item progress
  - Check for item-based unlock conditions
  - Show unlock notification during lecture
- [ ] **Multiple Conditions**: Combined unlock logic
  - Support multiple-lecture-gold condition
  - Support consecutive-lecture-gold condition
  - Support achievement-with-extensions condition
- [ ] **Statistics**: Achievement analytics
  - Track unlock rate per achievement
  - Show extension success rate
  - Display achievement completion stats
- [ ] **Notifications**: Reminder system
  - Daily check for expiring achievements
  - Show notification badge
  - Optional email/push notifications

### Phase 4: Content Types - Rich Media 🔒 Not Started

- [ ] **Markdown Rendering**: Text-based achievements
  - Render markdown content in modal
  - Support headings, lists, emphasis
  - Support inline code and code blocks
- [ ] **PDF Viewer**: PDF cheat sheets
  - Integrate PDF.js or similar
  - Display PDF in modal
  - Download option
- [ ] **Image Gallery**: High-res graphics
  - Support image display
  - Zoom and pan functionality
  - Download option
- [ ] **Video Embed**: Bonus videos
  - YouTube embed support
  - Local video support
  - Playback controls
- [ ] **Interactive Diagrams**: Advanced Mermaid
  - Render Mermaid diagrams
  - Interactive elements
  - Export as image

### Current Status Summary

- **Phase 1**: ✅ Complete (8/8 tasks complete)
- **Phase 2**: 🔒 Not Started (0/4 tasks complete)
- **Phase 3**: 🔒 Not Started (0/4 tasks complete)
- **Phase 4**: 🔒 Not Started (0/5 tasks complete)
- **Phase 5**: 🔒 Not Started (0/6 tasks complete)
- **Overall Progress**: 8/27 tasks (30%)

### Next Immediate Steps

1. ✅ Add implementation plan to concept document
2. ✅ Implement achievement parser in `js/parser.js`
3. ✅ Create `js/achievements.js` module
4. ✅ Create achievement content for module 1, lecture 1
5. ✅ Create Achievement Gallery UI
6. ⏳ Implement unlock celebration animation
7. ⏳ Enhance cheat sheet UI with two-column layout and TOC
8. ⏳ Implement Phase 2: Expiration warnings and extension flow

---

**Created**: 2026-01-10  
**Updated**: 2026-01-10  
**Status**: Phase 1 - Complete | Phase 5 (UX Polish) - Ready to Start  
**Version**: 1.3
