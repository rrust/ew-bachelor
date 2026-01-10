# Implementierungsplan: Multi-Study-Architektur

## Übersicht

Transformation der App von einer Einzelstudiengangslösung zu einer allgemeinen Lern-App, die mehrere Studiengänge unterstützt.

### Neues Domänenmodell

```text
Study (Studiengang)
  └── Module
        └── Lecture (Vorlesung)
              └── Lecture Item
```

---

## 1. Betroffene Bereiche – Analyse

### 1.1 Aktuelle Ordnerstruktur

```text
content/
  ├── modules.json          ← Modul-Metadaten (studiengang-spezifisch!)
  ├── content-list.json     ← Auto-generierte Dateiliste
  ├── 01-ernaehrungslehre-grundlagen/
  │     ├── module.md
  │     └── 01-grundlagen-zellbiologie/
  │           ├── lecture.md
  │           ├── quiz.md
  │           └── lecture-items/
  └── ...
studium/                    ← Aktuell: Infos zum Studiengang (unstrukturiert)
```

### 1.2 Neue Ordnerstruktur (Ziel)

```text
studies/                    ← Umbenannt von "studium"
  ├── studies.json          ← Metadaten aller Studiengänge
  └── bsc-ernaehrungswissenschaften/
        ├── study.md        ← Studiengangs-Beschreibung (aus BSc_Ernaehrungswissenschaften.md)
        └── README.md

content/
  └── bsc-ernaehrungswissenschaften/   ← Neuer Study-Level
        ├── modules.json
        ├── content-list.json
        ├── 01-ernaehrungslehre-grundlagen/
        │     ├── module.md
        │     └── 01-grundlagen-zellbiologie/
        │           └── ...
        └── ...
```

---

## 2. Neue Dateien

### 2.1 `studies/studies.json`

Master-Liste aller verfügbaren Studiengänge:

```json
[
  {
    "id": "bsc-ernaehrungswissenschaften",
    "title": "BSc Ernährungswissenschaften",
    "shortTitle": "EW Bachelor",
    "university": "Universität Wien",
    "description": "Bachelorstudium Ernährungswissenschaften",
    "ects": 180,
    "semesters": 6,
    "icon": "🍎",
    "status": "active",
    "order": 1
  },
  {
    "id": "msc-ernaehrungswissenschaften",
    "title": "MSc Ernährungswissenschaften",
    "shortTitle": "EW Master",
    "university": "Universität Wien",
    "description": "Masterstudium Ernährungswissenschaften",
    "ects": 120,
    "semesters": 4,
    "icon": "🎓",
    "status": "coming-soon",
    "order": 2
  }
]
```

### 2.2 `studies/{study-id}/study.md`

Studiengangs-Beschreibung mit YAML Frontmatter:

```yaml
---
id: bsc-ernaehrungswissenschaften
title: Bachelorstudium Ernährungswissenschaften
university: Universität Wien
ects: 180
semesters: 6
curriculum_version: "September 2018"
---

# Bachelorstudium Ernährungswissenschaften

## Überblick
...
```

---

## 3. Betroffene JavaScript-Module

### 3.1 `js/state.js` – Erweiterung des AppState

```javascript
// Neu: Study-Level State
const AppState = {
  currentStudyId: null,        // NEU
  studies: [],                 // NEU: Alle verfügbaren Studiengänge
  content: {},
  modules: [],
  // ... rest unchanged
};

// Neue Getter/Setter
const getCurrentStudy = () => AppState.currentStudyId;
const getStudies = () => AppState.studies;
const setCurrentStudy = (id) => (AppState.currentStudyId = id);
const setStudies = (studies) => (AppState.studies = studies);
```

### 3.2 `js/progress.js` – Study-spezifische localStorage

**Aktuell:**

```javascript
const PROGRESS_KEY = 'userProgress';
// Struktur: { userName, modules: {...} }
```

**Neu: Study-namespaced Keys:**

