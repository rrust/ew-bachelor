# Navigation Revamp Plan

## Übersicht

Umstrukturierung der Hauptnavigation für bessere UX und Konsistenz.

## Aktuelle Struktur (zu ändern)

```text
Header (current):
┌─────────────────────────────────────────────────────────────────────┐
│ [Study Icon] Study Title │ Greeting │ TRAIN │ 🔥 │ 🔔 │ 🔍 │ ⋮ │
└─────────────────────────────────────────────────────────────────────┘
Menü öffnet sich RECHTS (⋮ Button)
```

## Neue Struktur

### Prinzip: Burger-Menü LINKS (klassisch)

```text
Header (new):
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [Breadcrumb / Title Area]                     │ [Actions] │
└─────────────────────────────────────────────────────────────────────┘
```

## Header-Varianten nach View

### 1. Modul-Übersicht (`module-map-view`) - KEINE ÄNDERUNG

Bleibt wie aktuell, nur Burger-Menü nach LINKS verschieben.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [🍎] Study Title │ - │ Greeting   │ TRAIN │ 🔥 │ 🔔 │ 🔍 │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Vorlesungs-Liste (`lecture-list-container`)

Breadcrumb-Navigation mit Icons.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [🍎] │ [📦 Modul-Title]                    │ DEV │ TRAIN │ 🔍 │
└─────────────────────────────────────────────────────────────────────┘

Legende:
- ☰ = Burger-Menü (öffnet Overlay links)
- 🍎 = Study-Icon (klickbar → Module)
- 📦 = Modul-Icon + Titel (aktuelles Modul)
- TRAIN = Training NUR für dieses Modul (kontextspezifisch!)
```

### 3. Vorlesungs-Player (`lecture-player`)

Kompakter Header mit Icon-Buttons statt Text-Buttons.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [🍎] │ [📦] │ [📖 Vorlesungstitel]         │ [📋] │ [✓] │ 🔍 │
└─────────────────────────────────────────────────────────────────────┘

Legende:
- 🍎 = Study-Icon (→ Module)
- 📦 = Modul-Icon (→ Vorlesungsliste)
- 📖 = Buch-Icon + Vorlesungstitel
- 📋 = Übersicht (Icon statt Text-Button, wie Vorlesungs-Karte)
- ✓ = Test (Icon statt Text-Button, wie Vorlesungs-Karte)
```

### 4. Vorlesungs-Übersicht (`lecture-overview`)

Gleicher Header wie Player, da logisch zusammengehörig.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [🍎] │ [📦] │ [📖 Vorlesungstitel]         │ [📋] │ [✓] │ 🔍 │
└─────────────────────────────────────────────────────────────────────┘
```

### 5. Training-View (`training-view`)

Identisch mit Modul-Übersicht (einfacher Header).

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ☰ │ [🍎] Study Title │ - │ Greeting   │ TRAIN │ 🔥 │ 🔔 │ 🔍 │
└─────────────────────────────────────────────────────────────────────┘
```

## Kontextspezifisches Training

### Logik

| Kontext                       | Train-Button Ziel          |
| ----------------------------- | -------------------------- |
| Modul-Übersicht               | Alle abgeschlossenen Tests |
| Vorlesungs-Liste (Modul X)    | Nur Tests aus Modul X      |
| Vorlesungs-Player (Lecture Y) | Nur Test aus Lecture Y     |

### Implementierung

**URL-Parameter für kontextspezifisches Training:**

```text
#/training                    → Alle Tests
#/training?module=01-chemie   → Nur Modul
#/training?module=01-chemie&lecture=02-atome → Nur Vorlesung
```

**Alternativ über State:**

```javascript
// In app.js - Trainingskontext speichern
window.trainingContext = {
  moduleId: null,    // null = alle Module
  lectureId: null    // null = alle Vorlesungen des Moduls
};
```

## Implementierungsschritte

### Phase 1: Burger-Menü nach links verschieben

**Betroffene Dateien:**

- [js/components.js](../js/components.js) - `createAppHeader()` Funktion

**Änderungen:**

1. Menü-Toggle (☰) als erstes Element im Header
2. Overlay-Panel von rechts nach links ändern (`right-0` → `left-0`)
3. Animation anpassen (`translateX(100%)` → `translateX(-100%)`)

### Phase 2: Breadcrumb-Header für Vorlesungsansichten

**Betroffene Dateien:**

