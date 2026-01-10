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
- **Progress Backup/Export** - Download/upload progress as JSON (`js/progress.js`)
- **Progress Visualization** - Overall progress bar, circular rings, milestone messages
- **Global Search** - Dedicated search page with colored badges (`js/search.js`)
- **Improved Header Navigation** - Icon-based navigation (🔍 Search, 📂 Map, 🏆 Achievements, 🌙 Theme)
- **Mobile Responsiveness** - Single-column layout, touch-friendly buttons (44px+ targets), responsive header
- **PWA / Offline Mode** - Installable app, Service Worker caching (`sw.js`, `manifest.json`)

---

## 🟡 Medium Priority

### Note-Taking

- **Feature:** Personal notes per lecture section
- **Implementation:**
  - "Add Note" button on lecture sections
  - Notes stored in localStorage
  - Export notes as markdown
  - Search through notes
- **Effort:** 3-5 days
- **Why deferred:** Students already use Notion/Obsidian, but could be useful for in-context notes

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

1. ~~**Progress Backup/Export**~~ ✅ Done
2. ~~**Progress Visualization**~~ ✅ Done
3. ~~**Global Search**~~ ✅ Done
4. ~~**Mobile Polish**~~ ✅ Done
5. ~~**PWA / Offline Mode**~~ ✅ Done
6. **Note-Taking** ← If user feedback requests it

---

**Last Updated:** 2026-01-10