```javascript
// Basis-Key für globale Einstellungen
const GLOBAL_SETTINGS_KEY = 'appSettings';

// Study-spezifischer Progress Key
function getProgressKey(studyId) {
  return `progress_${studyId}`;
}

// Globale Einstellungen (Theme, aktiver Study, etc.)
function getAppSettings() {
  const settings = localStorage.getItem(GLOBAL_SETTINGS_KEY);
  return settings ? JSON.parse(settings) : {
    activeStudyId: null,
    userName: null,
    theme: 'light'
  };
}

function saveAppSettings(settings) {
  localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
}

// Study-spezifischer Fortschritt
function getUserProgress(studyId = null) {
  const activeStudy = studyId || getAppSettings().activeStudyId;
  if (!activeStudy) return null;
  
  const key = getProgressKey(activeStudy);
  const progress = localStorage.getItem(key);
  return progress ? JSON.parse(progress) : null;
}

function saveUserProgress(progressData, studyId = null) {
  const activeStudy = studyId || getAppSettings().activeStudyId;
  if (!activeStudy) return;
  
  const key = getProgressKey(activeStudy);
  localStorage.setItem(key, JSON.stringify(progressData));
}
```

**LocalStorage Struktur (neu):**

```javascript
// Globale App-Einstellungen
localStorage['appSettings'] = {
  userName: "Max",
  activeStudyId: "bsc-ernaehrungswissenschaften",
  theme: "dark"
}

// Pro Studiengang ein eigener Fortschritts-Eintrag
localStorage['progress_bsc-ernaehrungswissenschaften'] = {
  startedAt: "2026-01-10T12:00:00Z",
  modules: { ... }
}

localStorage['progress_msc-ernaehrungswissenschaften'] = {
  startedAt: "2026-02-15T14:00:00Z",
  modules: { ... }
}
```

### 3.3 `js/parser.js` – Study-aware Content Loading

```javascript
/**
 * Gets the content path for a specific study
 * @param {string} studyId - Study ID
 * @returns {string} Content base path
 */
function getStudyContentPath(studyId) {
  const basePath = getBasePath();
  return `${basePath}content/${studyId}/`;
}

/**
 * Loads studies metadata from studies.json
 * @returns {Promise<Array>} Array of study objects
 */
async function loadStudies() {
  const basePath = getBasePath();
  const response = await fetch(`${basePath}studies/studies.json`);
  return response.json();
}

/**
 * Loads modules for a specific study
 * @param {string} studyId - Study ID
 * @returns {Promise<Array>} Array of module objects
 */
async function loadModulesForStudy(studyId) {
  const contentPath = getStudyContentPath(studyId);
  const response = await fetch(`${contentPath}modules.json`);
  return response.json();
}

/**
 * Parses content for a specific study
 * @param {string} studyId - Study ID
 * @returns {Promise<Object>} Parsed content
 */
async function parseContentForStudy(studyId) {
  const contentPath = getStudyContentPath(studyId);
  const response = await fetch(`${contentPath}content-list.json`);
  const fileList = await response.json();
  // ... rest of parsing logic, using contentPath as base
}
```

### 3.4 `app.js` – Neue Initialisierungslogik

```javascript
async function init() {
  // 1. Load available studies
  const studies = await loadStudies();
  setStudies(studies);
  
  // 2. Check for saved user settings
  const settings = getAppSettings();
  
  // 3. Determine if user needs to select a study
  if (!settings.activeStudyId || !settings.userName) {
    showStudySelectionView();
    return;
  }
  
  // 4. Load content for active study
  setCurrentStudy(settings.activeStudyId);
  MODULES = await loadModulesForStudy(settings.activeStudyId);
  APP_CONTENT = await parseContentForStudy(settings.activeStudyId);
  
  // 5. Continue with existing logic...
  const progress = getUserProgress();
  if (progress) {
    // ... show module map
  }
}
```

### 3.5 `js/components.js` – Neue Header-Navigation

