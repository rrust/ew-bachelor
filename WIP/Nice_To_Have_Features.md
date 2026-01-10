# Nice-to-Have Features & Enhancements

Technical and UX improvements beyond core functionality.

> **Note:** Learning concepts, gamification, and motivation features are documented in [ACHIEVEMENT_SYSTEM.md](../docs/ACHIEVEMENT_SYSTEM.md)

---

## ✅ Already Implemented

- **Bookmarkable URLs** - `js/navigation.js`
- **Light/Dark Mode** - `js/theme.js`
- **Swipe Gestures** - `js/swipe.js`
- **Progress Tracking** - `js/progress.js`
- **Achievement System (Core)** - `js/achievements.js`

---

## 🔴 High Priority (Quick Wins)

### Progress Backup/Export

- **Feature:** Download/upload progress as JSON file
- **Why:** Prevents data loss, enables device switching
- **Effort:** 1-2 hours
- **Implementation:**
  - Download button in Progress view → exports localStorage as JSON
  - Upload button → imports JSON back to localStorage
  - Optional: Weekly backup reminder

### Mobile Responsiveness Polish

- **Current State:** Basic responsive layout works
- **Improvements:**
  - Single-column card layout on mobile (< 640px)
  - Touch-friendly buttons (minimum 44x44px touch targets)
  - Test on iOS Safari and Android Chrome
  - Ensure quiz radio buttons are easily tappable
- **Effort:** 1 day

### Progress Visualization

- **Feature:** Better visual feedback on progress
- **Implementation:**
  - Overall module progress bar on dashboard
  - Visual indicators per lecture (circular progress)
  - Milestone celebrations ("50% complete!")
- **Effort:** 2-3 hours

---

## 🟡 Medium Priority

### PWA / Offline Mode

- **Feature:** Install app, work offline
- **Benefits:**
  - Home screen installation
  - Works without internet (cached content)
  - Native app-like experience
- **Effort:** 1 week
- **Consideration:** Service workers add complexity

### Note-Taking

- **Feature:** Personal notes per lecture section
- **Implementation:**
  - "Add Note" button on lecture sections
  - Notes stored in localStorage
  - Export notes as markdown
  - Search through notes
- **Effort:** 3-5 days
- **Why deferred:** Students already use Notion/Obsidian, but could be useful for in-context notes

### Global Search

- **Feature:** Search across all content
- **Implementation:**
  - Search box in header
  - Results show matching lectures/topics
  - Jump to content from results
- **Effort:** 2-3 days

### Accessibility Improvements

- **Implementation:**
  - Full keyboard navigation
  - ARIA labels for screen readers
  - Adjustable text size
  - High contrast mode option
  - Respects `prefers-reduced-motion`
- **Effort:** 2-3 days

---

## 🟢 Low Priority (Maybe Later)

### Glossary

- **Feature:** Searchable terminology database
- **Benefit:** Quick lookup of technical terms
- **Effort:** 2 days (plus content creation)

### Print-Friendly Styles

- **Feature:** CSS for printing lectures/cheat sheets
- **Benefit:** Physical study materials
- **Effort:** Few hours

---

## ❌ Not Planned

These features are explicitly out of scope:

- **Social/Collaborative** - Requires backend, auth, moderation
- **Cloud Sync** - Requires backend infrastructure
- **Analytics Dashboard** - Progress view is sufficient
- **Rich Media (3D, Simulations)** - Way outside scope, huge effort
- **Personalized Learning Paths** - Over-engineering for current scale
- **Certificates/LinkedIn Export** - Not meaningful without accreditation
- **Push Notifications** - Intrusive, adds complexity

---

## Implementation Order

1. **Progress Backup/Export** ← Do this first (prevents data loss)
2. **Progress Visualization** ← Quick motivational win
3. **Mobile Polish** ← Many students study on phones
4. **Note-Taking** ← If user feedback requests it
5. **PWA** ← Nice-to-have for dedicated users

---

**Last Updated:** 2026-01-10
