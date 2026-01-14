# Feedback & Fixes Sammlung

Gesammelte Verbesserungsvorschläge und Bugs aus dem User-Testing.

## Status-Legende

- ⬜ Offen
- 🔄 In Arbeit
- ✅ Erledigt
- ❌ Abgelehnt/Verschoben

---

## UI/UX Verbesserungen

### ✅ Such-Eingabe sticky machen

**Problem:** Die Such-Eingabe scrollt mit dem Content mit.
**Gewünscht:** Suchfeld soll fixed/sticky am oberen Rand bleiben.
**Betroffene Dateien:** `index.html`, `css/custom-styles.css`
**Commit:** `feat: sticky search input and subtle header shadow`

### ✅ App Header Drop-Shadow

**Problem:** Der App-Header hat keine visuelle Abgrenzung zum Content.
**Gewünscht:** Leichter drop-shadow an der Unterkante des Headers.
**Betroffene Dateien:** `css/custom-styles.css`, `js/components.js`
**Commit:** `feat: sticky search input and subtle header shadow`

---

## Cheat-Sheets

### ✅ Kein Icon im Titel

**Problem:** Cheat-Sheets zeigen ein Icon im Modal-Titel.
**Gewünscht:** Icon entfernen, nur Text-Titel.
**Betroffene Dateien:** `index.html`
**Commit:** `feat: improve cheat-sheet modal - remove icon, add fullscreen, compact mobile`

### ✅ Kleinere Darstellung auf Mobile

**Problem:** Cheat-Sheets sind auf Mobile zu groß.
**Gewünscht:** Kompaktere Darstellung, kleinere Schriftgröße auf kleinen Screens.
**Betroffene Dateien:** `css/custom-styles.css`, `index.html`
**Commit:** `feat: improve cheat-sheet modal - remove icon, add fullscreen, compact mobile`

### ✅ Fullscreen-Ansicht ermöglichen

**Problem:** Cheat-Sheets können nur im Modal angezeigt werden.
**Gewünscht:** Button für Fullscreen-Ansicht.
**Betroffene Dateien:** `js/achievements-ui.js`, `css/custom-styles.css`, `index.html`
**Commit:** `feat: improve cheat-sheet modal - remove icon, add fullscreen, compact mobile`

---

## Training & Navigation

### ✅ Kontextuelles Training funktioniert nicht

**Problem:** Bei kontextuellem Training (aus einer Vorlesung heraus) fehlten die kontextspezifischen Buttons im lectureOverview-Menü.
**Ursache:** `lectureId` wurde nicht an `injectLectureOverviewHeader` übergeben, und das Menü hatte nur einen generischen TRAIN-Button.
**Fix:** 
1. `lectureId` zu den Header-Options hinzugefügt
2. Kontextspezifische TRAIN-Buttons (Vorlesung/Modul/Alle) im lectureOverview-Menü hinzugefügt
**Betroffene Dateien:** `app.js`, `js/components.js`
**Commit:** `fix: add contextual training buttons to lecture overview menu`

---

## Alerts & Notifications

### ✅ Badge-Anzahl nur auf Modul-Übersicht sichtbar

**Problem:** Das Alert-Badge im Header wurde nur auf der Modul-Übersichtsseite angezeigt, nicht auf anderen Seiten.
**Ursache:**
1. `updateAlertBadge()` wurde nur beim App-Start aufgerufen, nicht bei Navigation
2. `generateHeaderIconButtons` verwendete nicht-existierende `AlertsModule.getUnreadCount()`
**Fix:**
1. `updateAlertBadge()` wird jetzt nach jedem Header-Injection aufgerufen
2. `getAlertBadgeInfo()` wird jetzt korrekt verwendet
3. Badge-Farbe (rot/gelb) wird korrekt übernommen
**Betroffene Dateien:** `js/components.js`, `app.js`

---

## Achievements

### ⬜ Info-Dialog bei abgelaufenem Achievement

**Problem:** Klick auf abgelaufenes Achievement zeigt keinen hilfreichen Dialog.
**Gewünscht:**
1. Info-Dialog: "Du musst den Test nochmal machen, um das Achievement zu verlängern"
2. OK-Button führt direkt zum Test
**Betroffene Dateien:** `js/achievements-ui.js`

### ⬜ Token-Verlängerung auf Achievements-Seite

**Problem:** Achievements können nur über Alerts mit Tokens verlängert werden.
**Gewünscht:** Auch auf der Achievements-Übersichtsseite soll Token-Verlängerung möglich sein.
**Betroffene Dateien:** `js/achievements-ui.js`, `index.html`

---

## Suche

### ⬜ Flexiblere Cheat-Sheet Suche