```javascript
function createAppHeader(view = 'moduleMap', options = {}) {
  // ... existing code ...
  
  // NEU: Study-Switcher im Header (wenn eingeloggt)
  const studySwitcher = `
    <button 
      id="nav-study-switch"
      class="..." 
      title="Studiengang wechseln"
    >
      📚 Studiengang
    </button>
  `;
  
  // In Navigation einfügen
}
```

---

## 4. Neue UI-Komponenten

### 4.1 Study Selection View (`study-selection-view`)

Wird angezeigt wenn:
- Erstmaliger App-Start (kein User)
- User klickt auf "Studiengang wechseln"

```html
<div id="study-selection-view" class="hidden">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Wähle deinen Studiengang</h1>
    
    <!-- Study Cards Grid -->
    <div id="study-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Dynamically populated -->
    </div>
  </div>
</div>
```

### 4.2 Study Card Component

```javascript
function createStudyCard(study, onClick) {
  const card = document.createElement('div');
  card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition';
  
  const isAvailable = study.status === 'active';
  
  card.innerHTML = `
    <div class="text-4xl mb-4">${study.icon}</div>
    <h2 class="text-xl font-bold mb-2">${study.title}</h2>
    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${study.university}</p>
    <div class="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span>${study.ects} ECTS</span>
      <span>•</span>
      <span>${study.semesters} Semester</span>
    </div>
    ${!isAvailable ? '<span class="mt-4 inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Demnächst verfügbar</span>' : ''}
  `;
  
  if (isAvailable) {
    card.addEventListener('click', () => onClick(study.id));
  } else {
    card.classList.add('opacity-60', 'cursor-not-allowed');
  }
  
  return card;
}
```

### 4.3 Menu Entry für Studiengangswechsel

Im Tools-View oder als Main-Navigation-Button:

```javascript
// Option 1: In Tools-View
<button id="switch-study-button" class="...">
  📚 Studiengang wechseln
</button>

// Option 2: In Header-Navigation (zusätzlicher Button)
<button id="nav-study-switch" class="..." title="Studiengang wechseln">
  📚
</button>
```

---

## 5. URL-Routing Erweiterung

### 5.1 Neue Route-Patterns

```javascript
// Aktuell
#/module/{moduleId}/lecture/{lectureId}

// Neu (study-prefix)
#/{studyId}/module/{moduleId}/lecture/{lectureId}

// Alternative: Study aus State (kein URL-Prefix)
// → Einfacher, aber Deeplinks funktionieren nur mit korrektem State
```

**Empfehlung:** Study im URL-Prefix für Deeplink-Kompatibilität:

```javascript
function parseURL() {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === '/') return null;
  
  const parts = hash.split('/').filter(p => p);
  const route = {};
  
  // Prüfe ob erstes Part ein bekannter Study-ID ist
  const studies = getStudies();
  const firstPartIsStudy = studies.some(s => s.id === parts[0]);
  
  if (firstPartIsStudy) {
    route.studyId = parts.shift();  // Remove and capture study ID
  }
  
  route.view = parts[0];
  // ... rest of parsing
  
  return route;
}
```

### 5.2 URL-Beispiele

```text
# Study Selection
#/study-select

# Module Overview für einen Studiengang
#/bsc-ernaehrungswissenschaften/

# Spezifisches Modul
#/bsc-ernaehrungswissenschaften/module/01-ernaehrungslehre-grundlagen

# Lecture
#/bsc-ernaehrungswissenschaften/module/01-ernaehrungslehre-grundlagen/lecture/01-grundlagen-zellbiologie
```

---

## 6. Content-Generierung Anpassung

### 6.1 `generate-content-list.js` Erweiterung

```javascript
const STUDIES_DIR = path.join(__dirname, 'studies');
const CONTENT_DIR = path.join(__dirname, 'content');

// Generiert für jeden Study-Ordner eigene content-list.json und modules.json
function generateContentForAllStudies() {
  const studyFolders = fs.readdirSync(CONTENT_DIR)
    .filter(f => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory());
  
  for (const studyId of studyFolders) {
    const studyContentDir = path.join(CONTENT_DIR, studyId);
    generateContentListForStudy(studyId, studyContentDir);
    generateModulesJsonForStudy(studyId, studyContentDir);
  }
}
```

