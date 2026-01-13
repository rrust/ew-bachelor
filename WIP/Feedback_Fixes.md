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

### ⬜ Kein Icon im Titel

**Problem:** Cheat-Sheets zeigen ein Icon im Modal-Titel.
**Gewünscht:** Icon entfernen, nur Text-Titel.
**Betroffene Dateien:** `js/achievements-ui.js`

### ⬜ Kleinere Darstellung auf Mobile

**Problem:** Cheat-Sheets sind auf Mobile zu groß.
**Gewünscht:** Kompaktere Darstellung, kleinere Schriftgröße auf kleinen Screens.
**Betroffene Dateien:** `css/styles.css`, `js/achievements-ui.js`

### ⬜ Fullscreen-Ansicht ermöglichen

**Problem:** Cheat-Sheets können nur im Modal angezeigt werden.
**Gewünscht:** Button für Fullscreen-Ansicht.
**Betroffene Dateien:** `js/achievements-ui.js`, `css/styles.css`

---

## Training & Navigation

### ⬜ Kontextuelles Training funktioniert nicht

**Problem:** Bei kontextuellem Training (aus einer Vorlesung heraus) landet man auf der Modul-Übersicht statt im Training.
**Analyse erforderlich:** Router/Navigation-Logik prüfen.
**Betroffene Dateien:** `js/training.js`, `js/router.js`, `app.js`

---

## Alerts & Notifications

### ⬜ Badge-Anzahl aktualisiert sich nicht

**Problem:** Wenn sich Alerts ändern (z.B. Token-Verlängerung), aktualisiert sich die Badge-Anzahl im Header-Icon nicht.
**Gewünscht:** Badge soll sich reaktiv aktualisieren bei Alert-Änderungen.
**Betroffene Dateien:** `js/alerts.js`, `js/notifications.js`, `app.js`

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

1. Kontextuelles Training funktioniert nicht
2. Badge-Anzahl aktualisiert sich nicht
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

## Notizen

_Hier können weitere Beobachtungen und Ideen gesammelt werden._