**Problem:** Suche findet nur exakt "Cheat-Sheet", nicht "Cheatsheet" oder "Cheat Sheet".
**Gewünscht:** Fuzzy-Matching für Varianten:
- "Cheat-Sheet"
- "Cheatsheet"
- "Cheat Sheet"
- "cheat sheet"
**Betroffene Dateien:** `js/search.js`, `scripts/generate-search-index.js`

---

## Content & Validierung

### ⬜ YouTube-Video Validierung verbessern

**Problem:** Manche eingebettete Videos sind nicht verfügbar ("Video unavailable").
**Gewünscht:**
1. Validierungs-Script das prüft ob Videos embeddable sind
2. Fallback: Direkter Link zum YouTube-Video unter dem Embedding anzeigen
**Betroffene Dateien:** `js/lecture.js`, `scripts/validate-content.js`

### ⬜ Formel-Validator erstellen

**Problem:** Manche chemische/mathematische Formeln werden falsch dargestellt (z.B. `\cdotp` statt `·`).
**Gewünscht:** Validierungs-Script das:
1. KaTeX-Formeln auf Syntax-Fehler prüft
2. Chemische Formeln validiert
**Betroffene Dateien:** Neues Script `scripts/validate-formulas.js`

### ⬜ Aufzählungen korrekt darstellen

**Problem:** Manche Aufzählungslisten werden nicht korrekt gerendert.
**Analyse erforderlich:** Beispiele sammeln und Parser prüfen.
**Betroffene Dateien:** `js/parser.js`

### ⬜ Practice-Exercise Rendering unvollständig

**Problem:** Bei practice-exercise Items (z.B. "Warum bemerken wir Materiewellen nicht?") werden nur Titel und Szenario angezeigt, aber die eigentlichen Aufgaben/Tasks fehlen.
**Screenshot:** Vorlesung "Die Elektronenstruktur", Item 43/76
**Analyse erforderlich:** `js/lecture.js` - Rendering von `practice-exercise` Typ prüfen
**Betroffene Dateien:** `js/lecture.js`, `js/quiz.js`

---

## Priorisierung

### Hoch (Funktionale Bugs)

1. ~~Kontextuelles Training funktioniert nicht~~ ✅
2. ~~Badge-Anzahl aktualisiert sich nicht~~ ✅
3. Formel-Darstellung fehlerhaft
4. Practice-Exercise Rendering unvollständig

### Mittel (UX Verbesserungen)

1. Such-Eingabe sticky ✅
2. Info-Dialog bei abgelaufenem Achievement
3. YouTube-Video Validierung & Fallback
4. Flexiblere Cheat-Sheet Suche

### Niedrig (Polish)

1. App Header Drop-Shadow ✅
2. Cheat-Sheet Icon entfernen
3. Cheat-Sheet kleinere Darstellung
4. Cheat-Sheet Fullscreen
5. Token-Verlängerung auf Achievements-Seite

---

## Modul-Map

### ✅ Map zeigt nicht alle Vorlesungen

**Problem:** Die Modul-Map zeigt nur Vorlesungen an, die bereits besucht wurden. Es geht bei der Modul-Map aber darum, einen Überblick über das gesamte Studium zu haben.
**Gewünscht:**
1. Alle Module und Vorlesungen immer anzeigen (aus `modules.json`)
2. Grau dargestellt, wenn noch nichts gemacht wurde
3. Grün dargestellt, wenn der jeweilige Test bestanden wurde
**Betroffene Dateien:** `js/map.js`
**Commit:** `fix: show all lectures in module map (gray=unvisited, green=completed)`

---

## Cheat-Sheets (Weitere Issues)

### ✅ Doppelter Titel im Cheat-Sheet Modal

**Problem:** Der Titel wird einmal im Modal-Header und einmal im Content (als H1) angezeigt.
**Gewünscht:** Titel aus dem Overlay-Body (H1 im Markdown) entfernen.
**Betroffene Dateien:** `js/achievements-ui.js`
**Commit:** `fix: remove duplicate title from cheat-sheet modal`

### ✅ Cheat-Sheets enthalten überflüssigen Text

**Problem:** Manche Cheat-Sheets enthalten Gratulationstexte und andere überflüssige Elemente:
- "Herzlichen Glückwunsch! Du hast das Quiz mit Gold-Status bestanden."
- "Hier ist deine kompakte Zusammenfassung..."
- "💡 Tipp: Drucke dieses Cheat-Sheet aus..."
- "🔄 Gültig für: 30 Tage..."
- "📌 Nächste Schritte..."
**Gewünscht:** Cheat-Sheets sollten NUR die kompakten Lerninhalte auf einer Seite zusammenfassen.
**Betroffene Dateien:** 
- `content/bsc-ernaehrungswissenschaften/achievements.json`
- `scripts/clean-cheatsheets.py` (neues Script zum Bereinigen)
**Commit:** `fix: clean up cheat-sheet content, remove unnecessary text`

---

## Notizen

_Hier können weitere Beobachtungen und Ideen gesammelt werden._