---

## 7. Migration bestehender Inhalte

### 7.1 Migrations-Schritte

1. **Ordner umbenennen:**

   ```bash
   mv studium/ studies/
   ```

2. **Studies.json erstellen:**

   ```bash
   # In studies/studies.json
   ```

3. **Content restructurieren:**

   ```bash
   mkdir content/bsc-ernaehrungswissenschaften
   mv content/*.json content/bsc-ernaehrungswissenschaften/
   mv content/01-*/ content/bsc-ernaehrungswissenschaften/
   # ... etc
   ```

4. **content-list.json regenerieren:**

   ```bash
   node generate-content-list.js
   ```

5. **localStorage Migration (einmalig beim Update):**

   ```javascript
   function migrateProgressToNewFormat() {
     const oldProgress = localStorage.getItem('userProgress');
     if (oldProgress && !localStorage.getItem('appSettings')) {
       // Migrate to new format
       const parsed = JSON.parse(oldProgress);
       const defaultStudyId = 'bsc-ernaehrungswissenschaften';
       
       // Create app settings
       const settings = {
         userName: parsed.userName,
         activeStudyId: defaultStudyId,
         theme: localStorage.getItem('theme') || 'light'
       };
       localStorage.setItem('appSettings', JSON.stringify(settings));
       
       // Move progress to study-specific key
       delete parsed.userName;  // userName now in appSettings
       localStorage.setItem(`progress_${defaultStudyId}`, JSON.stringify(parsed));
       
       // Remove old key
       localStorage.removeItem('userProgress');
     }
   }
   ```

---

## 8. Übersehene Aspekte & Zusätzliche Überlegungen

### 8.1 Export/Import von Fortschritt

**Aktuell:** Export als einzelne JSON-Datei  
**Neu:** Muss angepasst werden für Multi-Study

```javascript
function exportProgress() {
  const settings = getAppSettings();
  const allProgress = {};
  
  // Sammle Fortschritt für alle Studies
  for (const study of getStudies()) {
    const key = getProgressKey(study.id);
    const progress = localStorage.getItem(key);
    if (progress) {
      allProgress[study.id] = JSON.parse(progress);
    }
  }
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    settings: settings,
    progress: allProgress
  };
  
  // ... download
}
```

### 8.2 Achievement System

**Betroffene Dateien:**
- `js/achievements.js`
- `js/achievements-ui.js`

**Anpassungen:**
- Achievements sind pro Study (bereits im Content-Ordner)
- Progress-Check muss Study-aware sein
- `APP_CONTENT.achievements` muss studienspezifisch geladen werden

### 8.3 Search-Funktionalität

**Betroffene Datei:** `js/search.js`

**Anpassungen:**
- Suche erfolgt nur im aktuellen Studiengang
- Optional: Cross-Study-Suche als erweitertes Feature

### 8.4 Progress Dashboard

**Betroffene Datei:** `js/progress-view.js`

**Anpassungen:**
- Zeigt nur Fortschritt des aktiven Studiengangs
- Optional: Übersicht über alle Studiengänge mit Fortschritts-Badges

### 8.5 PWA/Service Worker

**Betroffene Datei:** `sw.js`

**Anpassungen:**
- Cache muss für mehrere Studies funktionieren
- Offline-Funktionalität pro Study

### 8.6 Title/Header Dynamik

**Aktuell:** Hardcoded "BSc Ernährungswissenschaften" in `components.js`

**Neu:** Dynamisch basierend auf aktivem Study:

```javascript
const study = getStudies().find(s => s.id === getCurrentStudy());
const title = study?.shortTitle || 'Lern-App';
```

### 8.7 Validierung

**Betroffene Datei:** `validate-content.html`

**Anpassungen:**
- Muss alle Studies validieren können
- Study-Selector im Validator-UI

