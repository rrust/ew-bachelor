# Implementierungsplan: Neue Features für Modul 2

> **Status:** ✅ Implementiert
>
> **Erstellt:** 2026-01-10
>
> **Implementiert:** 2026-01-10
>
> **Priorität:** Vor Content-Generierung abschließen

---

## Übersicht

Bevor der Content für Modul 2 (Chemie) generiert werden kann, müssen folgende technische Features implementiert werden:

| Feature             | Priorität | Aufwand | Status          |
| ------------------- | --------- | ------- | --------------- |
| KaTeX für Formeln   | 🔴 Hoch    | Klein   | ✅ Implementiert |
| External-Video Type | 🟡 Mittel  | Klein   | ✅ Implementiert |

---

## Feature 1: KaTeX für mathematische Formeln

### Problem

Chemie-Inhalte enthalten viele Formeln wie:

- $E = mc^2$
- $\rho = \frac{m}{V}$
- $T(K) = t(°C) + 273.15$
- $2~H_{2}(g) + O_{2}(g) \rightarrow 2~H_{2}O(g)$

Aktuell werden diese als Plaintext angezeigt, da kein Math-Renderer eingebunden ist.

### Lösung

KaTeX via CDN einbinden mit Auto-Render für `$...$` (inline) und `$$...$$` (block).

### Implementierung

#### 1. index.html - CDN Links hinzufügen

Nach der Tailwind-Script-Zeile einfügen:

```html
<!-- KaTeX for math rendering -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

#### 2. js/lecture.js - Auto-Render aufrufen

Nach dem Rendern von `learning-content` KaTeX triggern:

```javascript
// In renderCurrentLectureItem, nach case 'learning-content':
if (window.renderMathInElement) {
  renderMathInElement(lectureItemDisplay, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    throwOnError: false
  });
}
```

#### 3. js/quiz.js - Auch für Quiz-Fragen

Gleiches Pattern für Quiz-Anzeige.

#### 4. js/achievements.js - Auch für Achievements

Cheat-Sheets können auch Formeln enthalten.

### Testfälle

- [x] Inline-Formel: `$E=mc^2$` wird korrekt gerendert
- [x] Block-Formel: `$$\frac{m}{V}$$` wird zentriert angezeigt
- [x] Chemische Gleichung: `$2H_2 + O_2 \rightarrow 2H_2O$`
- [x] Dark Mode: Formeln sind lesbar
- [x] Mobile: Formeln skalieren korrekt

### Risiken

- **Performance:** KaTeX ist ~200KB, aber wird gecached
- **Offline:** Muss ins Service-Worker-Caching aufgenommen werden

---

## Feature 2: External-Video Content Type

### Problem

Manche Vorlesungsvideos liegen auf Uni-Moodle und erfordern Login. Diese können nicht eingebettet werden, sondern müssen extern geöffnet werden.

### Lösung

Neuer Content-Type `external-video` der einen Link mit Beschreibung anzeigt.

### Content-Format

```yaml
---
type: 'external-video'
url: 'https://moodle.univie.ac.at/mod/page/view.php?id=12345'
title: 'Vorlesung 1: Materie und Messen'
description: 'Öffnet die Uni-Wien Moodle-Seite (Login erforderlich)'
duration: '45 min'
---
```

### Implementierung

#### 1. js/lecture.js - Neue Render-Funktion

```javascript
/**
 * Renders an external video link
 * @param {Object} item - Video item with url, title, description, duration
 * @param {HTMLElement} container - Container element
 */
function renderExternalVideo(item, container) {
  const title = item.title || 'Externes Video';
  const description = item.description || 'Öffnet in neuem Tab';
  const duration = item.duration ? `<span class="text-sm text-gray-500">(${item.duration})</span>` : '';
  
  container.innerHTML = `
    <div class="external-video-container p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
      <div class="text-4xl mb-4">🎬</div>
      <h3 class="text-xl font-bold mb-2">${title} ${duration}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">${description}</p>
      <a href="${item.url}" 
         target="_blank" 
         rel="noopener noreferrer"
         class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">
        <span>Video öffnen</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Nach dem Ansehen hierher zurückkehren und fortfahren.
      </p>
    </div>
  `;
}
```

#### 2. js/lecture.js - Switch-Case erweitern

```javascript
case 'external-video':
  renderExternalVideo(item, lectureItemDisplay);
  break;
```

#### 3. js/parser.js - Type erkennen

```javascript
} else if (item.type === 'external-video') {
  // URL, title, description, duration are already in attributes
}
```

#### 4. docs/CONTENT_TEMPLATES.md - Dokumentation

Template für neuen Type hinzufügen.

### Testfälle

- [x] Link öffnet in neuem Tab
- [x] Styling passt zu Light/Dark Mode
- [x] Mobile-Darstellung funktioniert
- [x] Ohne optionale Felder (description, duration) funktioniert es

---

## Implementierungs-Reihenfolge

1. ✅ **KaTeX einbinden** (index.html)
2. ✅ **KaTeX Auto-Render** in lecture.js, quiz.js, achievements-ui.js
3. ✅ **Service Worker Update** für KaTeX-Caching
4. ✅ **External-Video Type** in lecture.js
5. ✅ **Parser Update** in parser.js (nicht nötig - Typ wird automatisch erkannt)
6. ✅ **Dokumentation** in CONTENT_TEMPLATES.md
7. ⏳ **Tests** durchführen (Test-Dateien erstellt)
8. ⏳ **Content-Generierung** starten

---

## Akzeptanzkriterien

### KaTeX

- [x] `$E=mc^2$` wird als schöne Formel gerendert
- [x] Block-Formeln sind zentriert
- [x] Funktioniert in Lecture-Items, Quiz, Self-Assessment, Achievements
- [x] Dark Mode kompatibel
- [x] Offline-fähig (Service Worker)

### External-Video

- [x] Neuer Content-Type wird erkannt
- [x] Link öffnet externen Tab
- [x] Benutzerfreundliche Darstellung mit Icon
- [x] Template-Dokumentation vorhanden

---

## Zeitschätzung

| Task                    | Zeit       |
| ----------------------- | ---------- |
| KaTeX CDN + Auto-Render | 30 min     |
| Service Worker Update   | 15 min     |
| External-Video Type     | 30 min     |
| Dokumentation           | 15 min     |
| Tests                   | 30 min     |
| **Gesamt**              | ~2 Stunden |

---

## Nach Implementierung

Wenn beide Features implementiert sind:

1. [x] Branch erstellen: `feature/katex-external-video`
2. [ ] Änderungen committen
3. [ ] Pull Request erstellen
4. [ ] Nach Merge: Content-Generierung starten