- [js/components.js](../js/components.js) - `createAppHeader()` erweitern
- [js/modules.js](../js/modules.js) - Header-Injection mit Kontext

**Neue Header-Optionen:**

```javascript
createAppHeader('lecture', {
  moduleId: '01-chemie',
  moduleTitle: 'Grundlagen der Chemie',
  moduleIcon: 'beaker',
  lectureId: '02-atome',
  lectureTopic: 'Atome und Formeln',
  showBreadcrumb: true  // Aktiviert Breadcrumb-Navigation
});
```

### Phase 3: Icon-Buttons im Lecture-Player

**Betroffene Dateien:**

- [index.html](../index.html) - `#lecture-player` Header-Bereich

**Änderungen:**

```html
<!-- Alt (Text-Buttons) -->
<button id="lecture-overview-button">Übersicht</button>
<button id="lecture-quiz-button">Test</button>

<!-- Neu (Icon-Buttons) -->
<button id="lecture-overview-button" title="Übersicht">
  <!-- listBullet Icon -->
</button>
<button id="lecture-quiz-button" title="Test">
  <!-- exam Icon -->
</button>
```

### Phase 4: Kontextspezifisches Training

**Betroffene Dateien:**

- [js/training.js](../js/training.js) - `getCompletedTests()` erweitern
- [js/router.js](../js/router.js) - Query-Parameter parsen
- [js/components.js](../js/components.js) - Train-Button mit Kontext

**Neue Funktionen:**

```javascript
// training.js
async function getCompletedTestsFiltered(moduleId = null, lectureId = null) {
  const allTests = await getCompletedTests();
  
  if (lectureId && moduleId) {
    return allTests.filter(t => 
      t.moduleId === moduleId && t.lectureId === lectureId
    );
  }
  
  if (moduleId) {
    return allTests.filter(t => t.moduleId === moduleId);
  }
  
  return allTests;
}
```

## Icon-Referenz

| Icon-Name    | Verwendung                      |
| ------------ | ------------------------------- |
| `menuDots`   | Burger-Menü (3 Punkte vertikal) |
| `listBullet` | Übersicht-Button                |
| `exam`       | Test-Button                     |
| `book`       | Vorlesung/Buch                  |
| `modules`    | Modul-Icon (default)            |
| `search`     | Suche                           |
| `fire`       | Streak                          |
| `bell`       | Benachrichtigungen              |

**Neues Icon benötigt:**

- `hamburger` oder `menu` - Klassisches Burger-Menü (3 horizontale Linien)

Aktuell existiert `listBullet` - kann ggf. verwendet werden:

```javascript
listBullet: '<path stroke-linecap="round" stroke-linejoin="round" 
  stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
```

## Checkliste

### Phase 1: Burger-Menü links

- [x] Icon `listBullet` für Burger-Menü verwenden (bereits vorhanden)
- [x] `createAppHeader()` - Menü-Toggle als erstes Element
- [x] Overlay-Panel Position: `left-0` statt `right-0`
- [x] Animation: Von links einschieben

### Phase 2: Breadcrumb-Navigation

- [x] Neue Header-Variante `lecturePlayer` in `createAppHeader()`
- [x] Klickbare Icons für Study → Module → Lecture Navigation
- [x] Header dynamisch in `app.js` injiziert

### Phase 3: Icon-Buttons

- [x] Player-Header: Text-Buttons durch Icon-Buttons ersetzen
- [x] Icons konsistent mit Lecture-Karten (`listBullet`, `exam`)
- [x] Tooltips für Accessibility

### Phase 4: Kontextspezifisches Training

- [x] `trainingContext` in State speichern
- [x] `getCompletedTestsFiltered()` implementieren
- [x] Train-Button URL/State entsprechend setzen
- [x] Training-View zeigt Kontext-Info an

## Risiken & Fallbacks

| Risiko                         | Mitigation                             |
| ------------------------------ | -------------------------------------- |
| Zu viele Klicks für Navigation | Breadcrumb bleibt immer sichtbar       |
| Mobile: Icons zu klein         | Min-Touch-Target 44x44px               |
| Kontext-Training ohne Tests    | Fallback auf alle Tests + Info-Meldung |

## Zeitschätzung

| Phase      | Aufwand |
| ---------- | ------- |
| 1          | 1h      |
| 2          | 2h      |
| 3          | 30min   |
| 4          | 1.5h    |
| **Gesamt** | **5h**  |