---

## 9. Implementierungsreihenfolge

### Phase 1: Grundstruktur (1-2 Tage)

1. ☐ `studies/studies.json` erstellen
2. ☐ `js/state.js` erweitern
3. ☐ `js/progress.js` für Multi-Study anpassen
4. ☐ Migration-Funktion für bestehenden Progress

### Phase 2: Content-Struktur (1 Tag)

1. ☐ Content-Ordner umstrukturieren
2. ☐ `generate-content-list.js` anpassen
3. ☐ `js/parser.js` für Study-Parameter anpassen

### Phase 3: UI-Komponenten (1-2 Tage)

1. ☐ Study Selection View in `index.html`
2. ☐ Study Card Component in `js/components.js` oder neues `js/studies.js`
3. ☐ Header anpassen (Study-Switch-Button)
4. ☐ App-Flow in `app.js` anpassen

### Phase 4: Navigation & Routing (1 Tag)

1. ☐ URL-Routing erweitern in `js/navigation.js`
2. ☐ `app.js` navigateFromURL anpassen

### Phase 5: Finalisierung (1 Tag)

1. ☐ Export/Import anpassen
2. ☐ Validator anpassen
3. ☐ Tests durchführen
4. ☐ Dokumentation aktualisieren

---

## 10. Risiken & Mitigationen

| Risiko                             | Wahrscheinlichkeit | Auswirkung          | Mitigation                                             |
| ---------------------------------- | ------------------ | ------------------- | ------------------------------------------------------ |
| localStorage-Migration fehlerhaft  | Mittel             | Hoch (Datenverlust) | Backup vor Migration, Rollback-Funktion                |
| Deeplinks funktionieren nicht mehr | Mittel             | Mittel              | Fallback auf Study-Selection wenn Study nicht gefunden |
| Content-Pfade brechen              | Niedrig            | Hoch                | Automatisierte Tests vor Deployment                    |
| Service Worker Cache-Konflikte     | Mittel             | Mittel              | Cache-Version erhöhen, Clear-Cache bei Major Update    |

---

## 11. Zusammenfassung der betroffenen Dateien

### Muss geändert werden

| Datei                      | Art der Änderung           |
| -------------------------- | -------------------------- |
| `js/state.js`              | State-Erweiterung          |
| `js/progress.js`           | Komplett überarbeiten      |
| `js/parser.js`             | Study-Parameter hinzufügen |
| `app.js`                   | Init-Flow, View-Logik      |
| `js/components.js`         | Header, neue Components    |
| `js/navigation.js`         | URL-Parsing erweitern      |
| `generate-content-list.js` | Multi-Study Support        |
| `index.html`               | Study Selection View       |
| `validate-content.html`    | Study-Selector             |

### Möglicherweise anzupassen

| Datei                 | Grund                               |
| --------------------- | ----------------------------------- |
| `js/achievements.js`  | Study-aware Progress-Check          |
| `js/search.js`        | Suche auf aktiven Study beschränken |
| `js/progress-view.js` | Study-spezifische Anzeige           |
| `sw.js`               | Multi-Study Caching                 |

### Neue Dateien

| Datei                      | Zweck                      |
| -------------------------- | -------------------------- |
| `studies/studies.json`     | Master-Liste aller Studies |
| `js/studies.js` (optional) | Study-Management Modul     |
| `content/{study-id}/`      | Pro Study ein Unterordner  |

---

## 12. Entscheidungen

| Frage                    | Entscheidung                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **URL-Strategie**        | Study-ID in URL für Deeplink-Funktionalität                                                                                                    |
| **Cross-Study Features** | Immer nur ein aktiver Study, aber Wechsel jederzeit möglich                                                                                    |
| **Fortschritts-Reset**   | Kein automatischer Reset beim Wechsel – Progress bleibt erhalten (separater localStorage pro Study). Expliziter Reset ggf. später als Feature. |
| **Naming-Konvention**    | Code: `study` / UI: "Studiengang"                                                                                                              |
